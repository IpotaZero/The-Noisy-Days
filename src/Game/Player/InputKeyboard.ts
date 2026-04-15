import { IInput, Operation } from "./Input"

/** キーと Operation のマッピング */
const KEY_MAP: Record<string, Operation> = {
    ArrowUp: Operation.Up,
    ArrowDown: Operation.Down,
    ArrowLeft: Operation.Left,
    ArrowRight: Operation.Right,
    w: Operation.Up,
    s: Operation.Down,
    a: Operation.Left,
    d: Operation.Right,
    Shift: Operation.Slow,
    Control: Operation.Dash,
}

/**
 * Shift などの修飾キーと同時押しすると e.key が大文字になるため、
 * まず元のキーで検索し、見つからなければ小文字に正規化して再検索する。
 */
function resolveOperation(key: string): Operation | undefined {
    return KEY_MAP[key] ?? KEY_MAP[key.toLowerCase()]
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
                const operation = resolveOperation(e.key)
                if (operation === undefined) return

                // ブラウザのデフォルト動作（Ctrl+W でタブを閉じるなど）を抑制する
                e.preventDefault()

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
                const operation = resolveOperation(e.key)
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
    remove(): void {
        this.ac.abort()
        this.pressed.clear()
    }
}
