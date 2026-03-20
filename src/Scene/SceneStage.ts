import { Dom } from "../Dom"
import { Bullet } from "../Game/Bullet"
import { BulletDrawer } from "../Game/BulletDrawer"
import { InputKeyboard } from "../Game/InputKeyboard"
import { Player } from "../Game/Player"
import { g } from "../global"
import { Stage } from "../Stage/Stage"
import { Looper } from "../utils/Looper"
import { Pages } from "../utils/Pages/Pages"
import { SceneChanger } from "../utils/SceneChanger"
import { Selector } from "../utils/Selector"
import { TouchTracker } from "../utils/TouchTracker"
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
            30,
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

        g.player = new Player(new InputKeyboard(), new TouchTracker(Dom.container), g.width / rect.width)

        this.looper.start()
    }

    async end(): Promise<void> {
        g.bullets = []
        g.enemies = []
    }

    private tick() {
        this.logic()
        this.draw()
    }

    private logic() {
        g.player.tick()

        g.bullets.forEach((b) => b.tick())

        g.enemies.forEach((e) => {
            e.tick()

            g.bullets
                .values()
                .filter((b) => b.type === Bullet.Type.Friend)
                .filter((b) => b.p.minus(e.p).magnitude() <= b.r + e.r)
                .forEach((b) => {
                    b.life = 0
                    e.life -= Math.ceil(b.p.minus(e.p).magnitude() / g.width)
                    e.damaged = true
                })
        })

        g.bullets
            .values()
            .filter((b) => b.type === Bullet.Type.Enemy)
            .filter((b) => b.p.minus(g.player.p).magnitude() <= b.r + g.player.r)
            .forEach((b) => {
                b.life = 0
                g.player.life--
            })

        g.bullets = g.bullets.filter((b) => b.life > 0)
        g.enemies = g.enemies.filter((e) => e.life > 0)
    }

    private draw() {
        this.ctx.clearRect(0, 0, g.width, g.height)
        this.ctx.save()

        this.ctx.translate(g.width / 2, g.height / 2)

        g.player.draw(this.ctx)

        g.bullets.forEach((b) => {
            this.drawer.draw(b, this.ctx)
        })

        g.enemies.forEach((e) => {
            e.draw(this.ctx)
        })

        this.ctx.restore()
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
