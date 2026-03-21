import { g, T } from "../global"
import { Ease } from "../utils/Ease"
import { Ctx } from "./Ctx"
import { Vec, vec } from "../utils/Vec"
import { remodel } from "./Remodel"
import { Bullet } from "./Bullet"

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
        const red = "rgba(255, 60, 60, 0.6)"
        const hpRatio = this.life / this.maxLife

        // 状態に応じたカラーと拍動（パルス）の計算
        const mainColor = this.damaged || this.isInvincible ? red : white
        // 10フレーム周期で半径をわずかに伸縮させる
        const pulse = Math.sin(this.frame / 10) * 0.1 + 0.2
        const orbitTheta = this.frame / 60

        // --- 1. HUDスタイルのHPゲージ ---
        // 単なる矩形から、セグメントに分かれた「計測器」風のデザインへ
        const barW = this.r * 3
        const barH = 6
        const barPos = this.p.plus(vec(-barW / 2, -this.r - 24))

        // 背景のレール
        Ctx.rect(ctx, barPos.l, [barW, barH], "rgba(255, 255, 255, 0.1)", { lineWidth: 1 })
        // HP本体
        Ctx.rect(ctx, barPos.l, [barW * hpRatio, barH], mainColor)
        // 装飾用の目盛り（5分割）
        for (let i = 1; i < 5; i++) {
            const x = barPos.x + (barW / 5) * i
            ctx.lineWidth = 2
            ctx.strokeStyle = "rgba(255, 255, 255, 0.2)"
            ctx.beginPath()
            ctx.moveTo(x, barPos.y)
            ctx.lineTo(x, barPos.y + barH)
            ctx.stroke()
        }

        // --- 2. アウターリング（12方位の目盛り） ---
        // 情報量を増やすための装飾。コンパスのような目盛り
        for (let i = 0; i < 12; i++) {
            const angle = (i * Math.PI) / 6 + orbitTheta / 2
            const p1 = this.p.plus(vec(this.r * 1.4, 0).rotated(angle))
            const p2 = this.p.plus(vec(this.r * 1.6, 0).rotated(angle))
            ctx.strokeStyle = "rgba(255, 255, 255, 0.3)"
            ctx.lineWidth = 2
            ctx.beginPath()
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.stroke()
        }

        // --- 3. コアの多重幾何学構造 ---
        // 逆回転する大きな七角形（レイヤーの深み）
        Ctx.polygon(ctx, 7, 2, this.p.l, this.r * (1.2 + pulse), "rgba(255, 255, 255, 0.1)", {
            theta: -orbitTheta,
            lineWidth: 2,
        })

        // メインの二重円
        Ctx.arc(ctx, this.p.l, this.r * (1 + pulse), this.damaged ? red : white, { lineWidth: 2 })
        Ctx.arc(ctx, this.p.l, this.r, white, { lineWidth: 2 })

        // 内部の七角形（ユーザーのデザインを継承・洗練）
        Ctx.polygon(ctx, 7, 2, this.p.l, this.r * 0.85, white, {
            theta: orbitTheta,
            lineWidth: 2,
        })

        // --- 4. サテライト・ビット（動的なアクセント） ---
        // 3つの小さな菱形が周囲を浮遊
        for (let i = 0; i < 3; i++) {
            const bitAngle = orbitTheta * 1.5 + (i * Math.PI * 2) / 3
            const bitPos = this.p.plus(vec(this.r * 1.8, 0).rotated(bitAngle))
            Ctx.polygon(ctx, 4, 1, bitPos.l, 16, white, {
                theta: bitAngle * 2,
            })
        }

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
