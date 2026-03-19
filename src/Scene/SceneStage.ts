import { Dom } from "../Dom"
import { BulletDrawer } from "../Game/BulletDrawer"
import { g } from "../global"
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

    private ctx!: CanvasRenderingContext2D
    private readonly drawer = new BulletDrawer()

    constructor(
        stage: Stage,
        private readonly history: readonly string[],
    ) {
        let done = false

        this.looper = new Looper(
            60,
            () => {
                done = stage.tick()
                this.tick()

                if (done) {
                    this.gotoNextScene()
                }
            },
            () => done,
        )

        this.selector = new Selector({
            "canvas#canvas": { alias: "canvas" },
        })
    }

    async start(): Promise<void> {
        await this.pages.loadFromFile(Dom.container, "./asset/page/stage/stage.html", {
            history: ["stage"],
        })

        this.selector.load(Dom.container)

        const rect = Dom.container.getClientRects()[0]

        g.height = g.width * (rect.height / rect.width)

        const cvs = this.selector.getFirst("canvas") as HTMLCanvasElement
        cvs.width = g.width
        cvs.height = g.height

        this.ctx = cvs.getContext("2d")!

        this.looper.start()
    }

    async end(): Promise<void> {}

    private tick() {
        this.ctx.clearRect(0, 0, g.width, g.height)
        this.ctx.save()

        this.ctx.translate(g.width / 2, g.height / 2)

        g.bullets.forEach((b) => {
            this.drawer.draw(b, this.ctx)
        })

        this.ctx.restore()

        g.bullets = g.bullets.filter((b) => b.life > 0)
    }

    private gotoNextScene() {
        SceneChanger.goto(
            () => import("./SceneTitle").then((module) => new module.default({ history: this.history })),
            {
                msIn: 500,
                msOut: 500,
            },
        )
    }
}
