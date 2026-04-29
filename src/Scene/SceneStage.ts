import { Dom } from "../Dom"
import { fireDeleteField, g } from "../global"
import { LocalStorage } from "../LocalStorage"
import { SE } from "../SE"
import { Stage } from "../Stage/Stage"
import { Looper } from "../utils/Looper"
import { Pages } from "../utils/Pages/Pages"
import { SceneChanger } from "../utils/SceneChanger"
import { Selector } from "../utils/Selector"
import { Action } from "../utils/UnifiedInput/DefaultConfig"
import { UnifiedInput } from "../utils/UnifiedInput/UnifiedInput"
import { Scene } from "./Scene"
import { GameLogic } from "./Game/GameLogic"
import { GameRenderer } from "./Game/GameRenderer"
import { CanvasSetup } from "./Game/CanvasSetup"
import { Player } from "../Game/Player/Player"
import { TouchTracker } from "../utils/UnifiedInput/TouchTracker"

export default class SceneStage implements Scene {
    private readonly pages = new Pages()
    private readonly selector
    private readonly looper: Looper

    private canvasSetup!: CanvasSetup
    private gameLogic!: GameLogic
    private renderer!: GameRenderer

    private isFinished = false

    private readonly input

    private readonly ac = new AbortController()

    private g: Generator[] = []

    constructor(
        private readonly stageIndex: number,
        private readonly stage: Stage,
        private readonly history: readonly string[],
    ) {
        this.looper = new Looper(
            30,
            () => {
                const done = stage.tick()
                this.tick()

                if (done && !this.isFinished) {
                    this.onClear()
                }
            },
            () => {
                this.draw()
            },
            () => {
                this.g = this.g.filter((g) => !g.next().done)
            },
        )

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
        this.initCanvas()

        g.player = new Player(
            this.input,
            new TouchTracker(Dom.container),
            (g.width / this.canvasSetup.initialRect.width) * LocalStorage.getSwipeRatio(),
        )

        window.addEventListener(
            "keydown",
            (e) => {
                if (e.key === "Delete") {
                    g.enemies
                        .filter((e) => !e.isInvincible)
                        .at(-1)
                        ?.hit(9999)
                }
            },
            { signal: this.ac.signal },
        )

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

    private initCanvas() {
        const canvas = this.selector.getFirst("canvas") as HTMLCanvasElement
        this.canvasSetup = new CanvasSetup(canvas)

        const ctx = this.canvasSetup.ctx
        this.gameLogic = new GameLogic(
            ctx,
            () => this.g,
            () => {
                this.g.push(
                    function* (this: SceneStage) {
                        this.looper.setFPS(10)
                        yield* Array(10)
                        for (let i = 0; i < 10; i++) {
                            this.looper.setFPS(10 + i * 3)
                            yield* Array(6)
                        }
                    }.bind(this)(),
                )
            },
            () => this.onPlayerDead(),
        )
        this.renderer = new GameRenderer(ctx)
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
        this.canvasSetup.disconnect()
    }

    private tick() {
        this.input.tick()

        g.player.tick(this.canvasSetup.ctx)
        this.gameLogic.tick()

        if (this.input.isPressed(Action.Pause)) {
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
        this.g.push(fireDeleteField(this.canvasSetup.ctx))
    }

    private draw() {
        this.renderer.draw()
    }
}
