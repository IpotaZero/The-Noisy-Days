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
import { EnemyRendererBoss } from "../../Game/Enemy/EnemyRendererBoss"
import { isSmartPhone } from "../../utils/Functions/isSmartPhone"
import { Ease } from "../../utils/Functions/Ease"

export default class extends Stage {
    protected *G(): Generator<void, void, unknown> {
        yield* this.wait(30)

        const core = new FortressCore()
        const shields = [0, 1, 2, 3].map((i) => new OrbitalShield(core, i))
        const drones = shields.flatMap((s) => [0, 1, 2, 3].map((j) => new TacticalDrone(s, j)))

        // 追加: 逆回転する外周シールド（×6）
        const outerShields = Array.from({ length: 6 }, (_, i) => new OuterShield(core, i))

        // 追加: 各シールドに付属する砲塔（×8、シールド×4に各2門）
        const cannons = shields.flatMap((s, si) => [new ShieldCannon(s, si, 0), new ShieldCannon(s, si, 1)])

        // 追加: コアを高速で周回する超高密度リング（×8）
        const ring = Array.from({ length: 8 }, (_, i) => new RingUnit(core, i))

        g.enemies.push(core, ...shields, ...drones, ...outerShields, ...cannons, ...ring)

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
        super(800, 80, new EnemyRendererCore(), { remainingCharge: 2400 })
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
        super(50, 44, new EnemyRendererMob(), { remainingCharge: 600 })
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
        super(50, 32, new EnemyRendererMob(), { margin: droneIndex * 15 })
        this.setParent(shield, () => {
            const angle = this.frame / 45 + (this.droneIndex * T) / 4
            return vec.arg(angle).scaled(70)
        })
    }

    *G() {
        const target = g.player.p.clone()
        const p = this.p.clone()

        for (let i = 0; i < 4; i++) {
            remodel()
                .appearance(Bullet.Appearance.Arrow)
                .collision(Bullet.Collision.Arrow)
                .color("white")
                .p(p.clone())
                .aim(target)
                .speed(0)
                .r(28) // Arrow制限: 28
                .g(function* (me) {
                    const baseRadian = me.radian
                    const shift = 0
                    for (let h = 0; h < 10; h++) {
                        for (let i = 0; i < 60; i++) {
                            me.radian = Math.floor((baseRadian + Math.sin(i / 10 + shift)) * 4) / 4
                            yield* Array(2)
                        }
                        yield* Array(30)
                    }
                })
                .g(function* (me) {
                    while (1) {
                        me.p = me.p.plus(vec.arg(me.radian).scaled(12))
                        yield* Array(2)
                    }
                })
                .fire()
            yield* Array(4)
        }

        yield* Array(100)
    }
}

/**
 * 外周シールド（×6）
 * コアを半径350で逆方向に公転。
 * 内側のシールドと逆回転するため、プレイヤーの逃げ道が
 * 常に変化する。5枚ローズカーブ弾幕でエリアを塗る。
 */
class OuterShield extends Enemy {
    constructor(
        core: Enemy,
        private readonly index: number,
    ) {
        super(50, 36, new EnemyRendererMob(), { remainingCharge: 2400 })
        this.setParent(core, () => {
            const angle = -(this.frame / 240) * T + (this.index * T) / 6
            return vec.arg(angle).scaled(350)
        })
    }

    *G() {
        yield* this.waitCharge()

        const count = 24
        const baseAngle = T * (this.frame / 200) + (this.index * T) / 6

        for (let i = 0; i < count; i++) {
            const theta = (i / count) * T + baseAngle
            const roseR = Math.cos(5 * theta)
            if (roseR <= 0) continue

            remodel()
                .appearance(Bullet.Appearance.Ball)
                .colorful(this.frame * 2 + this.index * 40)
                .p(this.p.clone())
                .speed(roseR * 7 + 1)
                .radian(theta)
                .r(6)
                .g((me) => Remodel.appear(me, 8))
                .fire()
        }

        yield* Array(60)
    }
}

/**
 * シールド砲塔（各シールドに×2、計8門）
 * シールドの上下に配置。自機方向へ止まって再照準してから加速。
 * シールドが公転しながら砲塔も動くため、
 * 弾の来る方向が常に変化する。
 */
class ShieldCannon extends Enemy {
    private readonly interval: number

    constructor(
        shield: OrbitalShield,
        shieldIndex: number,
        private readonly index: number,
    ) {
        super(50, 26, new EnemyRendererMob(), { remainingCharge: 1200 })
        this.setParent(shield, () => vec.arg(T / 4 + index * Math.PI).scaled(80))
        this.interval = [50, 70, 60, 80][shieldIndex]
    }

    *G() {
        yield* this.waitCharge()

        remodel()
            .appearance(Bullet.Appearance.Arrow)
            .collision(Bullet.Collision.Arrow)
            .colorful(this.frame * 2)
            .r(28)
            .p(this.p.clone())
            .aim(g.player.p)
            .nway(3, T / 22)
            .speed(8)
            .g(function* (me) {
                yield* Remodel.appear(me, 8)
                yield* Remodel.stop(me, 15)

                if (isSmartPhone) {
                    me.radian = g.player.p.minus(me.p).arg() + T
                    yield* Array(15)
                } else {
                    yield* Remodel.ease(me, "radian", g.player.p.minus(me.p).arg() + T, 15, Ease.Out, 8)
                }

                yield* Remodel.accel(me, 15, 13)
            })
            .fire()

        yield* Array(this.interval)
    }
}

/**
 * リングユニット（×8）
 * コアを半径130で高速公転。コアのすぐ近くを取り巻くため
 * プレイヤーがコアに近づけない壁になる。
 * 毎フレーム公転方向に垂直な大ボールを左右に発射。
 * 高速で動くほど弾も速くなる（移動ベクトルを利用）。
 */
class RingUnit extends Enemy {
    private prevP = vec(0, 0)

    constructor(
        core: Enemy,
        private readonly index: number,
    ) {
        super(50, 18, new EnemyRendererMob(), { margin: index * 10 })
        this.setParent(core, () => vec.arg((this.frame / 120) * T + (this.index * T) / 8).scaled(130))
        this.prevP = this.p.clone()
    }

    *G() {
        const velocity = this.p.minus(this.prevP)
        const speed = Math.min(velocity.magnitude(), 8)
        this.prevP = this.p.clone()

        if (speed > 1) {
            remodel()
                .appearance(Bullet.Appearance.Ball)
                .colorful(this.frame * 3 + this.index * 20)
                .r(6)
                .p(this.p.clone())
                .speed(speed)
                .radian(velocity.arg() + T / 4)
                .nway(2, Math.PI)
                .g((me) => Remodel.appear(me, 6))
                .fire()
        }

        yield* Array(20)
    }
}
