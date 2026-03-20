import { T } from "../global"
import { Ctx } from "./Ctx"
import { Player } from "./Player"
import { vec } from "./Vec"

export class PlayerRenderer {
    private drawRadianVelocity = 0
    private drawRadian = 0
    // 描画に直接使う進行度 (0.0 〜 1.0)
    private sneakProgress = 0

    /**
     * 加減速を伴う更新
     */
    tick(movingRight: boolean, movingLeft: boolean, isSneaking: boolean): void {
        // 回転アニメーションの更新
        if (movingRight) this.drawRadianVelocity = 10
        if (movingLeft) this.drawRadianVelocity = -10

        if (this.drawRadianVelocity > 0) {
            this.drawRadian += this.drawRadianVelocity
            this.drawRadianVelocity--
        } else if (this.drawRadianVelocity < 0) {
            this.drawRadian += this.drawRadianVelocity
            this.drawRadianVelocity++
        }

        // --- Ease-out 遷移ロジック ---
        // 目標値の設定
        const target = isSneaking ? 1 : 0

        // 現在値と目標値の差分に比例した速度で近づける
        // 0.15 は追従の鋭さ。値を小さくするとより「ねっとり」した Ease-out になります
        const k = 0.25
        this.sneakProgress += (target - this.sneakProgress) * k

        // 浮動小数点の微小な残差をクランプ（任意ですが、厳密さを好むなら）
        if (Math.abs(this.sneakProgress - target) < 0.001) {
            this.sneakProgress = target
        }
    }

    draw(ctx: CanvasRenderingContext2D, player: Player): void {
        const p = this.sneakProgress

        // 常に両方のエフェクトを描画
        this.drawSneakEffect(ctx, player, p)
        this.drawNormalEffect(ctx, player, 1 - p)

        this.drawCoreAndGrazeBoundary(ctx, player)
        this.drawInvincibleProgress(ctx, player)

        this.drawLife(ctx, player)
    }

    private drawNormalEffect(ctx: CanvasRenderingContext2D, player: Player, ratio: number) {
        if (ratio < 0.001) return
        Ctx.polygon(ctx, 8, 2, player.p.l, player.GRAZE_R * 2 * ratio, "#ffffff80", {
            theta: this.drawRadian / 36,
            lineWidth: 2,
        })
    }

    private drawSneakEffect(ctx: CanvasRenderingContext2D, player: Player, ratio: number) {
        if (ratio < 0.001) return
        Ctx.arc(ctx, player.p.l, player.GRAZE_R * 3 * ratio, "#ffffff80", { lineWidth: 2 })
        Ctx.arc(ctx, player.p.l, player.GRAZE_R * 2.8 * ratio, "#ffffff80", { lineWidth: 2 })

        Ctx.polygon(ctx, 13, 2, player.p.l, player.GRAZE_R * 2.7 * ratio, "#ffffff80", {
            theta: this.drawRadian / 72,
            lineWidth: 2,
        })

        Ctx.polygon(ctx, 11, 2, player.p.l, player.GRAZE_R * 2 * ratio, "#ffffff80", {
            theta: this.drawRadian / 144,
            lineWidth: 2,
        })
    }

    private drawCoreAndGrazeBoundary(ctx: CanvasRenderingContext2D, player: Player) {
        Ctx.arc(ctx, player.p.l, player.R, "red", {
            lineWidth: 0,
        })
        Ctx.arc(ctx, player.p.l, player.GRAZE_R, "#ffffff80", { lineWidth: 2 })
    }

    private drawInvincibleProgress(ctx: CanvasRenderingContext2D, player: Player) {
        if (player.invincibleCoolDown > 0) {
            const progress = T - T * (player.invincibleCoolDown / player.INVINCIBLE_COOL_DOWN)
            const yellow = "rgb(255, 255, 127)"
            Ctx.arc(ctx, player.p.l, player.GRAZE_R / 2, yellow, {
                lineWidth: 2,
                start: 0,
                end: progress,
            })
        }
    }

    private drawLife(ctx: CanvasRenderingContext2D, player: Player): void {
        const { life, GRAZE_R, frame, p: playerPos } = player

        for (let i = 0; i < life; i++) {
            const center = playerPos.plus(vec(GRAZE_R * 3, 0).rotated(T * (i / 8) + frame / 24)).l
            Ctx.polygon(ctx, 4, 1, center, GRAZE_R, "#ffffff80", {
                theta: frame / 24,
            })
        }
    }
}
