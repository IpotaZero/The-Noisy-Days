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
        super(1000, 80, new EnemyRendererCore(), { remainingCharge: 1200 })
        this.p = vec(0, -g.height)
        this.moveTo(vec(0, -g.height / 3), this.moveDuration)
    }

    *G() {
        this.p = this.curve((this.frame - this.moveDuration) / 600).plus(vec(0, -g.height / 3))
        yield
    }

    *H() {
        yield* this.waitCharge()

        // 中心から外側へ広がる巨大な12角形の波
        remodel()
            .appearance(Bullet.Appearance.Ball)
            .colorful(this.frame)
            .p(this.p.clone())
            .speed(5)
            .r(28) // Ball制限: 28
            .ex(12)
            .g(function* (me) {
                yield* Remodel.appear(me, 20)
                yield* Remodel.stop(me, 30)
                yield* Remodel.accel(me, 40, 8)
            })
            .fire()

        yield* Array(60)
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

        // シールドからプレイヤーを囲い込むようなライン状の弾幕
        remodel()
            .appearance(Bullet.Appearance.Ball)
            .colorful(this.frame * 1.5)
            .p(this.p.clone())
            .speed(7)
            .r(6) // Ball制限: 6
            .aim(g.player.p)
            .nway(5, T / 32)
            .fire()

        yield* Array(40)
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
            .colorful(this.frame + this.droneIndex * 10)
            .p(this.p.clone())
            .speed(9)
            .r(28) // Arrow制限: 28
            .aim(g.player.p)
            .fire()

        yield* Array(100)
    }
}
