import { Dom } from "../Dom"
import { fireDeleteField, g } from "../global"
import { LocalStorage } from "../LocalStorage"
import { SE } from "../SE"
import { Stage } from "../Stage/Stage"
import { Selector } from "../utils/Selector"
import { GameLogic } from "./Game/GameLogic"
import { GameRenderer } from "./Game/GameRenderer"
import { CanvasSetup } from "./Game/CanvasSetup"
import { Player } from "../Game/Player/Player"
import { Pages } from "@ipota/pages"
import { Scene } from "../utils/Scene/Scene"
import { ai, di, touch } from "../input"
import { sc } from "../sceneChanger"
import { looper } from "../looper"
import { pageRefocus } from "../focuses"

export default class SceneStage extends Scene {
    private readonly pages = new Pages()
    private readonly selector

    private canvasSetup!: CanvasSetup
    private gameLogic!: GameLogic
    private renderer!: GameRenderer

    private isFinished = false

    update(): void {
        if ((touch.getCurrentTouches()?.length ?? 0) > 3) {
            this.selfDestruct()
            return
        }

        const done = this.stage.tick()
        this.tick()

        if (done && !this.isFinished) {
            this.onClear()
        }

        this.draw()

        g.ctx.save()
        g.ctx.translate(g.width / 2, g.height / 2)
        g.effects = g.effects.filter((g) => !g.next().done)
        g.ctx.restore()
    }

    constructor(
        private readonly stageIndex: number,
        private readonly stage: Stage,
        private readonly history: readonly string[],
    ) {
        super()
        this.selector = new Selector({
            "canvas#canvas": { alias: "canvas" },
            ".back": { alias: "back", expectedCount: 2 },
            ".retry": { alias: "retry", expectedCount: 2 },
        })

        pageRefocus(this.pages)
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
        this.initCanvas()

        g.player = new Player(
            di,
            ai,
            touch,
            (g.width / this.canvasSetup.initialRect.width) * LocalStorage.getSwipeRatio(),
        )

        console.log("#jiu")
    }

    private initCanvas() {
        const canvas = this.selector.getFirst("canvas") as HTMLCanvasElement
        this.canvasSetup = new CanvasSetup(canvas)

        g.ctx = this.canvasSetup.ctx
        this.gameLogic = new GameLogic(
            g.ctx,
            () => g.effects,
            () => {
                g.effects.push(
                    function* (this: SceneStage) {
                        looper.setFPS(10)
                        yield* Array(10)
                        for (let i = 0; i < 10; i++) {
                            looper.setFPS(10 + i * 3)
                            yield* Array(6)
                        }
                    }.bind(this)(),
                )
            },
            () => this.onPlayerDead(),
        )
        this.renderer = new GameRenderer(g.ctx)
    }

    private backScene() {
        document.querySelectorAll("button").forEach((b) => (b.disabled = true))

        const index = g.player.life >= 0 ? this.stageIndex : undefined

        sc.goto(
            () =>
                import("./SceneTitle").then(
                    (module) =>
                        new module.default({
                            history: this.history,
                            clear: index,
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
        sc.goto(async () => new SceneStage(this.stageIndex, this.stage, this.history), {
            msIn: 500,
            msOut: 500,
        })
    }

    async end(): Promise<void> {
        g.bullets = []
        g.enemies = []
        g.effects = []
        g.player.remove()
        this.canvasSetup.disconnect()
    }

    private tick() {
        g.player.tick(this.canvasSetup.ctx)
        this.gameLogic.tick()

        if (di.isPressed("cancel")) {
            this.selfDestruct()
        }
    }

    private onPlayerDead() {
        if (this.isFinished) return
        this.isFinished = true
        this.pages.enter("retry")
        g.player.remove()
    }

    private selfDestruct() {
        if (this.isFinished) return

        SE.u.play()
        SE.hit.play()
        g.player.life = -1
        g.effects.push(fireDeleteField(this.canvasSetup.ctx))
    }

    private draw() {
        this.renderer.draw()
    }
}
