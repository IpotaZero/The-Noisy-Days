/**
 * DefaultConfig.ts
 *
 * このゲームのデフォルトキーコンフィグ。
 * ユーザーがカスタマイズした場合は localStorage の値をマージして使う。
 *
 * ゲームパッドボタン番号の対応（標準レイアウト）:
 *   0: A/×(PS)  1: B/○  2: X/□  3: Y/△
 *   4: L1  5: R1  6: L2  7: R2
 *   8: Select/Share  9: Start/Options
 *   軸: 0=左X  1=左Y  2=右X  3=右Y
 */

// ----------------------------------------------------------------
// Action
// ----------------------------------------------------------------

/** ゲームが扱う操作の意味。物理デバイスには依存しない。 */
export const Action = {
    // 移動（Digital: キーボード/D-pad 向け）
    MoveUp: "up",
    MoveDown: "down",
    MoveLeft: "left",
    MoveRight: "right",

    // 移動（Analog: スティック/キー昇格 向け）
    MoveX: "move_x",
    MoveY: "move_y",

    // アクション
    Slow: "slow",
    Dash: "dash",

    // UI
    Confirm: "confirm",
    Cancel: "cancel",
    Skip: "skip",
    Pause: "pause",
} as const

import { ConfigMap } from "./Binding"

export type MyActionId = (typeof Action)[keyof typeof Action]

export const DEFAULT_CONFIG: ConfigMap<MyActionId> = {
    // ----------------------------------------------------------------
    // 移動 (Digital) - キーボード矢印 / WASD / スティック倒しきり
    // ----------------------------------------------------------------
    [Action.MoveUp]: [
        { device: "keyboard", code: "ArrowUp" },
        { device: "keyboard", code: "KeyW" },
        { device: "gamepadAxisDigital", axis: 1, direction: "-", threshold: 0.5 },
        { device: "gamepadAxisDigital", axis: 3, direction: "-", threshold: 0.5 },
        { device: "gamepadButton", index: 12 },
    ],
    [Action.MoveDown]: [
        { device: "keyboard", code: "ArrowDown" },
        { device: "keyboard", code: "KeyS" },
        { device: "gamepadAxisDigital", axis: 1, direction: "+", threshold: 0.5 },
        { device: "gamepadAxisDigital", axis: 3, direction: "+", threshold: 0.5 },
        { device: "gamepadButton", index: 13 },
    ],
    [Action.MoveLeft]: [
        { device: "keyboard", code: "ArrowLeft" },
        { device: "keyboard", code: "KeyA" },
        { device: "gamepadAxisDigital", axis: 0, direction: "-", threshold: 0.5 },
        { device: "gamepadAxisDigital", axis: 2, direction: "-", threshold: 0.5 },
        { device: "gamepadButton", index: 14 },
    ],
    [Action.MoveRight]: [
        { device: "keyboard", code: "ArrowRight" },
        { device: "keyboard", code: "KeyD" },
        { device: "gamepadAxisDigital", axis: 0, direction: "+", threshold: 0.5 },
        { device: "gamepadAxisDigital", axis: 2, direction: "+", threshold: 0.5 },
        { device: "gamepadButton", index: 15 },
    ],

    // ----------------------------------------------------------------
    // 移動 (Analog) - スティック生値 / キー昇格
    // キーボードは -1/0/+1、スティックは連続値として getAxis() で返る
    // ----------------------------------------------------------------
    [Action.MoveX]: [
        { device: "keyboardAxis", negative: "ArrowLeft", positive: "ArrowRight" },
        { device: "keyboardAxis", negative: "KeyA", positive: "KeyD" },
        { device: "gamepadAxisAnalog", axis: 0 },
        { device: "gamepadAxisAnalog", axis: 2 },
    ],
    [Action.MoveY]: [
        { device: "keyboardAxis", negative: "ArrowUp", positive: "ArrowDown" },
        { device: "keyboardAxis", negative: "KeyW", positive: "KeyS" },
        { device: "gamepadAxisAnalog", axis: 1 },
        { device: "gamepadAxisAnalog", axis: 3 },
    ],

    // ----------------------------------------------------------------
    // アクション
    // ----------------------------------------------------------------
    [Action.Slow]: [
        { device: "keyboard", code: "ShiftLeft" },
        { device: "keyboard", code: "ShiftRight" },
        { device: "gamepadButton", index: 4 }, // L1
        { device: "gamepadButton", index: 5 }, // R1
        { device: "gamepadButton", index: 6 }, // L2
        { device: "gamepadButton", index: 7 }, // R2
    ],
    [Action.Dash]: [
        { device: "keyboard", code: "ControlLeft" },
        { device: "keyboard", code: "ControlRight" },
        { device: "gamepadButton", index: 0 }, // A/×
        { device: "gamepadButton", index: 1 }, // B/○
        { device: "gamepadButton", index: 2 }, // X/□
        { device: "gamepadButton", index: 3 }, // Y/△
    ],

    // ----------------------------------------------------------------
    // UI
    // ----------------------------------------------------------------
    [Action.Confirm]: [
        { device: "keyboard", code: "Space" },
        { device: "keyboard", code: "KeyZ" },
        { device: "keyboard", code: "Enter" },
        { device: "gamepadButton", index: 0 },
    ],
    [Action.Cancel]: [
        { device: "keyboard", code: "Backspace" },
        { device: "keyboard", code: "KeyX" },
        { device: "keyboard", code: "Escape" },
        { device: "gamepadButton", index: 1 },
    ],
    [Action.Skip]: [
        { device: "keyboard", code: "KeyS" },
        { device: "gamepadButton", index: 8 }, // Select/Share
    ],
    [Action.Pause]: [
        { device: "keyboard", code: "Escape" },
        { device: "gamepadButton", index: 9 }, // Start/Options
    ],
}
