import { Bullet } from "./Bullet"

export class BulletDrawer {
    private readonly cache = new Map<string, HTMLCanvasElement>()

    draw(bullet: Bullet, ctx: CanvasRenderingContext2D) {
        if (Math.floor(bullet.r) === 0) return

        const hash = `${bullet.appearance},${bullet.color},${Math.floor(bullet.r)}`

        if (!this.cache.has(hash)) {
            const cvs = this.drawDonut(bullet)
            this.cache.set(hash, cvs)
        }

        const cvs = this.cache.get(hash)!

        ctx.globalAlpha = bullet.alpha
        ctx.drawImage(cvs, bullet.p.x - bullet.r * 2, bullet.p.y - bullet.r * 2)
    }

    private drawDonut(bullet: Bullet) {
        const canvas = document.createElement("canvas")
        canvas.width = bullet.r * 4
        canvas.height = bullet.r * 4

        const context = canvas.getContext("2d")!

        context.shadowColor = bullet.color
        context.shadowBlur = 16

        context.beginPath()
        context.arc(bullet.r * 2, bullet.r * 2, bullet.r, 0, Math.PI * 2)
        context.strokeStyle = bullet.color
        context.lineWidth = 3
        context.stroke()

        context.shadowBlur = 0

        context.strokeStyle = "white"
        context.lineWidth = 2
        context.stroke()
        context.lineWidth = 1
        context.stroke()

        return canvas
    }
}
