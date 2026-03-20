export interface IInput {
    pushed: Set<Operation>
    pressed: Set<Operation>
}

export enum Operation {
    Up,
    Down,
    Left,
    Right,
    Slow,
    Dash,
}
