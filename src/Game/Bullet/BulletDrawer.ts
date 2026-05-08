import { T } from "../../global"
import { isSmartPhone } from "../../utils/Functions/isSmartPhone"
import { Bullet } from "./Bullet"

export class BulletDrawer {
    private readonly cache = new Map<string, HTMLCanvasElement>()

    private getHalfCanvasSize(bullet: Bullet) {
        switch (bullet.appearance) {
            case Bullet.Appearance.Player:
                return bullet.r

            case Bullet.Appearance.Donut:
            case Bullet.Appearance.Score:
                return bullet.r * 2

            case Bullet.Appearance.Arrow:
            case Bullet.Appearance.Line:
                return bullet.r * 3

            case Bullet.Appearance.Ball:
                return bullet.r + 16

            default:
                return bullet.r * 2
        }
    }

    /**
     * メインの描画処理
     */
    public draw(bullet: Bullet, ctx: CanvasRenderingContext2D): void {
        if (Math.floor(bullet.r) === 0 || bullet.alpha === 0) return

        // Beamはキャッシュせず直接描画（特殊ケース）
        if (bullet.appearance === Bullet.Appearance.Beam) {
            this.drawBeamDirectly(bullet, ctx)
            return
        }

        const hash = this.generateCacheKey(bullet)
        let offscreenCanvas = this.cache.get(hash)

        const halfCanvasSize = this.getHalfCanvasSize(bullet)

        if (!offscreenCanvas) {
            offscreenCanvas = this.drawToOffscreen(bullet, halfCanvasSize)
            this.cache.set(hash, offscreenCanvas)
        }

        ctx.globalAlpha = bullet.alpha
        const offset = halfCanvasSize
        ctx.drawImage(offscreenCanvas, bullet.p.x - offset, bullet.p.y - offset)
        ctx.globalAlpha = 1
    }

    /**
     * 各タイプに応じたオフスクリーンキャンバスの生成
     */
    private drawToOffscreen(bullet: Bullet, halfCanvasSize: number): HTMLCanvasElement {
        switch (bullet.appearance) {
            case Bullet.Appearance.Donut:
                return this.drawDonut(bullet, halfCanvasSize)
            case Bullet.Appearance.Score:
                return this.drawScore(bullet, halfCanvasSize)
            case Bullet.Appearance.Arrow:
                return this.drawArrow(bullet, halfCanvasSize)
            case Bullet.Appearance.Line:
                return this.drawLine(bullet, halfCanvasSize)
            case Bullet.Appearance.Ball:
                return this.drawBall(bullet, halfCanvasSize)
            default:
                return this.drawPlayer(bullet, halfCanvasSize)
        }
    }

    private generateCacheKey(bullet: Bullet): string {
        const parts = [bullet.appearance, bullet.color, Math.floor(bullet.r)]
        const isRotationSensitive = [Bullet.Appearance.Arrow, Bullet.Appearance.Line].includes(bullet.appearance)

        if (isRotationSensitive) {
            parts.push(bullet.radian)
        } else if (bullet.appearance === Bullet.Appearance.Score) {
            parts.push(Math.floor(bullet.radian))
        }
        return parts.join(",")
    }

    private createOffscreenCanvas(halfCanvasSize: number) {
        const canvas = document.createElement("canvas")
        const size = halfCanvasSize * 2
        canvas.width = size
        canvas.height = size
        const ctx = canvas.getContext("2d")!
        return { canvas, ctx, center: halfCanvasSize }
    }

    // --- 各外見の描画ロジック ---

    private drawBeamDirectly(bullet: Bullet, ctx: CanvasRenderingContext2D) {
        ctx.save()
        ctx.globalAlpha = bullet.alpha
        ctx.translate(bullet.p.x, bullet.p.y)
        ctx.rotate(bullet.radian)

        ctx.shadowBlur = bullet.r
        ctx.shadowColor = bullet.color
        ctx.fillStyle = bullet.color
        ctx.fillRect(0, -bullet.r, bullet.length, bullet.r * 2)

        ctx.shadowBlur = bullet.r
        ctx.shadowColor = "white"
        ctx.fillStyle = "white"
        ctx.fillRect(0, -bullet.r * 0.8, bullet.length, bullet.r * 1.6)

        ctx.globalAlpha = 0.5 * bullet.alpha
        ctx.beginPath()
        ctx.arc(0, 0, bullet.r * 2, 0, T)
        ctx.fill()
        ctx.restore()
    }

    private drawDonut(bullet: Bullet, halfCanvasSize: number) {
        const { canvas, ctx, center } = this.createOffscreenCanvas(halfCanvasSize)
        ctx.beginPath()
        ctx.arc(center, center, bullet.r, 0, Math.PI * 2)
        ctx.shadowColor = bullet.color
        ctx.shadowBlur = bullet.r
        ctx.strokeStyle = bullet.color
        ctx.lineWidth = 3
        ctx.stroke()

        if (!isSmartPhone) ctx.shadowBlur = bullet.r / 2
        ctx.strokeStyle = "white"
        ctx.lineWidth = 2
        ctx.stroke()
        ctx.lineWidth = 1
        ctx.stroke()
        return canvas
    }

    private drawBall(bullet: Bullet, halfCanvasSize: number) {
        const { canvas, ctx, center } = this.createOffscreenCanvas(halfCanvasSize)
        ctx.beginPath()
        ctx.arc(center, center, bullet.r, 0, Math.PI * 2)
        ctx.shadowColor = bullet.color
        ctx.shadowBlur = 14
        ctx.fillStyle = bullet.color
        ctx.fill()

        ctx.beginPath()
        const innerR = bullet.r > 1 ? Math.min(bullet.r - 1, bullet.r * 0.9) : bullet.r * 0.9
        ctx.arc(center, center, innerR, 0, Math.PI * 2)
        ctx.shadowColor = "white"
        ctx.fillStyle = "white"
        ctx.fill()
        return canvas
    }

    private drawScore(bullet: Bullet, halfCanvasSize: number) {
        const { canvas, ctx, center } = this.createOffscreenCanvas(halfCanvasSize)
        if (!isSmartPhone) {
            ctx.shadowColor = bullet.color
            ctx.shadowBlur = bullet.r * 2
        }
        ctx.translate(center, center)
        ctx.rotate(bullet.radian)
        ctx.fillStyle = bullet.color
        ctx.fillRect(-bullet.r, -bullet.r, bullet.r * 2, bullet.r * 2)
        return canvas
    }

    private drawPlayer(bullet: Bullet, halfCanvasSize: number) {
        const { canvas, ctx, center } = this.createOffscreenCanvas(halfCanvasSize)
        ctx.fillStyle = bullet.color
        ctx.beginPath()
        ctx.arc(center, center, bullet.r, 0, Math.PI * 2)
        ctx.fill()
        return canvas
    }

    private drawLine(bullet: Bullet, halfCanvasSize: number) {
        const { canvas, ctx, center } = this.createOffscreenCanvas(halfCanvasSize)
        if (!isSmartPhone) {
            ctx.shadowColor = bullet.color
            ctx.shadowBlur = bullet.r * 2
        }
        ctx.translate(center, center)
        ctx.rotate(bullet.radian)
        ctx.beginPath()
        ctx.moveTo(-bullet.r, 0)
        ctx.lineTo(bullet.r, 0)

        ctx.strokeStyle = bullet.color
        ctx.lineWidth = 3
        ctx.stroke()

        ctx.shadowBlur = 0
        ctx.strokeStyle = "white"
        ctx.lineWidth = 2
        ctx.stroke()
        return canvas
    }

    private drawArrow(bullet: Bullet, halfCanvasSize: number) {
        const { canvas, ctx, center } = this.createOffscreenCanvas(halfCanvasSize)
        if (!isSmartPhone) {
            ctx.shadowColor = bullet.color
            ctx.shadowBlur = bullet.r * 2
        }
        ctx.translate(center, center)
        ctx.rotate(bullet.radian)
        ctx.beginPath()
        ctx.moveTo(-bullet.r, 0)
        ctx.lineTo(bullet.r, 0)
        const tipSize = bullet.r * (1 - Math.SQRT1_2)
        const tipWidth = bullet.r * Math.SQRT1_2
        ctx.moveTo(bullet.r, 0)
        ctx.lineTo(tipSize, tipWidth)
        ctx.moveTo(bullet.r, 0)
        ctx.lineTo(tipSize, -tipWidth)
        ctx.strokeStyle = bullet.color
        ctx.lineWidth = 3
        ctx.stroke()
        ctx.shadowBlur = 0
        ctx.strokeStyle = "white"
        ctx.lineWidth = 2
        ctx.stroke()
        return canvas
    }
}
