/**
 * UnifiedInput.ts
 *
 * キーボード・ゲームパッド・タッチを IUnifiedInput として統合する実装クラス。
 *
 * フレームサイクル:
 *   1. キーボードイベントは非同期に keyPressed / keyPushed / keyReleased を更新する
 *   2. tick() でゲームパッドをポーリングし、全アクション状態を計算する
 *   3. ゲームロジックが isPressed / isPushed / isReleased / getAxis / getPointerDelta を読む
 *   4. 次の tick() でフレーム単位のセット (pushed / released) がリセットされる
 */

import { IUnifiedInput, PointerDelta } from "./Input"
import { Binding, ConfigMap } from "./Binding"
import { TouchTracker } from "./TouchTracker"

const DEFAULT_THRESHOLD = 0.1
const DEAD_ZONE = 0.1

export class UnifiedInput<ActionId extends string> implements IUnifiedInput<ActionId> {
    private readonly ac = new AbortController()
    private readonly touch: TouchTracker

    // ---- キーボード生状態 ----
    /** 現在押し続けられているキー (code) */
    private readonly keyPressed = new Set<string>()
    /** このフレームで押された瞬間のキー (code) */
    private readonly keyPushed = new Set<string>()
    /** このフレームで離されたキー (code) */
    private readonly keyReleased = new Set<string>()

    // ---- ゲームパッド前フレーム状態 ----
    private prevButtons: boolean[] = []
    private prevAxes: number[] = []

    // ---- 計算済みアクション状態 ----
    private readonly actionPressed = new Set<ActionId>()
    private readonly actionPushed = new Set<ActionId>()
    private readonly actionReleased = new Set<ActionId>()
    private readonly actionAxis = new Map<ActionId, number>()

    /**
     * @param config       ConfigMap (DEFAULT_CONFIG またはユーザー設定)
     * @param gamepadIndex 使用するゲームパッドのインデックス (通常 0)
     * @param touchElement タッチ追跡対象の HTML 要素
     */
    constructor(
        private readonly config: ConfigMap<ActionId>,
        private readonly gamepadIndex: number,
        touchElement: HTMLElement,
    ) {
        this.touch = new TouchTracker(touchElement)
        const { signal } = this.ac

        window.addEventListener(
            "keydown",
            (e: KeyboardEvent) => {
                // ConfigMap に含まれるキーのみ preventDefault する
                if (this.isTrackedCode(e.code)) e.preventDefault()

                if (!this.keyPressed.has(e.code)) {
                    this.keyPushed.add(e.code)
                }
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

    // ----------------------------------------------------------------
    // IUnifiedInput 実装
    // ----------------------------------------------------------------

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

    getPointerDelta(): PointerDelta | null {
        const delta = this.touch.getDelta()
        if (delta === null) return null
        return { dx: delta.dx, dy: delta.dy }
    }

    tick(): void {
        this.computeActionStates()
        // フレーム単位のキーボード状態をリセット
        this.keyPushed.clear()
        this.keyReleased.clear()
    }

    remove(): void {
        this.ac.abort()
        this.keyPressed.clear()
        this.touch.remove()
    }

    // ----------------------------------------------------------------
    // アクション状態の計算
    // ----------------------------------------------------------------

    private computeActionStates(): void {
        this.actionPressed.clear()
        this.actionPushed.clear()
        this.actionReleased.clear()
        this.actionAxis.clear()

        const pad = navigator.getGamepads()[this.gamepadIndex]
        const currentButtons = pad ? pad.buttons.map((b) => b.pressed) : []
        const currentAxes = pad ? Array.from(pad.axes) : []

        for (const [id, bindings] of Object.entries(this.config)) {
            const action = id as ActionId
            this.evaluateAction(action, bindings as Binding[], currentButtons, currentAxes)
        }

        this.prevButtons = currentButtons
        this.prevAxes = currentAxes
    }

    private evaluateAction(
        action: ActionId,
        bindings: Binding[],
        currentButtons: boolean[],
        currentAxes: number[],
    ): void {
        let pressed = false
        let pushed = false
        let released = false
        let axisValue = 0

        for (const binding of bindings) {
            switch (binding.device) {
                case "keyboard": {
                    const code = binding.code
                    if (this.keyPressed.has(code)) pressed = true
                    if (this.keyPushed.has(code)) pushed = true
                    if (this.keyReleased.has(code)) released = true
                    // Digital → Analog 昇格: 押されていれば絶対値 1 を採用
                    if (this.keyPressed.has(code) && Math.abs(axisValue) < 1) {
                        axisValue = 1
                    }
                    break
                }

                case "gamepadButton": {
                    const i = binding.index
                    const cur = currentButtons[i] ?? false
                    const prev = this.prevButtons[i] ?? false
                    if (cur) pressed = true
                    if (cur && !prev) pushed = true
                    if (!cur && prev) released = true
                    if (cur && Math.abs(axisValue) < 1) axisValue = 1
                    break
                }

                case "gamepadAxisDigital": {
                    const threshold = binding.threshold ?? DEFAULT_THRESHOLD
                    const raw = currentAxes[binding.axis] ?? 0
                    const prevRaw = this.prevAxes[binding.axis] ?? 0
                    const active = binding.direction === "+" ? raw > threshold : raw < -threshold
                    const prevActive = binding.direction === "+" ? prevRaw > threshold : prevRaw < -threshold

                    if (active) pressed = true
                    if (active && !prevActive) pushed = true
                    if (!active && prevActive) released = true
                    if (active && Math.abs(axisValue) < 1) axisValue = 1
                    break
                }

                case "gamepadAxisAnalog": {
                    const raw = currentAxes[binding.axis] ?? 0
                    const val = Math.abs(raw) > DEAD_ZONE ? raw : 0
                    // 絶対値が大きい方を優先して採用する
                    if (Math.abs(val) > Math.abs(axisValue)) axisValue = val
                    // Analog → Digital: デッドゾーンを超えていれば pressed とみなす
                    if (val !== 0) pressed = true
                    break
                }

                case "keyboardAxis": {
                    const neg = this.keyPressed.has(binding.negative) ? -1 : 0
                    const pos = this.keyPressed.has(binding.positive) ? 1 : 0
                    const val = neg + pos // 両押しは 0
                    if (Math.abs(val) > Math.abs(axisValue)) axisValue = val
                    if (val !== 0) pressed = true
                    break
                }
            }
        }

        if (pressed) this.actionPressed.add(action)
        if (pushed) this.actionPushed.add(action)
        if (released) this.actionReleased.add(action)
        this.actionAxis.set(action, axisValue)
    }

    // ----------------------------------------------------------------
    // ヘルパー
    // ----------------------------------------------------------------

    /**
     * ConfigMap に登録されているキーコードかどうかを確認する。
     * preventDefault の対象を限定するために使う。
     */
    private isTrackedCode(code: string): boolean {
        for (const bindings of Object.values(this.config)) {
            for (const b of bindings as Binding[]) {
                if (b.device === "keyboard" && b.code === code) return true
                if (b.device === "keyboardAxis") {
                    if (b.negative === code || b.positive === code) return true
                }
            }
        }
        return false
    }
}
