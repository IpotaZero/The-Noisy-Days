export interface IInput {
    pushed: Set<Operation>
    pressed: Set<Operation>

    tick(): void
    remove(): void
}

export enum Operation {
    Up,
    Down,
    Left,
    Right,
    Slow,
    Dash,
}
