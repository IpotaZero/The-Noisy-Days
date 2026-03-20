import { IInput, Operation } from "./Input"

/** キーコードと Operation のマッピング */
const KEY_MAP: Record<string, Operation> = {
    ArrowUp: Operation.Up,
    ArrowDown: Operation.Down,
    ArrowLeft: Operation.Left,
    ArrowRight: Operation.Right,
    KeyW: Operation.Up,
    KeyS: Operation.Down,
    KeyA: Operation.Left,
    KeyD: Operation.Right,
    ShiftLeft: Operation.Slow,
    ShiftRight: Operation.Slow,
    ControlLeft: Operation.Dash,
    ControlRight: Operation.Dash,
}

export class InputKeyboard implements IInput {
    private readonly ac = new AbortController()

    readonly pushed = new Set<Operation>()
    readonly pressed = new Set<Operation>()

    constructor() {
        const { signal } = this.ac

        window.addEventListener(
            "keydown",
            (e: KeyboardEvent) => {
                const operation = KEY_MAP[e.code]
                if (operation === undefined) return

                if (!this.pressed.has(operation)) {
                    this.pushed.add(operation)
                }

                this.pressed.add(operation)
            },
            { signal },
        )

        window.addEventListener(
            "keyup",
            (e: KeyboardEvent) => {
                const operation = KEY_MAP[e.code]
                if (operation === undefined) return

                this.pushed.delete(operation)
                this.pressed.delete(operation)
            },
            { signal },
        )

        // フォーカスが外れたら全キーをリセット
        window.addEventListener("blur", () => this.pressed.clear(), { signal })
    }

    tick() {
        this.pushed.clear()
    }

    /** イベントリスナーを解除する */
    destroy(): void {
        this.ac.abort()
        this.pressed.clear()
    }
}
