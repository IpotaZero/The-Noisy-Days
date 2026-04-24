import { Dom } from "../Dom"
import { Bullet } from "../Game/Bullet/Bullet"
import { BulletDrawer } from "../Game/Bullet/BulletDrawer"
import { Collision } from "../Game/Collision"
import { Player } from "../Game/Player/Player"
import { explosion, fireDeleteField, g, T } from "../global"
import { LocalStorage } from "../LocalStorage"
import { SE } from "../SE"
import { Stage } from "../Stage/Stage"
import { Looper } from "../utils/Looper"
import { Pages } from "../utils/Pages/Pages"
import { SceneChanger } from "../utils/SceneChanger"
import { Selector } from "../utils/Selector"
import { Action, DEFAULT_CONFIG } from "../utils/UnifiedInput/DefaultConfig"
import { TouchTracker } from "../utils/UnifiedInput/TouchTracker"
import { UnifiedInput } from "../utils/UnifiedInput/UnifiedInput"
import { Scene } from "./Scene"

export default class SceneStage implements Scene {
    private readonly pages = new Pages()
    private readonly selector
    private readonly looper: Looper

    private ctx!: CanvasRenderingContext2D
    private readonly drawer = new BulletDrawer()
    private readonly collision = new Collision()

    private isFinished = false

    private readonly input

    private readonly ac = new AbortController()

    constructor(
        private readonly stageIndex: number,
        private readonly stage: Stage,
        private readonly history: readonly string[],
    ) {
        this.looper = new Looper(30, () => {
            const done = stage.tick()
            this.tick()

            if (done && !this.isFinished) {
                this.onClear()
            }
        })

        this.selector = new Selector({
            "canvas#canvas": { alias: "canvas" },
            ".back": { alias: "back", expectedCount: 2 },
            ".retry": { alias: "retry", expectedCount: 2 },
        })

        this.input = new UnifiedInput(LocalStorage.getConfig())
    }

    private onClear() {
        this.isFinished = true
        this.pages.enter("clear")

        const rank = g.player.life === 8 ? 2 : 1
        LocalStorage.updateClearedStage(this.stageIndex, rank)
    }

    async start(): Promise<void> {
        await this.pages.loadFromFile(Dom.container, "./asset/page/stage/stage.html", {
            history: ["stage"],
        })

        this.selector.load(Dom.container)
        this.selector.onClick("back", () => this.backScene())
        this.selector.onClick("retry", () => this.retry())
        this.setupCanvas()

        Dom.container.addEventListener(
            "touchstart",
            (e) => {
                if (e.touches.length >= 3) {
                    this.selfDestruct()
                }
            },
            { signal: this.ac.signal },
        )

        this.looper.start()
    }

    private setupCanvas() {
        const rect = Dom.container.getClientRects()[0]

        g.height = g.width * (rect.height / rect.width)

        const cvs = this.selector.getFirst("canvas") as HTMLCanvasElement
        cvs.width = g.width
        cvs.height = g.height

        this.ctx = cvs.getContext("2d", { alpha: false })!

        g.player = new Player(
            this.input,
            new TouchTracker(Dom.container),
            (g.width / rect.width) * LocalStorage.getSwipeRatio(),
        )
    }

    private backScene() {
        document.querySelectorAll("button").forEach((b) => (b.disabled = true))

        SceneChanger.goto(
            () =>
                import("./SceneTitle").then(
                    (module) =>
                        new module.default({
                            history: this.history,
                            clear: this.stageIndex,
                        }),
                ),
            {
                msIn: 500,
                msOut: 500,
            },
        )
    }

    private retry() {
        document.querySelectorAll("button").forEach((b) => (b.disabled = true))

        this.stage.reset()
        SceneChanger.goto(async () => new SceneStage(this.stageIndex, this.stage, this.history), {
            msIn: 500,
            msOut: 500,
        })
    }

    async end(): Promise<void> {
        this.looper.stop()
        g.bullets = []
        g.enemies = []
        g.player.remove()
        this.ac.abort()
    }

    private tick() {
        this.logic()
        this.draw()

        if (this.input.isPressed(Action.Pause)) {
            this.selfDestruct()
        }

        this.input.tick()
    }

    private logic() {
        g.player.tick(this.ctx)

        g.enemies.forEach((e) => {
            e.tick()

            if (e.isInvincible) return

            g.bullets
                .values()
                .filter((b) => b.type === Bullet.Type.Friend)
                .filter((b) => b.p.minus(e.p).magnitude() <= b.r + e.r)
                .forEach((b) => {
                    b.life = 0
                    e.life -= Math.ceil(b.p.minus(e.p).magnitude() / g.width)
                    e.damaged = true
                })

            if (e.life <= 0) {
                explosion(e.p.clone())
                SE.crush.play()
            }
        })

        g.bullets.forEach((b) => b.tick())

        if (!g.player.isInvincible())
            g.bullets
                .values()
                .filter((b) => b.type === Bullet.Type.Enemy)
                .forEach((b) => {
                    const distance = b.p.minus(g.player.p).magnitude()

                    if (distance <= b.r + g.player.GRAZE_R) {
                        SE.graze.play()
                    }

                    const isColliding = this.collision.isColliding(b, g.player)

                    if (isColliding) {
                        b.life = 0
                        g.player.damage()
                        SE.u.play()
                        SE.hit.play()

                        fireDeleteField()
                    }
                })

        g.bullets
            .values()
            .filter((b) => b.type === Bullet.Type.Score)
            .filter((b) => b.p.minus(g.player.p).magnitude() <= b.r + g.player.GRAZE_R)
            .forEach((b) => {
                b.life = 0
                SE.graze.play()
            })

        g.bullets = g.bullets.filter((b) => b.life > 0)
        g.enemies = g.enemies.filter((e) => e.life > 0)

        if (this.isFinished) return

        if (g.player.life <= -1) {
            this.isFinished = true
            this.pages.enter("retry")
            g.player.remove()
        }
    }

    private selfDestruct() {
        if (this.isFinished) return

        SE.u.play()
        SE.hit.play()
        g.player.life = -1
        fireDeleteField()
    }

    private draw() {
        this.ctx.clearRect(0, 0, g.width, g.height)

        this.ctx.globalCompositeOperation = "lighter"
        this.ctx.fillStyle = "black"
        this.ctx.fillRect(0, 0, g.width, g.height)

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
}
