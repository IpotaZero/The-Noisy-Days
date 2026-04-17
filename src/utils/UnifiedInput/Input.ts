/**
 * Input.ts
 *
 * アクションIDの定数と、統合入力インターフェースを定義する。
 * キーボード・ゲームパッド・タッチを同一のAPIで扱う。
 */

// ----------------------------------------------------------------
// Action
// ----------------------------------------------------------------

/** ゲームが扱う操作の意味。物理デバイスには依存しない。 */
export const Action = {
    // 移動（Digital: キーボード/D-pad 向け）
    MoveUp: "move_up",
    MoveDown: "move_down",
    MoveLeft: "move_left",
    MoveRight: "move_right",

    // 移動（Analog: スティック/キー昇格 向け）
    MoveX: "move_x",
    MoveY: "move_y",

    // アクション
    Slow: "slow",
    Dash: "dash",

    // UI
    Confirm: "confirm",
    Skip: "skip",
    Pause: "pause",
} as const

export type ActionId = (typeof Action)[keyof typeof Action]

// ----------------------------------------------------------------
// IUnifiedInput
// ----------------------------------------------------------------

export interface PointerDelta {
    dx: number
    dy: number
}

/**
 * 統合入力インターフェース。
 *
 * Digital/Analog/Pointer の 3 種類の入力を統一的に扱う。
 *
 * - Digital  : isPressed / isPushed / isReleased
 * - Analog   : getAxis  (-1.0 〜 +1.0)
 * - Pointer  : getPointerDelta (タッチの相対移動量)
 *
 * 呼び出し側は毎フレーム tick() → 読み取り の順で使う。
 */
export interface IUnifiedInput {
    /** アクションが押し続けられているか */
    isPressed(action: ActionId): boolean

    /** このフレームでアクションが押された瞬間か */
    isPushed(action: ActionId): boolean

    /** このフレームでアクションが離された瞬間か */
    isReleased(action: ActionId): boolean

    /**
     * Analog アクションの値を返す (-1.0 〜 +1.0)。
     * Digital アクションを渡した場合は -1 / 0 / +1 のいずれかを返す。
     */
    getAxis(action: ActionId): number

    /**
     * タッチ入力の移動量を返す。
     * タッチ中でなければ null。
     * tick() を呼ぶたびにリセットされる（TouchTracker と同じ意味論）。
     */
    getPointerDelta(): PointerDelta | null

    /** フレーム終端で呼ぶ。gamepad をポーリングしアクション状態を更新する。 */
    tick(): void

    /** イベントリスナーを解除しリソースを解放する */
    remove(): void
}
