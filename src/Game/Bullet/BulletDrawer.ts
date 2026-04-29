import { isSmartPhone } from "../../utils/Functions/isSmartPhone"
import { Bullet } from "./Bullet"

export class BulletDrawer {
    private readonly cache = new Map<string, HTMLCanvasElement>()

    draw(bullet: Bullet, ctx: CanvasRenderingContext2D) {
        if (Math.floor(bullet.r) === 0) return

        let hash = `${bullet.appearance},${bullet.color},${Math.floor(bullet.r)}`

        if (bullet.appearance === Bullet.Appearance.Arrow || bullet.appearance === Bullet.Appearance.Line) {
            hash += `,${bullet.radian}`
        }

        if (bullet.appearance === Bullet.Appearance.Score) {
            hash += `,${Math.floor(bullet.radian)}`
        }

        if (!this.cache.has(hash)) {
            if (bullet.appearance === Bullet.Appearance.Donut) {
                const cvs = this.drawDonut(bullet)
                this.cache.set(hash, cvs)
            } else if (bullet.appearance === Bullet.Appearance.Score) {
                const cvs = this.drawLaser(bullet)
                this.cache.set(hash, cvs)
            } else if (bullet.appearance === Bullet.Appearance.Arrow) {
                const cvs = this.drawArrow(bullet)
                this.cache.set(hash, cvs)
            } else if (bullet.appearance === Bullet.Appearance.Line) {
                const cvs = this.drawLine(bullet)
                this.cache.set(hash, cvs)
            } else if (bullet.appearance === Bullet.Appearance.Ball) {
                const cvs = this.drawBall(bullet)
                this.cache.set(hash, cvs)
            } else {
                const cvs = this.drawPlayer(bullet)
                this.cache.set(hash, cvs)
            }
        }

        const cvs = this.cache.get(hash)!

        ctx.globalAlpha = bullet.alpha
        ctx.drawImage(cvs, bullet.p.x - bullet.r * 2, bullet.p.y - bullet.r * 2)
        ctx.globalAlpha = 1
    }

    private drawDonut(bullet: Bullet) {
        const canvas = document.createElement("canvas")
        canvas.width = bullet.r * 4
        canvas.height = bullet.r * 4

        const context = canvas.getContext("2d")!

        context.beginPath()
        context.arc(bullet.r * 2, bullet.r * 2, bullet.r, 0, Math.PI * 2)

        context.shadowColor = bullet.color
        context.shadowBlur = bullet.r
        context.strokeStyle = bullet.color
        context.lineWidth = 3
        context.stroke()

        if (!isSmartPhone) {
            context.shadowColor = bullet.color
            context.shadowBlur = bullet.r / 2
        }
        context.strokeStyle = "white"
        context.lineWidth = 2
        context.stroke()
        context.lineWidth = 1
        context.stroke()

        return canvas
    }

    private drawBall(bullet: Bullet) {
        const canvas = document.createElement("canvas")
        canvas.width = bullet.r * 4
        canvas.height = bullet.r * 4

        const context = canvas.getContext("2d")!

        context.beginPath()
        context.arc(bullet.r * 2, bullet.r * 2, bullet.r, 0, Math.PI * 2)

        context.shadowColor = bullet.color
        context.shadowBlur = bullet.r
        context.fillStyle = bullet.color
        context.fill()

        context.beginPath()
        context.arc(bullet.r * 2, bullet.r * 2, bullet.r * 0.85, 0, Math.PI * 2)

        context.shadowColor = "white"
        context.fillStyle = "white"
        context.fill()

        return canvas
    }

    private drawLaser(bullet: Bullet) {
        const canvas = document.createElement("canvas")
        canvas.width = bullet.r * 4
        canvas.height = bullet.r * 4

        const context = canvas.getContext("2d")!
        context.fillStyle = bullet.color

        if (!isSmartPhone) {
            context.shadowColor = bullet.color
            context.shadowBlur = bullet.r * 2
        }

        context.save()
        context.translate(bullet.r * 2, bullet.r * 2)
        context.rotate(bullet.radian)
        context.beginPath()
        context.rect(-bullet.r, -bullet.r, bullet.r * 2, bullet.r * 2)
        context.fill()
        context.restore()

        return canvas
    }

    private drawPlayer(bullet: Bullet) {
        const canvas = document.createElement("canvas")
        canvas.width = bullet.r * 4
        canvas.height = bullet.r * 4

        const context = canvas.getContext("2d")!
        context.fillStyle = bullet.color

        context.beginPath()
        context.arc(bullet.r * 2, bullet.r * 2, bullet.r, 0, Math.PI * 2)
        context.fill()

        return canvas
    }

    private drawLine(bullet: Bullet) {
        const canvas = document.createElement("canvas")
        canvas.width = bullet.r * 4
        canvas.height = bullet.r * 4

        const context = canvas.getContext("2d")!

        if (!isSmartPhone) {
            context.shadowColor = bullet.color
            context.shadowBlur = bullet.r * 2
        }

        context.save()
        context.translate(bullet.r * 2, bullet.r * 2)
        context.rotate(bullet.radian)
        context.beginPath()
        context.moveTo(-bullet.r, 0)
        context.lineTo(bullet.r, 0)

        context.strokeStyle = bullet.color
        context.lineWidth = 3
        context.stroke()

        context.strokeStyle = "white"
        context.lineWidth = 2
        context.stroke()

        context.restore()

        return canvas
    }

    private drawArrow(bullet: Bullet) {
        const canvas = document.createElement("canvas")
        canvas.width = bullet.r * 4
        canvas.height = bullet.r * 4

        const context = canvas.getContext("2d")!

        if (!isSmartPhone) {
            context.shadowColor = bullet.color
            context.shadowBlur = bullet.r * 2
        }

        context.save()
        context.translate(bullet.r * 2, bullet.r * 2)
        context.rotate(bullet.radian)
        context.beginPath()
        context.moveTo(-bullet.r, 0)
        context.lineTo(bullet.r, 0)
        context.moveTo(bullet.r, 0)
        context.lineTo(bullet.r * (1 - Math.SQRT1_2), bullet.r * Math.SQRT1_2)
        context.moveTo(bullet.r, 0)
        context.lineTo(bullet.r * (1 - Math.SQRT1_2), -bullet.r * Math.SQRT1_2)

        context.strokeStyle = bullet.color
        context.lineWidth = 3
        context.stroke()

        context.strokeStyle = "white"
        context.lineWidth = 2
        context.stroke()

        context.restore()

        return canvas
    }
}
