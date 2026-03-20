import { g, T } from "../global"
import { Ease } from "../utils/Ease"
import { Ctx } from "./Ctx"
import { Vec, vec } from "../utils/Vec"

export class Enemy {
    damaged = false

    life = 100
    maxLife = 100

    r = 64
    p = vec(g.width / 2, -g.height / 2)
    frame = 0

    isInvincible = false

    private g: Generator[] = []

    constructor(life: number) {
        this.life = life
        this.maxLife = life

        if ("G" in this) {
            this.g.push(
                function* (this: any) {
                    while (1) {
                        yield* this.G()
                    }
                }.bind(this)(),
            )
        }

        if ("H" in this) {
            this.g.push(
                function* (this: any) {
                    while (1) {
                        yield* this.H()
                    }
                }.bind(this)(),
            )
        }
    }

    tick() {
        this.g = this.g.filter((g) => !g.next().done)
        this.frame++
    }

    draw(ctx: CanvasRenderingContext2D) {
        const white = "#ffffff80"

        const lifeColor = this.damaged || this.isInvincible ? "rgba(255, 33, 33, 0.5)" : white

        Ctx.rect(
            ctx,
            this.p.plus(vec(-this.r, -this.r - 16)).l,
            [this.r * 2 * (this.life / this.maxLife), 8],
            lifeColor,
            {
                lineWidth: 0,
            },
        )
        Ctx.rect(ctx, this.p.plus(vec(-this.r, -this.r - 16)).l, [this.r * 2, 8], lifeColor, { lineWidth: 3 })

        Ctx.arc(ctx, this.p.l, this.r, white, { lineWidth: 2 })
        Ctx.arc(ctx, this.p.l, this.r * 0.95, white, { lineWidth: 2 })
        Ctx.polygon(ctx, 7, 2, this.p.l, this.r * 0.9, white, { theta: this.frame / 60, lineWidth: 2 })

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
