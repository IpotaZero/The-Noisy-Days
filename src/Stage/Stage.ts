export abstract class Stage {
    private readonly generator: Generator<void, void, unknown>

    constructor() {
        this.generator = this.G()
    }

    tick() {
        const result = this.generator.next()

        return !!result.done
    }

    protected abstract G(): Generator<void, void, unknown>
}
