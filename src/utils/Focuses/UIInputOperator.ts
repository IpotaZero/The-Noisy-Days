/**
 * UIInputOperator.ts
 *
 * キーボードとゲームパッドの入力を受け取り、
 * UI ナビゲーション用の Operation コールバックに変換する。
 *
 * 旧 GamepadOperator + KeyboardOperator を UnifiedInput で統合したクラス。
 *
 * 使い方:
 *   const op = new UIInputOperator(myConfig, (o) => Focuses.operate(o))
 *   op.start()  // ゲームパッド接続後に呼ぶ（または gamepadconnected イベントで）
 *   op.remove() // 破棄時
 */

import { Action } from "../UnifiedInput/DefaultConfig"
import { Operation } from "./Focuses"
import { IUnifiedInput } from "../UnifiedInput/Input"

/** Action → UI Operation のマッピング */
const ACTION_TO_OPERATION: Record<string, Operation> = {
    [Action.MoveUp]: "up",
    [Action.MoveDown]: "down",
    [Action.MoveLeft]: "left",
    [Action.MoveRight]: "right",
    [Action.Confirm]: "confirm",
    [Action.Cancel]: "cancel",
}

type A = (typeof ACTION_TO_OPERATION)[keyof typeof ACTION_TO_OPERATION]

export class UIInputOperator {
    private rafId: number | null = null

    /**
     * @param config   UnifiedInput と共有する ConfigMap
     * @param operate  Operation を受け取るコールバック（Focuses.operate など）
     */
    constructor(
        private readonly input: IUnifiedInput<A>,
        private readonly operate: (o: Operation) => void,
    ) {}

    /** rAF ループを開始する。ゲームパッド接続後に呼ぶ。 */
    start(): void {
        if (this.rafId !== null) return
        this.loop()
    }

    /** rAF ループを停止しリソースを解放する。 */
    remove(): void {
        if (this.rafId !== null) {
            cancelAnimationFrame(this.rafId)
            this.rafId = null
        }
        this.input.remove()
    }

    // ----------------------------------------------------------------
    // private
    // ----------------------------------------------------------------

    private loop = (): void => {
        this.input.tick()
        this.emitOperations()
        this.rafId = requestAnimationFrame(this.loop)
    }

    private emitOperations(): void {
        for (const [actionId, operation] of Object.entries(ACTION_TO_OPERATION)) {
            if (!operation) continue
            if (this.input.isPushed(actionId as any)) {
                this.operate(operation)
            }
        }
    }
}
