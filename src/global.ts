import { Dom } from "./Dom"
import { Bullet } from "./Game/Bullet/Bullet"
import { Enemy } from "./Game/Enemy/Enemy"
import { Player } from "./Game/Player/Player"
import { Remodel, remodel } from "./Game/Bullet/Remodel"
import { Ease } from "./utils/Functions/Ease"
import { shake } from "./utils/shake"
import { Vec } from "./utils/Vec"
import { UnifiedInput } from "./utils/UnifiedInput/UnifiedInput"
import { DEFAULT_CONFIG } from "./utils/UnifiedInput/DefaultConfig"

export const g = {
    enemies: [] as Enemy[],
    bullets: [] as Bullet[],
    player: undefined as unknown as Player,

    width: 630,
    height: 1120,

    input: new UnifiedInput(DEFAULT_CONFIG),
}

export const T = Math.PI * 2

export function scorenize() {
    g.bullets
        .filter((b) => b.type === Bullet.Type.Enemy || b.type === Bullet.Type.Neutral)
        .forEach((b) => {
            b.scorenize(g.player)
        })
}

export function* fireDeleteField(ctx: CanvasRenderingContext2D) {
    shake(Dom.container, 1000, 12)

    if (g.player.life < 0) {
        explosion(g.player.p.clone())
        return
    }

    const frame = 45

    const p = g.player.p.clone()

    for (let i = 1; i < frame + 1; i++) {
        const r = Ease.Out(i / frame) * g.width
        const alpha = 1 - i / frame

        ctx.save()
        ctx.translate(g.width / 2, g.height / 2)
        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, r, 0, T)
        ctx.stroke()
        ctx.restore()

        g.bullets
            .filter((b) => b.type === Bullet.Type.Enemy || b.type === Bullet.Type.Neutral)
            .filter((b) => b.p.minus(p).magnitude() <= r)
            .forEach((b) => {
                b.scorenize(g.player)
            })

        yield
    }
}

export function explosion(p: Vec) {
    remodel()
        .p(p)
        .type(Bullet.Type.Effect)
        .color("white")
        .duplicate(16, (b) => {
            b.r = Math.random() * 8 + 8
            b.speed = Math.random() * 4 + 4
            b.radian = Math.random() * T
            return b
        })
        .alpha(0.5)
        .g((me) => Remodel.fadeout(me, 60))
        .fire()
}
