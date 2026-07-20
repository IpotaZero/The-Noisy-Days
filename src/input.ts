import { AnalogInput, DigitalInput, TouchTracker } from "@ipota/input"
import { Dom } from "./Dom"

export type DigitalAction = "ok" | "cancel" | "up" | "down" | "right" | "left" | "dash" | "slow" | "skip"
export type AnalogAction = "horizontal" | "vertical"

export const defaultConfig: DigitalInput.Config<DigitalAction> = {
    ok: ["KeyZ", "Space", "Enter", "gamepad-button-0"],
    cancel: ["KeyX", "Backspace", "Escape", "gamepad-button-1"],
    up: ["ArrowUp", "KeyW", "gamepad-axis-1-negative"],
    down: ["ArrowDown", "KeyS", "gamepad-axis-1-positive"],
    right: ["ArrowRight", "KeyD", "gamepad-axis-0-positive"],
    left: ["ArrowLeft", "KeyA", "gamepad-axis-0-negative"],
    dash: ["ControlLeft", "ControlRight", "gamepad-button-7", "gamepad-button-6"],
    slow: ["ShiftLeft", "ShiftRight", "gamepad-button-2", "gamepad-button-3"],
    skip: ["KeyR"],
}

export const di = new DigitalInput(defaultConfig)

export const ai = new AnalogInput({
    horizontal: [
        { type: "keyboard", positive: "KeyD", negative: "KeyA" },
        { type: "keyboard", positive: "ArrowRight", negative: "ArrowLeft" },
        { type: "gamepad-axis", axis: 0 },
    ],
    vertical: [
        { type: "keyboard", positive: "KeyW", negative: "KeyS" },
        { type: "keyboard", positive: "ArrowDown", negative: "ArrowUp" },
        { type: "gamepad-axis", axis: 1 },
    ],
})

Dom.init()

export const touch = new TouchTracker(Dom.container)
