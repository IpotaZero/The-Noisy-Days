/**
 * Binding.ts
 *
 * 物理入力（キーボード・ゲームパッド）とアクションの対応を表す型群。
 * タッチは案C の設計方針により Binding の対象外とし、
 * IUnifiedInput.getPointerDelta() で別途提供する。
 */

// ----------------------------------------------------------------
// Binding の各種類
// ----------------------------------------------------------------

/**
 * キーボードのキーを Digital アクションに割り当てる。
 * `code` は KeyboardEvent.code（レイアウト非依存）を使う。
 * 例: "Space", "ShiftLeft", "KeyZ", "ArrowUp"
 */
export type KeyboardBinding = {
    device: "keyboard"
    code: string
}

/**
 * ゲームパッドのボタンを Digital アクションに割り当てる。
 * `index` は Gamepad.buttons の添字。
 * 例: 0=A/×, 1=B/○, 4=L1, 5=R1, 6=L2, 7=R2
 */
export type GamepadButtonBinding = {
    device: "gamepadButton"
    index: number
}

/**
 * ゲームパッドのスティック軸を Digital アクションに割り当てる。
 * direction "+" → axis 値が +threshold を超えたら押下と見なす。
 * direction "-" → axis 値が -threshold を下回ったら押下と見なす。
 */
export type GamepadAxisDigitalBinding = {
    device: "gamepadAxisDigital"
    axis: number
    direction: "+" | "-"
    threshold?: number // デフォルト 0.5
}

/**
 * ゲームパッドのスティック軸を Analog アクションに割り当てる。
 * getAxis() の戻り値として -1.0 〜 +1.0 をそのまま返す。
 */
export type GamepadAxisAnalogBinding = {
    device: "gamepadAxisAnalog"
    axis: number
}

/**
 * キーボードの 2 キーを Analog アクションに昇格させる。
 * negative キーが押されていれば -1、positive キーなら +1、両方なら 0 を返す。
 * `negative` / `positive` は KeyboardEvent.code。
 */
export type KeyboardAxisBinding = {
    device: "keyboardAxis"
    negative: string
    positive: string
}

/** すべての Binding の判別共用体 */
export type Binding =
    | KeyboardBinding
    | GamepadButtonBinding
    | GamepadAxisDigitalBinding
    | GamepadAxisAnalogBinding
    | KeyboardAxisBinding

// ----------------------------------------------------------------
// ConfigMap
// ----------------------------------------------------------------

/**
 * アクションID → Binding[] のマップ。
 * 1 つのアクションに複数 Binding を登録でき、OR 条件で評価される。
 * JSON シリアライズ可能なため、localStorage への永続化に対応する。
 */
export type ConfigMap = Record<string, Binding[]>
