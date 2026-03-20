import { T } from "../global"
import { Ctx } from "./Ctx"
import { vec } from "./Vec"

export class Enemy {
    life = 100
    maxLife = 100

    r = 64
    p = vec(0, 0)
    frame = 0

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
    }

    tick() {
        this.g = this.g.filter((g) => !g.next().done)
        this.frame++
    }

    draw(ctx: CanvasRenderingContext2D) {
        const white = "#ffffff80"

        Ctx.rect(ctx, this.p.plus(vec(-this.r, -this.r - 16)).l, [this.r * 2 * (this.life / this.maxLife), 8], white, {
            lineWidth: 0,
        })
        Ctx.rect(ctx, this.p.plus(vec(-this.r, -this.r - 16)).l, [this.r * 2, 8], white, { lineWidth: 3 })

        Ctx.arc(ctx, this.p.l, this.r, white, { lineWidth: 2 })
        Ctx.arc(ctx, this.p.l, this.r * 0.95, white, { lineWidth: 2 })
        Ctx.polygon(ctx, 7, 2, this.p.l, this.r * 0.9, white, { theta: this.frame / 60, lineWidth: 2 })
    }
}
