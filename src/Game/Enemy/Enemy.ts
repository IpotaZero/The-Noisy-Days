import { g } from "../../global"
import { Ease } from "../../utils/Ease"
import { Vec, vec } from "../../utils/Vec"
import { EnemyRendererCore } from "./EnemyRendererCore"
import { IEnemyRenderer } from "./IEnemyRenderer"

export class Enemy {
    damaged = false
    life = 100
    maxLife = 100
    r = 64
    p = vec(g.width / 2, -g.height / 2)
    frame = 0
    isInvincible = false

    private readonly renderer: IEnemyRenderer
    private g: Generator[] = []

    constructor(life: number, r: number, renderer = new EnemyRendererCore()) {
        this.renderer = renderer

        this.r = r

        this.life = life
        this.maxLife = life

        if ("G" in this) {
            this.g.push(
                function* (this: any) {
                    while (1) yield* this.G()
                }.bind(this)(),
            )
        }
        if ("H" in this) {
            this.g.push(
                function* (this: any) {
                    while (1) yield* this.H()
                }.bind(this)(),
            )
        }
    }

    tick() {
        this.g = this.g.filter((g) => !g.next().done)
        this.frame++
    }

    draw(ctx: CanvasRenderingContext2D) {
        this.renderer.draw(ctx, this)
        this.damaged = false
    }

    protected moveTo(target: Vec, frame: number, easing: Ease.Type = Ease.Out) {
        const start = this.p.clone()

        this.g.push(
            function* (this: Enemy) {
                for (let i = 1; i < frame + 1; i++) {
                    this.p = start.plus(target.minus(start).scaled(easing(i / frame)))
                    yield
                }
            }.bind(this)(),
        )

        return Array(frame)
    }
}
