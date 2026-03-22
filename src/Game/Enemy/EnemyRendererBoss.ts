import { Ctx } from "./Ctx"
import { Enemy } from "./Enemy"
import { vec } from "../utils/Vec"
import { IEnemyRenderer } from "./IEnemyRenderer"
import { g, T } from "../global" // T は 2*Math.PI と想定
import * as Curves from "../utils/Curves"

const WHITE = "#ffffff80"
const GOLD = "rgba(255, 215, 0, 0.6)"
const RED = "rgba(255, 60, 60, 0.6)"
const CYAN = "rgba(0, 255, 255, 0.4)"
const BLACK_VALE = "rgba(255, 255, 255, 0.2)"

export class EnemyRendererBoss implements IEnemyRenderer {
    draw(ctx: CanvasRenderingContext2D, e: Enemy): void {
        const orbitTheta = e.frame / 60
        const pulse = Math.sin(e.frame / 15) * 0.05

        this.drawBossHpBar(ctx, e)
        this.drawMagicCircle(ctx, e, orbitTheta, pulse)
        // --- 追加: 中層の巨大幾何学フレーム ---
        this.drawMiddleFrame(ctx, e, orbitTheta)

        this.drawCoreComplex(ctx, e, orbitTheta, pulse)

        // --- 追加: コア周りの高速ビット ---
        this.drawCoreBits(ctx, e, orbitTheta)
        this.drawRoundBits(ctx, e, orbitTheta)
        // 最後に当たり判定を描画（最前面に表示）
        this.drawHitBox(ctx, e, pulse)
    }

    /**
     * 上部に大きく表示されるボス専用HPゲージ
     */
    private drawBossHpBar(ctx: CanvasRenderingContext2D, e: Enemy): void {
        const hpRatio = e.life / e.maxLife
        const width = g.width * 0.8
        const height = 24
        const x = -width / 2
        const y = -g.height / 2 + 30 // 画面上部固定想定（または e.p からのオフセット）

        // 外枠と背景
        ctx.save()
        ctx.translate(0, y) // 画面中央上部に固定する場合
        Ctx.rect(ctx, [x, 0], [width, height], "rgba(255, 255, 255, 0.1)", { lineWidth: 2 })

        // HPバー本体（グラデーション風に2色重ねる）
        Ctx.rect(ctx, [x, 0], [width * hpRatio, height], CYAN)
        Ctx.rect(ctx, [x, height * 0.7], [width * hpRatio, height * 0.3], "rgba(255, 255, 255, 0.3)")

        // 装飾の目盛り
        for (let i = 0; i <= 10; i++) {
            const mx = x + (width / 10) * i
            ctx.strokeStyle = WHITE
            ctx.beginPath()
            ctx.moveTo(mx, -4)
            ctx.lineTo(mx, height + 4)
            ctx.stroke()
        }
        ctx.restore()
    }

    /**
     * 重なり合う回転リングと刻み目（ルーン）の描画
     */
    private drawMagicCircle(ctx: CanvasRenderingContext2D, e: Enemy, theta: number, pulse: number): void {
        const radii = [1.5, 1.8, 2.2] // 敵半径 e.r に対する倍率

        radii.forEach((rMul, idx) => {
            const r = e.r * rMul * (1 + pulse * (idx + 1))
            const dir = idx % 2 === 0 ? 1 : -1
            const currentTheta = theta * dir * (0.5 + idx * 0.2)

            // メインの環
            Ctx.arc(ctx, e.p.l, r, idx === 1 ? GOLD : CYAN, { lineWidth: 1 })

            // 環の上の刻み目（ルーン文字の代わり）
            const count = 12 + idx * 6
            for (let i = 0; i < count; i++) {
                const angle = (i * T) / count + currentTheta
                const p1 = e.p.plus(vec(r, 0).rotated(angle))
                const p2 = e.p.plus(vec(r + 8, 0).rotated(angle))

                ctx.strokeStyle = idx === 1 ? GOLD : WHITE
                ctx.lineWidth = 2
                ctx.beginPath()
                ctx.moveTo(p1.x, p1.y)
                ctx.lineTo(p2.x, p2.y)
                ctx.stroke()
            }
        })
    }

    private drawMiddleFrame(ctx: CanvasRenderingContext2D, e: Enemy, theta: number): void {
        Ctx.polygon(ctx, 8, 2, e.p.l, e.r * 2, BLACK_VALE, {
            theta: theta * 0.2, // 非常にゆっくり回転
            lineWidth: 3,
        })
        Ctx.polygon(ctx, 13, 3, e.p.l, e.r * 4, BLACK_VALE, {
            theta: -theta * 0.2,
            lineWidth: 2,
        })
    }

    private drawCoreBits(ctx: CanvasRenderingContext2D, e: Enemy, theta: number): void {
        const bitCount = 5

        const curve = Curves.lissajous(e.r * 4, e.r * 4, 12, 17)

        for (let i = 0; i < bitCount; i++) {
            // コアの周囲を高速で回るビット
            const angle = (i * T) / bitCount + theta / 2
            const bitPos = e.p.plus(curve(angle))

            // 小さな菱形（四角形）
            Ctx.polygon(ctx, 4, 1, bitPos.l, e.r / 3, WHITE, {
                theta: theta * 5, // ビット自体も高速自転
                lineWidth: 1,
            })
        }
    }

    private drawRoundBits(ctx: CanvasRenderingContext2D, e: Enemy, theta: number): void {
        const bitCount = 7

        for (let i = 0; i < bitCount; i++) {
            // コアの周囲を高速で回るビット
            const angle = (i * T) / bitCount + theta / 3
            const bitPos = e.p.plus(vec.arg(angle).scaled(e.r * 3.5))

            // 小さな菱形（四角形）
            Ctx.polygon(ctx, 5, 1, bitPos.l, e.r / 3, CYAN, {
                theta: theta * 5, // ビット自体も高速自転
                lineWidth: 1,
            })
        }
    }

    /**
     * 中心部の複雑な幾何学構造
     */
    private drawCoreComplex(ctx: CanvasRenderingContext2D, e: Enemy, theta: number, pulse: number): void {
        const coreColor = e.damaged ? RED : WHITE

        Ctx.polygon(ctx, 13, 2, e.p.l, e.r * (0.9 + pulse), coreColor, {
            theta: theta,
            lineWidth: 2,
        })
        Ctx.polygon(ctx, 11, 2, e.p.l, e.r * (0.9 - pulse), coreColor, {
            theta: -theta * 1.5,
            lineWidth: 1,
        })

        Ctx.arc(ctx, e.p.l, e.r * 0.7, WHITE, { lineWidth: 1 })
        Ctx.arc(ctx, e.p.l, e.r * 0.5, WHITE, { lineWidth: 1 })

        Ctx.polygon(ctx, 7, 2, e.p.l, e.r * (0.6 + pulse), coreColor, {
            theta: theta,
            lineWidth: 1,
        })
    }

    /**
     * 実際の当たり判定 (e.r) を示す円を描画
     */
    private drawHitBox(ctx: CanvasRenderingContext2D, e: Enemy, puls: number): void {
        // 境界線
        Ctx.arc(ctx, e.p.l, e.r, WHITE, { lineWidth: 2 })
        Ctx.arc(ctx, e.p.l, e.r * (1 + puls * 2), WHITE, { lineWidth: 1 })
    }
}
