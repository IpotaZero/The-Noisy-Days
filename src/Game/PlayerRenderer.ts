import { T } from "../global"
import { Ctx } from "./Ctx"
import { Player } from "./Player"
import { vec } from "./Vec"

/** 残像1コマ分のスナップショット */
interface AfterImage {
    x: number
    y: number
    alpha: number
}

const AFTER_IMAGE_MAX = 12
const AFTER_IMAGE_DECAY = 0.08

export class PlayerRenderer {
    private drawRadianVelocity = 0
    private drawRadian = 0
    private sneakProgress = 0
    private dashProgress = 0 // 0.0 〜 1.0、Dash 中に 1 へ近づく

    private readonly afterImages: AfterImage[] = []

    tick(
        movingRight: boolean,
        movingLeft: boolean,
        isSneaking: boolean,
        isDashing: boolean,
        px: number,
        py: number,
    ): void {
        // ── 回転 ────────────────────────────────────────────────────
        if (movingRight) this.drawRadianVelocity = 10
        if (movingLeft) this.drawRadianVelocity = -10

        if (this.drawRadianVelocity > 0) {
            this.drawRadian += this.drawRadianVelocity
            this.drawRadianVelocity--
        } else if (this.drawRadianVelocity < 0) {
            this.drawRadian += this.drawRadianVelocity
            this.drawRadianVelocity++
        }

        // ── スニーク遷移 ────────────────────────────────────────────
        const sneakTarget = isSneaking ? 1 : 0
        this.sneakProgress += (sneakTarget - this.sneakProgress) * 0.25
        if (Math.abs(this.sneakProgress - sneakTarget) < 0.001) this.sneakProgress = sneakTarget

        // ── Dash 遷移 ───────────────────────────────────────────────
        const dashTarget = isDashing ? 1 : 0
        this.dashProgress += (dashTarget - this.dashProgress) * 0.35
        if (Math.abs(this.dashProgress - dashTarget) < 0.001) this.dashProgress = dashTarget

        // ── 残像 ────────────────────────────────────────────────────
        if (isDashing) {
            this.afterImages.push({ x: px, y: py, alpha: 1.0 })
            if (this.afterImages.length > AFTER_IMAGE_MAX) this.afterImages.shift()
        }

        for (const img of this.afterImages) img.alpha -= AFTER_IMAGE_DECAY
        while (this.afterImages.length > 0 && this.afterImages[0].alpha <= 0) this.afterImages.shift()
    }

    draw(ctx: CanvasRenderingContext2D, player: Player): void {
        const sneak = this.sneakProgress
        const dash = this.dashProgress
        // sneak / dash / normal の合計が 1 になるよう normal を算出
        const normal = Math.max(0, 1 - sneak - dash)

        this.drawAfterImages(ctx, player)

        this.drawSneakEffect(ctx, player, sneak)
        this.drawNormalEffect(ctx, player, normal)
        this.drawDashEffect(ctx, player, dash)

        this.drawCoreAndGrazeBoundary(ctx, player)
        this.drawInvincibleProgress(ctx, player)
        this.drawLife(ctx, player)
    }

    // ── private ────────────────────────────────────────────────────────

    /**
     * Dash 中の見た目: 鋭い多角形を二重・三重に重ねて回転させる。
     * 尖った印象を出すために頂点数を 3〜4 にし、高速回転させる。
     */
    private drawDashEffect(ctx: CanvasRenderingContext2D, player: Player, ratio: number): void {
        if (ratio < 0.001) return

        const { p, GRAZE_R } = player
        const r = this.drawRadian
        const cyan = `rgba(80, 220, 255, ${ratio.toFixed(3)})`
        const white = `rgba(255, 255, 255, ${ratio.toFixed(3)})`

        // 外側: 鋭い三角形が高速回転
        Ctx.polygon(ctx, 3, 2, p.l, GRAZE_R * 2.8 * ratio, cyan, {
            theta: r / 8,
            lineWidth: 2,
        })
        // 逆回転する四角形
        Ctx.polygon(ctx, 4, 2, p.l, GRAZE_R * 2.2 * ratio, cyan, {
            theta: -r / 12,
            lineWidth: 2,
        })
        // 中層: 細い三角形が逆回転
        Ctx.polygon(ctx, 3, 2, p.l, GRAZE_R * 1.6 * ratio, white, {
            theta: -r / 6,
            lineWidth: 1,
        })
        // 内側: 小さな菱形が高速回転
        Ctx.polygon(ctx, 4, 2, p.l, GRAZE_R * 0.9 * ratio, cyan, {
            theta: r / 4,
            lineWidth: 1,
        })
    }

    private drawAfterImages(ctx: CanvasRenderingContext2D, player: Player): void {
        const { R, GRAZE_R } = player

        for (let i = 0; i < this.afterImages.length; i++) {
            const img = this.afterImages[i]
            const ratio = (i + 1) / this.afterImages.length
            const alpha = img.alpha * ratio
            if (alpha <= 0) continue

            const pos: [number, number] = [img.x, img.y]
            const color = `rgba(80, 220, 255, ${alpha.toFixed(3)})`

            Ctx.arc(ctx, pos, R * ratio, color, { lineWidth: 0 })
            Ctx.polygon(ctx, 3, 2, pos, GRAZE_R * 1.8 * ratio, color, {
                theta: this.drawRadian / 8,
                lineWidth: 1,
            })
            Ctx.polygon(ctx, 4, 2, pos, GRAZE_R * 1.2 * ratio, color, {
                theta: -this.drawRadian / 12,
                lineWidth: 1,
            })
        }
    }

    private drawNormalEffect(ctx: CanvasRenderingContext2D, player: Player, ratio: number): void {
        if (ratio < 0.001) return
        Ctx.polygon(ctx, 8, 2, player.p.l, player.GRAZE_R * 2 * ratio, "#ffffff80", {
            theta: this.drawRadian / 36,
            lineWidth: 2,
        })
    }

    private drawSneakEffect(ctx: CanvasRenderingContext2D, player: Player, ratio: number): void {
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

    private drawCoreAndGrazeBoundary(ctx: CanvasRenderingContext2D, player: Player): void {
        Ctx.arc(ctx, player.p.l, player.R, "red", { lineWidth: 0 })
        Ctx.arc(ctx, player.p.l, player.GRAZE_R, "#ffffff80", { lineWidth: 2 })
    }

    private drawInvincibleProgress(ctx: CanvasRenderingContext2D, player: Player): void {
        if (player.invincibleCoolDown > 0) {
            const progress = T - T * (player.invincibleCoolDown / player.INVINCIBLE_COOL_DOWN)
            Ctx.arc(ctx, player.p.l, player.GRAZE_R / 2, "rgb(255, 255, 127)", {
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
