import { IUnifiedInput } from "./Input"
import { Binding, ConfigMap } from "./Binding"

const DEFAULT_THRESHOLD = 0.01
const DEAD_ZONE = 0.1

export class UnifiedInput<ActionId extends string> implements IUnifiedInput<ActionId> {
    private readonly ac = new AbortController()

    // ---- キーボード生状態 (イベント駆動) ----
    private readonly keyPressed = new Set<string>()
    private readonly keyPushed = new Set<string>()
    private readonly keyReleased = new Set<string>()

    // ---- 前フレームのアクション状態 (比較用) ----
    private lastActionPressed = new Set<ActionId>()

    // ---- 現在の計算済みアクション状態 ----
    private readonly actionPressed = new Set<ActionId>()
    private readonly actionPushed = new Set<ActionId>()
    private readonly actionReleased = new Set<ActionId>()
    private readonly actionAxis = new Map<ActionId, number>()

    /**
     * @param config ConfigMap
     */
    constructor(private config: ConfigMap<ActionId>) {
        const { signal } = this.ac

        window.addEventListener(
            "keydown",
            (e: KeyboardEvent) => {
                if (this.isTrackedCode(e.code)) e.preventDefault()
                if (!this.keyPressed.has(e.code)) this.keyPushed.add(e.code)
                this.keyPressed.add(e.code)
            },
            { signal },
        )

        window.addEventListener(
            "keyup",
            (e: KeyboardEvent) => {
                this.keyReleased.add(e.code)
                this.keyPressed.delete(e.code)
            },
            { signal },
        )

        window.addEventListener(
            "blur",
            () => {
                this.keyPressed.clear()
            },
            { signal },
        )
    }

    updateConfig(config: ConfigMap<ActionId>) {
        this.config = config
    }

    isPressed(action: ActionId): boolean {
        return this.actionPressed.has(action)
    }
    isPushed(action: ActionId): boolean {
        return this.actionPushed.has(action)
    }
    isReleased(action: ActionId): boolean {
        return this.actionReleased.has(action)
    }
    getAxis(action: ActionId): number {
        return this.actionAxis.get(action) ?? 0
    }

    tick(): void {
        // 現在の状態を計算する前に、前フレームの pressed 状態を保存
        this.lastActionPressed = new Set(this.actionPressed)

        this.computeActionStates()

        // キーボードの瞬間フラグをクリア
        this.keyPushed.clear()
        this.keyReleased.clear()
    }

    remove(): void {
        this.ac.abort()
        this.keyPressed.clear()
    }

    private computeActionStates(): void {
        this.actionPressed.clear()
        this.actionPushed.clear()
        this.actionReleased.clear()
        this.actionAxis.clear()

        // 全ての有効なゲームパッドを取得
        const gamepads = Array.from(navigator.getGamepads()).filter((p): p is Gamepad => p !== null)

        for (const [id, bindings] of Object.entries(this.config)) {
            const action = id as ActionId
            let isAnyDevicePressed = false
            let maxAxisValue = 0

            // キーボードの「瞬間的な押し/離し」はイベントから直接反映
            let hasKeyPushed = false
            let hasKeyReleased = false

            for (const binding of bindings as Binding[]) {
                switch (binding.device) {
                    case "keyboard": {
                        if (this.keyPressed.has(binding.code)) isAnyDevicePressed = true
                        if (this.keyPushed.has(binding.code)) hasKeyPushed = true
                        if (this.keyReleased.has(binding.code)) hasKeyReleased = true
                        if (this.keyPressed.has(binding.code) && Math.abs(maxAxisValue) < 1) maxAxisValue = 1
                        break
                    }
                    case "keyboardAxis": {
                        const neg = this.keyPressed.has(binding.negative) ? -1 : 0
                        const pos = this.keyPressed.has(binding.positive) ? 1 : 0
                        const val = neg + pos
                        if (Math.abs(val) > Math.abs(maxAxisValue)) maxAxisValue = val
                        if (val !== 0) isAnyDevicePressed = true
                        break
                    }
                    // ゲームパッドは全ての接続済みパッドをチェック
                    case "gamepadButton": {
                        for (const pad of gamepads) {
                            if (pad.buttons[binding.index]?.pressed) {
                                isAnyDevicePressed = true
                                if (Math.abs(maxAxisValue) < 1) maxAxisValue = 1
                            }
                        }
                        break
                    }
                    case "gamepadAxisDigital": {
                        for (const pad of gamepads) {
                            const threshold = binding.threshold ?? DEFAULT_THRESHOLD
                            const raw = pad.axes[binding.axis] ?? 0
                            const active = binding.direction === "+" ? raw > threshold : raw < -threshold
                            if (active) {
                                isAnyDevicePressed = true
                                if (Math.abs(maxAxisValue) < 1) maxAxisValue = 1
                            }
                        }
                        break
                    }
                    case "gamepadAxisAnalog": {
                        for (const pad of gamepads) {
                            const raw = pad.axes[binding.axis] ?? 0
                            const val = Math.abs(raw) > DEAD_ZONE ? raw : 0
                            if (Math.abs(val) > Math.abs(maxAxisValue)) maxAxisValue = val
                            if (val !== 0) isAnyDevicePressed = true
                        }
                        break
                    }
                }
            }

            // 最終的なアクション状態の決定
            if (isAnyDevicePressed) this.actionPressed.add(action)
            this.actionAxis.set(action, maxAxisValue)

            // Pushed判定:
            // 1. キーボードイベントでこのアクションに紐づくキーが押された
            // 2. もしくは、前フレームで押されておらず、今フレームでいずれかのデバイスが押された
            if (hasKeyPushed || (isAnyDevicePressed && !this.lastActionPressed.has(action))) {
                this.actionPushed.add(action)
            }

            // Released判定:
            // 1. キーボードイベントでこのアクションに紐づくキーが離された
            // 2. もしくは、前フレームで押されており、今フレームで全てのデバイスが離された
            if (hasKeyReleased || (!isAnyDevicePressed && this.lastActionPressed.has(action))) {
                this.actionReleased.add(action)
            }
        }
    }

    private isTrackedCode(code: string): boolean {
        for (const bindings of Object.values(this.config)) {
            for (const b of bindings as Binding[]) {
                if (b.device === "keyboard" && b.code === code) return true
                if (b.device === "keyboardAxis" && (b.negative === code || b.positive === code)) return true
            }
        }
        return false
    }
}
