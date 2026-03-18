import { Stage } from "../Stage/Stage"
import { Looper } from "../utils/Looper"
import { Scene } from "./Scene"

export default class implements Scene {
    private readonly looper: Looper

    constructor(stage: Stage) {
        let done = false

        this.looper = new Looper(
            60,
            () => {
                done = stage.tick()
            },
            () => done,
        )
    }

    async start(): Promise<void> {
        this.looper.start()
    }

    async end(): Promise<void> {}
}
