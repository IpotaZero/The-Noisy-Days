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
}

export class InputKeyboard implements IInput {
    private readonly ac = new AbortController()
    private readonly pressed = new Set<string>()

    constructor() {
        const { signal } = this.ac

        window.addEventListener("keydown", (e: KeyboardEvent) => this.pressed.add(e.code), { signal })

        window.addEventListener("keyup", (e: KeyboardEvent) => this.pressed.delete(e.code), { signal })

        // フォーカスが外れたら全キーをリセット
        window.addEventListener("blur", () => this.pressed.clear(), { signal })
    }

    /**
     * 現在押されているキーに対応する Operation の配列を返す。
     * 同じ Operation が複数のキーで重複しないよう Set で一意化する。
     */
    tick(): readonly Operation[] {
        const operations = new Set<Operation>()

        for (const code of this.pressed) {
            const op = KEY_MAP[code]
            if (op !== undefined) operations.add(op)
        }

        return [...operations]
    }

    /** イベントリスナーを解除する */
    destroy(): void {
        this.ac.abort()
        this.pressed.clear()
    }
}
