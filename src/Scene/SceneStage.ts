import { Dom } from "../Dom"
import { Stage } from "../Stage/Stage"
import { Looper } from "../utils/Looper"
import { Pages } from "../utils/Pages/Pages"
import { SceneChanger } from "../utils/SceneChanger"
import { Selector } from "../utils/Selector"
import { Scene } from "./Scene"

export default class implements Scene {
    private readonly pages = new Pages()
    private readonly selector
    private readonly looper: Looper

    constructor(stage: Stage) {
        let done = false

        this.looper = new Looper(
            60,
            () => {
                done = stage.tick()

                if (done) {
                    this.gotoNextScene()
                }
            },
            () => done,
        )

        this.selector = new Selector({})
    }

    async start(): Promise<void> {
        await this.pages.loadFromFile(Dom.container, "./asset/page/stage/stage.html", {
            history: ["stage"],
        })

        this.looper.start()
    }

    async end(): Promise<void> {}

    private gotoNextScene() {
        const history = ["title", "chapters", "chapter-ch0.", "act-Kari"]

        SceneChanger.goto(() => import("./SceneTitle").then((module) => new module.default({ history })), {
            msIn: 500,
            msOut: 500,
        })
    }
}
