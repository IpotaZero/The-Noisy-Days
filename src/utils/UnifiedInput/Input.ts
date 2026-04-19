/**
 * Input.ts
 *
 * アクションIDの定数と、統合入力インターフェースを定義する。
 * キーボード・ゲームパッド・タッチを同一のAPIで扱う。
 */

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
export interface IUnifiedInput<ActionId extends string> {
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

    /** フレーム終端で呼ぶ。gamepad をポーリングしアクション状態を更新する。 */
    tick(): void

    /** イベントリスナーを解除しリソースを解放する */
    remove(): void
}
