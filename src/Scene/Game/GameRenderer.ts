import { BulletDrawer } from "../../Game/Bullet/BulletDrawer"
import { g } from "../../global"

export class GameRenderer {
    private readonly drawer = new BulletDrawer()

    constructor(private readonly ctx: CanvasRenderingContext2D) {}

    draw() {
        this.ctx.clearRect(0, 0, g.width, g.height)

        this.ctx.globalCompositeOperation = "lighter"
        this.ctx.fillStyle = "black"
        this.ctx.fillRect(0, 0, g.width, g.height)

        this.ctx.save()
        this.ctx.translate(g.width / 2, g.height / 2)

        g.player.draw(this.ctx)
        g.bullets.forEach((b) => this.drawer.draw(b, this.ctx))
        g.enemies.forEach((e) => e.draw(this.ctx))

        this.ctx.restore()
    }
}
