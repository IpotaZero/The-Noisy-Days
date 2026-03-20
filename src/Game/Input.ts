export interface IInput {
    tick(): readonly Operation[]
}

export enum Operation {
    Up,
    Down,
    Left,
    Right,
    Slow,
    Dash,
}
