import { Ctx } from "../../utils/Functions/Ctx"
import { vec } from "../../utils/Vec"
import { Enemy } from "./Enemy"
import { IEnemyRenderer } from "./IEnemyRenderer"

const WHITE = "#ffffff80"
const RED = "rgba(255, 60, 60, 0.6)"
const BLACK_VALE = "rgba(255, 255, 255, 0.2)"

export class EnemyRendererMob implements IEnemyRenderer {
    draw(ctx: CanvasRenderingContext2D, e: Enemy): void {
        const orbitTheta = e.frame / 30

        this.drawHpBar(ctx, e)
        this.drawCore(ctx, e, orbitTheta)
    }

    private drawHpBar(ctx: CanvasRenderingContext2D, e: Enemy): void {
        const mainColor = e.damaged || e.isInvincible ? RED : WHITE
        const hpRatio = e.life / e.maxLife
        const barW = e.r * 3
        const barH = 6
        const barPos = e.p.plus(vec(-barW / 2, -e.r - 24))

        Ctx.rect(ctx, barPos.l, [barW, barH], BLACK_VALE, { lineWidth: 1 })
        Ctx.rect(ctx, barPos.l, [barW * hpRatio, barH], mainColor)

        for (let i = 1; i < 5; i++) {
            const x = barPos.x + (barW / 5) * i
            ctx.lineWidth = 2
            ctx.strokeStyle = BLACK_VALE
            ctx.beginPath()
            ctx.moveTo(x, barPos.y)
            ctx.lineTo(x, barPos.y + barH)
            ctx.stroke()
        }
    }

    private drawCore(
        ctx: CanvasRenderingContext2D,
        e: Enemy,
        orbitTheta: number,
    ): void {
        Ctx.arc(ctx, e.p.l, e.r * 1.1, WHITE, {
            lineWidth: 2,
        })
        Ctx.arc(ctx, e.p.l, e.r, e.damaged ? RED : WHITE, { lineWidth: 2 })
        Ctx.polygon(ctx, 5, 1, e.p.l, e.r * 0.85, WHITE, {
            theta: orbitTheta,
            lineWidth: 2,
        })
    }
}
