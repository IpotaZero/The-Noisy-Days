import { Bullet } from "../../Game/Bullet/Bullet"
import { Enemy } from "../../Game/Enemy/Enemy"
import { Remodel, remodel } from "../../Game/Bullet/Remodel"
import { vec } from "../../utils/Vec"
import { g, scorenize, T } from "../../global"
import { Stage } from "../Stage"
import { flash, shake } from "../../utils/shake"
import { Dom } from "../../Dom"

import { EnemyRendererMob } from "../../Game/Enemy/EnemyRendererMob"
import { EnemyRendererCore } from "../../Game/Enemy/EnemyRendererCore"
import { Ease } from "../../utils/Functions/Ease"
import { isSmartPhone } from "../../utils/Functions/isSmartPhone"

export default class extends Stage {
    protected *G(): Generator<void, void, unknown> {
        yield* this.wait(30) //

        const core = new Core()
        const wings = [new Wing(core, 0), new Wing(core, 1)]
        const turrets = wings.flatMap((w, wi) => Array.from({ length: 13 }, (_, i) => new Turret(w, wi, i)))

        g.enemies.push(core, ...wings, ...turrets) //[cite: 10]

        yield* this.waitDefeatEnemy() //[cite: 10]
        scorenize()
        flash(Dom.container)
        shake(Dom.container, 750, 8)
    }
}

class Core extends Enemy {
    constructor() {
        super(1200, 64, new EnemyRendererCore(), { remainingCharge: 1200, margin: 60 }) //[cite: 10]
        this.p = vec(0, -g.height * 2)
        this.moveTo(vec(0, -g.height / 4), 90) // 導入移動[cite: 10]
    }

    *G() {
        // 8の字を描くような滑らかな移動
        const t = (this.frame - 90) / 300
        const centerX = 0
        const centerY = -g.height / 4
        this.p = vec(centerX + Math.sin(t * T) * g.width * 0.3, centerY + Math.sin(t * T * 2) * g.height * 0.1) //[cite: 7]
        yield
    }

    *H() {
        yield* this.waitCharge() //[cite: 10]

        remodel()
            .p(this.p.clone())
            .beam(this, 0)
            .radian(T / 4) // 回転制御[cite: 7]
            .ex(4)
            .g(function* (me) {
                yield* Remodel.ease(me, "length", g.height, 60, Ease.Out)
                yield* Array(120)
                yield* Remodel.fadeout(me, 15)
            })
            .fire()

        yield* Array(240)
    }
}

/**
 * ウィング：螺旋状に展開されるライン弾
 */
class Wing extends Enemy {
    constructor(
        core: Core,
        private readonly index: number,
    ) {
        super(400, 48, new EnemyRendererMob()) //[cite: 10]
        this.setParent(core, () => vec((index === 0 ? -1 : 1) * 220, 0)) //[cite: 10]
    }

    *G() {
        const dir = this.index === 0 ? 1 : -1

        // 数学的に制御された螺旋弾幕
        remodel()
            .appearance(Bullet.Appearance.Ball)
            .colorful(this.frame + this.index * 100)
            .p(this.p.clone())
            .speed(5)
            .r(6)
            .radian((this.frame / 60) * T * dir)
            .ex(13) // 13方向に展開
            .fire()

        yield* Array(12)
    }
}

/**
 * タレット：規則的なウェーブを描くアロー弾
 */
class Turret extends Enemy {
    constructor(
        wing: Wing,
        wingIndex: number,
        private readonly index: number,
    ) {
        super(80, 30, new EnemyRendererMob(), { remainingCharge: 600 }) //[cite: 10]
        this.setParent(wing, () => vec.arg(T * (index / 13) - T / 4).scaled(90)) //[cite: 10]
    }

    *G() {
        yield* this.waitCharge()

        remodel()
            .appearance(Bullet.Appearance.Arrow)
            .collision(Bullet.Collision.Arrow)
            .colorful(this.frame)
            .p(this.p.clone())
            .r(28)
            .radian(this.index * (T / 13)) // 円形に広がる
            .g(function* (me) {
                yield* Array(30)

                if (isSmartPhone) {
                    me.radian = g.player.p.minus(me.p).arg()
                    yield* Array(30)
                } else {
                    yield* Remodel.ease(me, "radian", g.player.p.minus(me.p).arg(), 30, Ease.Out)
                }

                yield* Remodel.accel(me, 30, 32)
            })
            .fire()

        yield* Array(180)
    }
}
