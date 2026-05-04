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
        yield* this.wait(30)

        const core = new Core()
        const wings = [new Wing(core, 0), new Wing(core, 1)]
        const turrets = wings.flatMap((w, wi) => Array.from({ length: 13 }, (_, i) => new Turret(w, wi, i)))

        g.enemies.push(core, ...wings, ...turrets)

        yield* this.waitDefeatEnemy()
        scorenize()
        flash(Dom.container)
        shake(Dom.container, 750, 8)
    }
}

/**
 * コア: 包囲収束弾
 *
 * 自機を中心とした円上にボールを静止展開し、
 * 全弾が一定時間後に自機方向へ一斉収束する。
 * プレイヤーは展開中に「どこに逃げれば収束を外せるか」を判断する必要がある。
 */
class Core extends Enemy {
    constructor() {
        super(600, 64, new EnemyRendererCore(), { remainingCharge: 1200, margin: 60 })
        this.p = vec(0, -g.height * 2)
        this.moveTo(vec(0, -g.height / 4), 90)
    }

    *G() {
        const t = (this.frame - 90) / 300
        this.p = vec(Math.sin(t * T) * g.width * 0.3, -g.height / 4 + Math.sin(t * T * 2) * g.height * 0.1)
        yield
    }

    *H() {
        yield* this.waitCharge()

        remodel()
            .appearance(Bullet.Appearance.Arrow)
            .collision(Bullet.Collision.Arrow)
            .colorful(this.frame)
            .p(g.player.p.clone())
            .r(28)
            .circle(120, 200, { direction: "inner" })
            .speed(0)
            .g(function* (me) {
                yield* Remodel.appear(me, 15)
                // 60f静止後、自機方向へ一斉収束
                yield* Array(30)
                yield* Remodel.accel(me, 20, 12)
                yield* Array(30)

                if (isSmartPhone) {
                    me.radian = g.player.p.minus(me.p).arg()
                    yield* Array(30)
                } else {
                    yield* Remodel.ease(me, "radian", g.player.p.minus(me.p).arg(), 30, Ease.Out)
                }
            })
            .fire()

        yield* Array(240)
    }
}

/**
 * ウィング: 7枚ローズカーブ弾幕
 *
 * ローズ曲線 r = cos(7θ) の花弁に沿って弾速を割り当てる。
 * k=7（奇数）なので正確に7枚の花弁が描かれる。
 * 左右のウィングで回転方向を逆にすることで
 * 画面全体に対称的な模様が広がる。
 */
class Wing extends Enemy {
    constructor(
        core: Core,
        private readonly index: number,
    ) {
        super(200, 48, new EnemyRendererMob())
        this.setParent(core, () => vec((index === 0 ? -1 : 1) * 220, 0))
    }

    *G() {
        const dir = this.index === 0 ? 1 : -1
        const count = 120
        const baseAngle = T * (this.frame / 180) * dir

        for (let i = 0; i < count; i++) {
            const theta = (i / count) * T + baseAngle
            const roseR = Math.cos(4 * theta)
            if (roseR <= 0) continue

            remodel()
                .appearance(Bullet.Appearance.Ball)
                .colorful(this.frame + this.index * 100)
                .p(this.p.clone())
                .speed(roseR * 6 + 1) // 花弁の濃い部分ほど速い
                .r(6)
                .radian(theta)
                .g((me) => Remodel.appear(me, 8))
                .fire()
        }

        yield* Array(60)
    }
}

/**
 * タレット: ブーメラン弾
 *
 * 自機の逆方向へ発射し、止まってから自機方向へ反転加速する。
 * 「外れた」と思っても戻ってくるため常に注意が必要。
 * 26基がそれぞれ異なる充電量（frameのオフセット）を持ち、
 * タイミングがばらける。
 */
class Turret extends Enemy {
    constructor(
        wing: Wing,
        wingIndex: number,
        private readonly index: number,
    ) {
        super(50, 30, new EnemyRendererMob(), { remainingCharge: 600 })
        this.setParent(wing, () => vec.arg(T * (index / 13) - T / 4).scaled(90))
    }

    *G() {
        yield* this.waitCharge()

        remodel()
            .appearance(Bullet.Appearance.Arrow)
            .collision(Bullet.Collision.Arrow)
            .colorful(this.frame)
            .p(this.p.clone())
            .r(28)
            // 自機と逆方向に発射
            .aim(g.player.p)
            .g(function* (me) {
                // 逆方向に向き直す
                me.radian += Math.PI
                yield* Remodel.accel(me, 15, 8)
                yield* Remodel.stop(me, 20)
                // 自機方向へ反転
                me.radian = g.player.p.minus(me.p).arg()
                yield* Remodel.accel(me, 20, 14)
            })
            .fire()

        yield* Array(180)
    }
}
