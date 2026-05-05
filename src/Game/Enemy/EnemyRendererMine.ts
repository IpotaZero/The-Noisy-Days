import { T } from "../../global"
import { Ctx } from "../../utils/Functions/Ctx"
import { vec } from "../../utils/Vec"
import { Enemy } from "./Enemy"
import { IEnemyRenderer } from "./IEnemyRenderer"

const WHITE = "#ffffff80"
const RED = "rgba(255, 60, 60, 0.6)"
const BLACK_VALE = "rgba(255, 255, 255, 0.2)"

export class EnemyRendererMine implements IEnemyRenderer {
    draw(ctx: CanvasRenderingContext2D, e: Enemy): void {
        const pulse = Math.sin(e.frame / 15) * 0.15 // 呼吸のような鼓動
        const rot = e.frame / 100 // 非常にゆっくりとした回転

        this.drawCore(ctx, e, pulse, rot)
        // this.drawLife(ctx, e)
    }

    private drawCore(ctx: CanvasRenderingContext2D, e: Enemy, pulse: number, rot: number): void {
        const mainColor = e.damaged ? RED : WHITE

        // 外側のトゲ（8方向のセンサー）
        for (let i = 0; i < 7; i++) {
            const angle = i * (T / 7) + rot
            const inner = e.r * 0.6
            const outer = e.r * (1.2 + pulse)

            const p1 = e.p.plus(vec(inner, 0).rotated(angle))
            const p2 = e.p.plus(vec(outer, 0).rotated(angle))

            ctx.strokeStyle = mainColor
            ctx.lineWidth = 1.5
            ctx.beginPath()
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.stroke()

            // 先端の小さなチップ
            Ctx.arc(ctx, p2.l, 2, mainColor)
        }

        // 中心核
        Ctx.arc(ctx, e.p.l, e.r * 0.5, WHITE, { lineWidth: 2 })
        Ctx.polygon(ctx, 3, 1, e.p.l, e.r * 0.4, mainColor, { theta: -rot * 2 })
    }

    private drawLife(ctx: CanvasRenderingContext2D, e: Enemy) {
        Ctx.arc(ctx, e.p.l, e.r * 1.8, WHITE, { lineWidth: 4, start: -T / 4, end: -T / 4 + T * (e.life / e.maxLife) })
    }
}
