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
import * as Curves from "../../utils/Functions/Curves"
import { Ease } from "../../utils/Functions/Ease"

export default class extends Stage {
    protected *G(): Generator<void, void, unknown> {
        yield* this.wait(30)

        const anchor = new Anchor()
        const arm1 = new Arm(anchor, { hp: 400, r: 48 })
        const arm2 = new Arm(arm1, { hp: 300, r: 40 })
        const arm3 = new Arm(arm2, { hp: 200, r: 32 })
        const arm4 = new Arm(arm3, { hp: 150, r: 26 })
        const satellites = [0, 1, 2, 3].map((i) => new Satellite(anchor, i))
        const subSatellites = satellites.flatMap((s) => [0, 1, 2].map((j) => new SubSatellite(s, j)))

        g.enemies.push(anchor, arm1, arm2, arm3, arm4, ...satellites, ...subSatellites)

        yield* this.waitDefeatEnemy()
        scorenize()
        flash(Dom.container)
        shake(Dom.container, 750, 8)
    }
}

/**
 * 支点コア
 * 充電後: 自機を取り囲む円上に20発の静止弾を展開し、
 * 60f後に全弾が自機方向へ一斉収束する。
 * プレイヤーは展開を見てから逃げ場を判断する必要がある。
 */
class Anchor extends Enemy {
    private readonly curve = Curves.lissajous(g.width * 0.45, g.height / 6, 5, 6)
    protected margin: number = 60

    constructor() {
        super(600, 56, new EnemyRendererCore(), { remainingCharge: 1200 })
        this.p = vec(0, -g.height * 2)
        this.moveTo(vec(0, -g.height / 5), 60)
    }

    *G() {
        this.p = this.curve((this.frame - 60) / 360).plus(vec(0, -g.height / 5))
        yield
    }

    *H() {
        yield* this.waitCharge()

        const count = 20
        const radius = 480
        const playerP = g.player.p.clone()

        for (let i = 0; i < count; i++) {
            const angle = (i / count) * T
            remodel()
                .appearance(Bullet.Appearance.Ball)
                .colorful(this.frame + i * 12)
                .p(playerP.plus(vec.arg(angle).scaled(radius)))
                .speed(0)
                .r(28)
                .g(function* (me) {
                    yield* Remodel.appear(me, 15)
                    yield* Array(60)
                    me.radian = g.player.p.minus(me.p).arg()
                    yield* Remodel.accel(me, 20, 13)
                })
                .fire()
        }

        yield* Array(300)
    }
}

/**
 * 振り子アーム
 * 公転しながら11方向の小ボールを放射。
 * 出現演出後に止まって再加速することで、
 * 振り子の動き自体が弾幕の一部になる。
 */
class Arm extends Enemy {
    constructor(parent: Enemy, { hp = 300, r = 36 }) {
        super(hp, r, new EnemyRendererMob())
        this.setParent(parent, () => vec.arg((this.frame / r) * 4).scaled(r * 2))
    }

    *G() {
        remodel()
            .appearance(Bullet.Appearance.Ball)
            .colorful(this.frame)
            .p(this.p.clone())
            .speed(6)
            .radian(T * (this.frame / 180))
            .r(6)
            .ex(11)
            .g(function* (me) {
                yield* Remodel.appear(me, 10)
                yield* Remodel.stop(me, 15)
                yield* Remodel.accel(me, 15, 9)
            })
            .fire()

        yield* Array(50)
    }
}

/**
 * 子機衛星
 * 充電後: ローズカーブ k=5（5枚花びら）の弾幕。
 * 全体がゆっくり回転しながら花弁模様を描く。
 * 4基の衛星が90度ずつずれた位相で回転するので
 * 画面全体に花が咲き乱れる。
 */
class Satellite extends Enemy {
    constructor(
        parent: Enemy,
        private readonly index: number,
    ) {
        super(300, 64, new EnemyRendererMob(), { remainingCharge: 600 })
        this.setParent(parent, () => vec.arg((this.frame / 360) * T + (this.index * T) / 4).scaled(280))
    }

    *G() {
        yield* this.waitCharge()

        const count = 30
        const baseAngle = T * (this.frame / 300) + (this.index * T) / 4

        for (let i = 0; i < count; i++) {
            const theta = (i / count) * T + baseAngle
            const roseR = Math.cos(5 * theta)
            if (roseR <= 0) continue

            remodel()
                .appearance(Bullet.Appearance.Ball)
                .colorful(this.frame + this.index * 60)
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
 * 孫機衛星
 * 公転しながら自機逆方向へ発射→止まって再照準→加速（ブーメラン）。
 * 外れたと思った弾が戻ってくるので、
 * 子機の花模様を避けながら追いかけ直す必要がある。
 */
class SubSatellite extends Enemy {
    constructor(
        parent: Enemy,
        private readonly index: number,
    ) {
        super(80, 48, new EnemyRendererMob())
        this.setParent(parent, () => vec.arg((-this.frame / 240) * T + (this.index * T) / 3).scaled(96))
    }

    *G() {
        remodel()
            .appearance(Bullet.Appearance.Arrow)
            .collision(Bullet.Collision.Arrow)
            .colorful(this.frame + this.index * 40)
            .p(this.p.clone())
            .r(28)
            .aim(g.player.p)
            .speed(8)
            .g(function* (me) {
                // 逆方向に反転して発射
                me.radian += Math.PI
                yield* Remodel.accel(me, 15, 8)
                yield* Remodel.stop(me, 20)
                // 自機方向へ反転加速
                me.radian = g.player.p.minus(me.p).arg()
                yield* Remodel.accel(me, 20, 13)
            })
            .fire()

        yield* Array(40)
    }
}
