import { Dom } from "../Dom"
import { Stage } from "../Stage/Stage"
import { Selector } from "../utils/Selector"
import { Pages } from "@ipota/pages"
import { Scene } from "../utils/Scene/Scene"
import { sc } from "../sceneChanger"
import { pageRefocus } from "../focuses"

export default class SceneMemo extends Scene {
    private readonly pages = new Pages()
    private readonly selector

    private isFinished = false

    constructor(
        private readonly stage: Stage,
        private readonly history: readonly string[],
    ) {
        super()

        this.selector = new Selector({
            ".back": { alias: "back", expectedCount: 1 },
        })

        pageRefocus(this.pages)
    }

    async start(): Promise<void> {
        await this.pages.loadFromFile(Dom.container, "./asset/page/memo/memo.html", {
            history: ["memo"],
        })

        this.selector.load(Dom.container)
        this.selector.onClick("back", () => this.backScene())
    }

    update(): void {
        if (this.isFinished) return

        const done = this.stage.tick()

        if (done) {
            this.isFinished = true
            this.pages.enter("memo-end")
        }
    }

    private backScene() {
        document.querySelectorAll("button").forEach((b) => (b.disabled = true))

        sc.goto(
            () =>
                import("./SceneTitle").then(
                    (module) =>
                        new module.default({
                            history: this.history,
                        }),
                ),
            {
                msIn: 500,
                msOut: 500,
            },
        )
    }

    async end(): Promise<void> {
        this.pages.dispose()
    }
}
