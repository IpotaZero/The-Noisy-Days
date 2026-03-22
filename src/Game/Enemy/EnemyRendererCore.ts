import { Ctx } from "./Ctx"
import { Enemy } from "./Enemy"
import { vec } from "../utils/Vec"
import { IEnemyRenderer } from "./IEnemyRenderer"

const WHITE = "#ffffff80"
const RED = "rgba(255, 60, 60, 0.6)"
const BLACK_VALE = "rgba(255, 255, 255, 0.2)"

export class EnemyRendererCore implements IEnemyRenderer {
    draw(ctx: CanvasRenderingContext2D, e: Enemy): void {
        const pulse = Math.sin(e.frame / 10) * 0.1 + 0.2
        const orbitTheta = e.frame / 60

        this.drawHpBar(ctx, e)
        this.drawOuterRing(ctx, e, orbitTheta)
        this.drawCore(ctx, e, pulse, orbitTheta)
        this.drawSatellites(ctx, e, orbitTheta)
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

    private drawOuterRing(ctx: CanvasRenderingContext2D, e: Enemy, orbitTheta: number): void {
        for (let i = 0; i < 12; i++) {
            const angle = (i * Math.PI) / 6 + orbitTheta / 2
            const p1 = e.p.plus(vec(e.r * 1.4, 0).rotated(angle))
            const p2 = e.p.plus(vec(e.r * 1.6, 0).rotated(angle))
            ctx.strokeStyle = BLACK_VALE
            ctx.lineWidth = 2
            ctx.beginPath()
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.stroke()
        }
    }

    private drawCore(ctx: CanvasRenderingContext2D, e: Enemy, pulse: number, orbitTheta: number): void {
        Ctx.polygon(ctx, 7, 2, e.p.l, e.r * (1.2 + pulse), BLACK_VALE, {
            theta: -orbitTheta,
            lineWidth: 2,
        })
        Ctx.arc(ctx, e.p.l, e.r, e.damaged ? RED : WHITE, { lineWidth: 2 })
        Ctx.arc(ctx, e.p.l, e.r * (1 + pulse), WHITE, { lineWidth: 2 })
        Ctx.polygon(ctx, 7, 2, e.p.l, e.r * 0.85, WHITE, {
            theta: orbitTheta,
            lineWidth: 2,
        })
    }

    private drawSatellites(ctx: CanvasRenderingContext2D, e: Enemy, orbitTheta: number): void {
        for (let i = 0; i < 3; i++) {
            const bitAngle = orbitTheta * 1.5 + (i * Math.PI * 2) / 3
            const bitPos = e.p.plus(vec(e.r * 1.8, 0).rotated(bitAngle))
            Ctx.polygon(ctx, 4, 1, bitPos.l, 16, WHITE, { theta: bitAngle * 2 })
        }
    }
}
