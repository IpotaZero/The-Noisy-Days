import { Dom } from "./Dom"
import { Bullet } from "./Game/Bullet/Bullet"
import { Enemy } from "./Game/Enemy/Enemy"
import { Player } from "./Game/Player/Player"
import { remodel } from "./Game/Bullet/Remodel"
import { Ease } from "./utils/Functions/Ease"
import { shake } from "./utils/shake"
import { Vec } from "./utils/Vec"

export const g = {
    enemies: [] as Enemy[],
    bullets: [] as Bullet[],
    player: undefined as unknown as Player,

    width: 630,
    height: 1120,
}

export const T = Math.PI * 2

export function scorenize() {
    g.bullets
        .filter((b) => b.type === Bullet.Type.Enemy)
        .forEach((b) => {
            b.scorenize(g.player)
        })
}

export function fireDeleteField() {
    shake(Dom.container, 1000, 12)

    if (g.player.life < 0) {
        explosion(g.player.p.clone())
        return
    }

    remodel([new Bullet()])
        .type(Bullet.Type.Effect)
        .color("white")
        .p(g.player.p.clone())
        .speed(0.001)
        .g(function* (me) {
            const frame = 45

            for (let i = 1; i < frame + 1; i++) {
                me.r = Ease.Out(i / frame) * g.width
                me.alpha = 1 - Ease.Out(i / frame)

                g.bullets
                    .filter((b) => b.type === Bullet.Type.Enemy)
                    .filter((b) => b.p.minus(me.p).magnitude() <= me.r)
                    .forEach((b) => {
                        b.scorenize(g.player)
                    })

                yield
            }

            me.life = 0
        })
        .fire()
}

export function explosion(p: Vec) {
    remodel([new Bullet()])
        .p(p)
        .type(Bullet.Type.Effect)
        .color("white")
        .duplicate(16, (b) => {
            b.r = Math.random() * 8 + 8
            b.speed = Math.random() * 4 + 4
            b.radian = Math.random() * T
            return b
        })
        .g(function* (me) {
            const frame = 60

            for (let i = 1; i < frame + 1; i++) {
                me.alpha = (1 - i / frame) * 0.5
                yield
            }

            me.life = 0
        })
        .fire()
}
