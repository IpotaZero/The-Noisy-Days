export interface Scene {
    start(): Promise<void>
    end(): Promise<void>
}

export abstract class ChildScene<T> implements Scene {
    protected resolve = (result: T) => {}

    async start(): Promise<void> {}
    async end(): Promise<void> {}

    process(): Promise<T> {
        return new Promise((resolve) => {
            this.resolve = resolve
        })
    }
}

export abstract class ParentScene implements Scene {
    async start(): Promise<void> {}
    async end(): Promise<void> {}

    protected async getData<T>(scene: ChildScene<T>): Promise<T> {
        await scene.start()
        const data = await scene.process()
        await scene.end()

        return data
    }
}
