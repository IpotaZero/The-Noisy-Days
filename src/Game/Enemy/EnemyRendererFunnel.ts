import { T } from "../../global"
import { Ctx } from "../../utils/Functions/Ctx"
import { vec } from "../../utils/Vec"
import { Enemy } from "./Enemy"
import { IEnemyRenderer } from "./IEnemyRenderer"

const WHITE = "#ffffff80"
const RED = "rgba(255, 60, 60, 0.6)"
const BLACK_VALE = "rgba(255, 255, 255, 0.2)"
const BLUE = "rgba(60, 140, 255, 0.8)"
const CHARGE_FILL = "rgba(140, 200, 255, 0.95)"

export class EnemyRendererFunnel implements IEnemyRenderer {
    draw(ctx: CanvasRenderingContext2D, e: Enemy): void {
        const orbitTheta = e.frame / 20
        const flicker = Math.random() * 0.2 // 制御信号の瞬き

        this.drawCore(ctx, e, orbitTheta, flicker)
        this.drawLife(ctx, e)
    }

    private drawCore(ctx: CanvasRenderingContext2D, e: Enemy, theta: number, flicker: number): void {
        const color = e.damaged ? RED : WHITE

        // 外装：鋭い菱形
        Ctx.polygon(ctx, 4, 1, e.p.l, e.r * 1.2, BLACK_VALE, {
            theta: theta,
            lineWidth: 1,
        })

        // 内部フレーム
        Ctx.polygon(ctx, 4, 1, e.p.l, e.r, color, {
            theta: theta,
            lineWidth: 2,
        })

        Ctx.polygon(ctx, 6, 3, e.p.l, e.r * 1.5, color, {
            theta: theta,
            lineWidth: 2,
        })

        // 中心ユニット（青く光るコア）
        const coreSize = e.r * (0.3 + flicker)
        Ctx.arc(ctx, e.p.l, coreSize, e.damaged ? RED : WHITE)

        // 後方の残像（推進力）
        const tailPos = e.p.plus(vec(-e.r * 0.8, 0).rotated(theta))
        Ctx.arc(ctx, tailPos.l, 2, color)
    }

    private drawLife(ctx: CanvasRenderingContext2D, e: Enemy) {
        if (e.chargeRemaining > 0 && e.chargeMax > 0) {
            Ctx.arc(ctx, e.p.l, e.r * 1.8, CHARGE_FILL, {
                lineWidth: 4,
                start: -T / 4,
                end: -T / 4 + T * (1 - e.chargeRemaining / e.chargeMax),
            })
        } else {
            Ctx.arc(ctx, e.p.l, e.r * 1.8, WHITE, {
                lineWidth: 4,
                start: -T / 4,
                end: -T / 4 + T * (e.life / e.maxLife),
            })
        }
    }
}
