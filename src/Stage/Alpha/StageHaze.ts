import { Bullet } from "../../Game/Bullet/Bullet"
import { Enemy } from "../../Game/Enemy/Enemy"
import { Remodel, remodel } from "../../Game/Bullet/Remodel"
import { Vec, vec } from "../../utils/Vec"
import { g, scorenize, T } from "../../global"
import { Stage } from "../Stage"
import { flash, shake } from "../../utils/shake"
import { Dom } from "../../Dom"

import { EnemyRendererMine } from "../../Game/Enemy/EnemyRendererMine"
import { EnemyRendererFunnel } from "../../Game/Enemy/EnemyRendererFunnel"
import { EnemyRendererMob } from "../../Game/Enemy/EnemyRendererMob"
import { EnemyRendererCore } from "../../Game/Enemy/EnemyRendererCore"
import * as Curves from "../../utils/Functions/Curves"
import { Ease } from "../../utils/Functions/Ease"

export default class extends Stage {
    protected *G(): Generator<void, void, unknown> {
        yield* this.wait(30)

        const anchor = new MineMasterCore()
        const arm1 = new Arm(anchor, { hp: 400, r: 48 })
        const arm2 = new Arm(arm1, { hp: 300, r: 40 })
        const funnel = new ThrowingFunnel(anchor)

        g.enemies.push(anchor, arm1, arm2, funnel)

        yield* this.waitDefeatEnemy()
        scorenize()
        flash(Dom.container)
        shake(Dom.container, 750, 8)
    }
}

/**
 * コア
 * 攻撃1: 7枚ローズカーブの小ボール（美しく読みやすい）
 * 攻撃2: 5-way狙い矢印を短間隔で連射（投擲機雷と合わせて追い詰める）
 */
class MineMasterCore extends Enemy {
    private readonly curve = Curves.lissajous(g.width * 0.45, g.height / 6, 5, 6)

    constructor() {
        super(350, 56, new EnemyRendererCore(), { remainingCharge: 1200 })
        this.p = vec(0, -g.height)
        this.moveTo(vec(0, -g.height / 5), 60)
    }

    *G() {
        this.p = this.curve((this.frame - 60) / 360).plus(vec(0, -g.height / 5))
        yield
    }

    *H() {
        yield* this.waitCharge()

        let count = 0
        while (true) {
            if (count % 2 === 0) {
                yield* this.attackRose()
            } else {
                yield* this.attackBarrage()
            }
            count++
        }
    }

    private *attackRose() {
        const count = 12

        for (let h = 0; h < 45; h++) {
            for (let i = 0; i < count; i++) {
                const theta = (i / count) * T + (h / 360) * T * 2
                remodel().appearance(Bullet.Appearance.Ball).r(6).colorful(this.frame).p(this.p.clone()).radian(theta).fire()
            }

            for (let i = 0; i < count; i++) {
                const theta = (i / count) * T - (h / 360) * T * 2
                remodel().appearance(Bullet.Appearance.Ball).r(6).colorful(this.frame).p(this.p.clone()).radian(theta).fire()
            }

            yield* Array(9)
        }
        yield* Array(60)
    }

    private *attackBarrage() {
        for (let i = 0; i < 100; i++) {
            remodel()
                .colorful(this.frame)
                .p(this.p.clone())
                .radian(Math.floor((i / 23) * T * 8) / 8)
                .ex(3)
                .speed(9)
                .g(function* (me) {
                    yield* Remodel.reaccel(me, 30, 30, 30)
                })
                .fire()

            yield
        }
        yield* Array(60)
    }
}

/**
 * 振り子アーム
 */
class Arm extends Enemy {
    constructor(parent: Enemy, { hp = 300, r = 36 }) {
        super(hp, r, new EnemyRendererMob())
        this.setParent(parent, () => vec.arg((this.frame / r) * 4).scaled(r * 2.2))
    }

    *G() {
        remodel().colorful(this.frame).p(this.p.clone()).aim(g.player.p).fire()
        yield* Array(80)
    }
}

/**
 * 投擲ファンネル
 *
 * 充電中はコアに追従。充電完了後に自由飛行を開始し、
 * 自機方向へ機雷を「投擲」する。
 * 機雷は初速12で発射され、摩擦係数0.88で減速、
 * 速度がほぼ0になった場所に静止して爆発を待つ。
 */
class ThrowingFunnel extends Enemy {
    constructor(private readonly parent: Enemy) {
        super(100, 24, new EnemyRendererFunnel(), { remainingCharge: 360 })
        this.p = vec(0, 0)
        this.g.push(this.movement())
    }

    *G() {
        yield* this.waitCharge()

        // 自機方向へ機雷を投擲
        const throwAngle = g.player.p.minus(this.p).arg()
        const mine = new ThrownMine(this.p.clone(), throwAngle)
        g.enemies.push(mine)

        yield* Array(90)
    }

    private *movement() {
        // 充電中はコアの少し下に追従
        while (this.chargeRemaining > 0) {
            this.p = this.parent.p.plus(vec(0, 120))
            yield
        }
        // 充電後は画面内を自由飛行（壁で反射）
        this.funnel(vec(4, 3))
    }
}

/**
 * 投擲機雷
 *
 * 指定角度に初速12で飛び出し、摩擦係数0.88を毎フレーム掛けて減速。
 * 速度が0.3以下になったら静止して mine() を起動。
 * 静止後300fで爆発し、周囲に53方向の小ボールを散らす。
 */
class ThrownMine extends Enemy {
    constructor(pos: Vec, angle: number) {
        super(50, 32, new EnemyRendererMine())
        this.p = pos
        this.g.push(this.physics())

        // 静止 → 機雷として起爆待ち
        this.mine(300, () => {
            remodel().colorful(this.frame).appearance(Bullet.Appearance.Ball).r(6).p(this.p.clone()).ex(53).fire()
        })
    }

    private *physics() {
        const friction = 0.97
        const v = g.player.p.minus(this.p).normalized().scaled(12)

        // 摩擦で減速しながら移動
        while (1) {
            const d = g.player.p.minus(this.p)

            v.add(d.normalized().scaled(2400 / d.magnitudeSquared()))
            this.p.add(v)
            v.scale(friction)
            yield
        }
    }
}
