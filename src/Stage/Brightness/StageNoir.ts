import { Bullet } from "../../Game/Bullet/Bullet"
import { Enemy } from "../../Game/Enemy/Enemy"
import { Remodel, remodel } from "../../Game/Bullet/Remodel"
import { vec } from "../../utils/Vec"
import { g, scorenize, T } from "../../global"
import { Stage } from "../Stage"
import { flash, shake } from "../../utils/shake"
import { Dom } from "../../Dom"

import * as Curves from "../../utils/Functions/Curves"
import { EnemyRendererMob } from "../../Game/Enemy/EnemyRendererMob"
import { EnemyRendererCore } from "../../Game/Enemy/EnemyRendererCore"
import { isSmartPhone } from "../../utils/Functions/isSmartPhone"

export default class extends Stage {
    protected *G(): Generator<void, void, unknown> {
        yield* this.wait(30)

        const core = new FortressCore()
        const shields = [0, 1, 2, 3].map((i) => new OrbitalShield(core, i))
        const drones = shields.flatMap((s) => [0, 1, 2, 3].map((j) => new TacticalDrone(s, j)))

        g.enemies.push(core, ...shields, ...drones)

        yield* this.waitDefeatEnemy()
        scorenize()
        flash(Dom.container)
        shake(Dom.container, 750, 8)
    }
}

/**
 * 要塞コア: 高密度の円環弾
 * r: 80
 */
class FortressCore extends Enemy {
    private readonly curve = Curves.lissajous(g.width * 0.45, g.height / 6, 5, 6)
    private readonly moveDuration = 90

    constructor() {
        super(800, 80, new EnemyRendererCore(), { remainingCharge: 1200 })
        this.p = vec(0, -g.height)
        this.moveTo(vec(0, -g.height / 3), this.moveDuration)
    }

    *G() {
        this.p = this.curve((this.frame - this.moveDuration) / 600).plus(vec(0, -g.height / 3))
        yield
    }

    *H() {
        yield* this.waitCharge()

        for (let i = 0; i < 360; i++) {
            remodel()
                .appearance(Bullet.Appearance.Ball)
                .r(6)
                .colorful(i)
                .p(this.p.clone())
                .speed(5)
                .radian(T * (i / 30))
                .ex(3)
                .nway(5, T / 24)
                .fire()
            yield* Array(10)
        }

        yield* Array(120)
    }
}

/**
 * 回転シールド: 防護壁のような列弾
 * r: 44
 */
class OrbitalShield extends Enemy {
    constructor(
        core: Enemy,
        private readonly shieldIndex: number,
    ) {
        super(300, 44, new EnemyRendererMob(), { remainingCharge: 600 })
        this.setParent(core, () => {
            const angle = (this.frame / 180) * (this.shieldIndex % 2 ? 1 : -1) + (this.shieldIndex * T) / 4
            return vec.arg(angle).scaled(200)
        })
    }

    *G() {
        yield* this.waitCharge()

        for (let i = 0; i < 360; i++) {
            remodel()
                .colorful(this.frame * 1.5)
                .p(this.p.clone())
                .radian(T * (this.frame / 360))
                .speed(0)
                .g(function* (me) {
                    yield* Remodel.appear(me, 20)
                    yield* Remodel.accel(me, 30, 8)
                })
                .fire()
            yield* Array(10)
        }

        yield* Array(60)
    }
}

/**
 * 戦術ドローン: 全方位からの不規則な自機狙い
 * r: 24
 */
class TacticalDrone extends Enemy {
    constructor(
        shield: Enemy,
        private readonly droneIndex: number,
    ) {
        super(50, 24, new EnemyRendererMob(), { margin: droneIndex * 15 })
        this.setParent(shield, () => {
            const angle = this.frame / 45 + (this.droneIndex * T) / 4
            return vec.arg(angle).scaled(70)
        })
    }

    *G() {
        // ドローンは充電を待たずに小出しに撃つ
        remodel()
            .appearance(Bullet.Appearance.Arrow)
            .collision(Bullet.Collision.Arrow)
            .color("white")
            .p(this.p.clone())
            .speed(0)
            .r(28) // Arrow制限: 28
            .aim(g.player.p)
            .g(function* (me) {
                const baseRadian = me.radian
                const shift = 0

                for (let i = 0; i < 200; i++) {
                    me.radian = Math.floor((baseRadian + Math.sin(i / 10 + shift) * 0.8) * 4) / 4
                    yield
                }
            })
            .g(function* (me) {
                while (1) {
                    me.p = me.p.plus(vec.arg(me.radian).scaled(18))
                    yield* Array(2)
                }
            })
            .fire()

        yield* Array(100)
    }
}
