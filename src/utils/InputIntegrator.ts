export class InputIntegrator<C extends InputIntegrator.Config> {
    constructor(
        private readonly config: C,
        touch: HTMLElement,
        private readonly touchRatio: number,
    ) {}

    /**片付け */
    remove() {}

    /**更新 */
    tick() {}

    /**
     * この1frameで押されたか
     */
    pushed() {}

    /**
     * 押されているか
     */
    pressed() {}

    axisLeft() {}

    axisRight() {}
}

export namespace InputIntegrator {
    export type Config = {}
}
