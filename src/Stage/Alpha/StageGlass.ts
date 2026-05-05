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

export default class extends Stage {
    protected *G(): Generator<void, void, unknown> {
        yield* this.wait(30)

        // 1. コア（支点）
        const anchor = new MineMasterCore()

        // 2. 伝統の振り子アーム（StageFog由来）
        const arm1 = new Arm(anchor, { hp: 400, r: 48 })
        const arm2 = new Arm(arm1, { hp: 300, r: 40 })

        // 3. ファンネル（4基）：コアを旋回しながら機雷を設置
        const funnel = new MineLayFunnel(anchor)

        g.enemies.push(anchor, arm1, arm2, funnel)

        yield* this.waitDefeatEnemy()
        scorenize()
        flash(Dom.container)
        shake(Dom.container, 750, 8)
    }
}

class MineMasterCore extends Enemy {
    private readonly curve = Curves.lissajous(g.width * 0.45, g.height / 6, 5, 6)

    constructor() {
        super(700, 56, new EnemyRendererCore(), { remainingCharge: 1200 })
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
                yield* this.attackSweep()
            } else {
                yield* this.attackEncircle()
            }
            count++
        }
    }

    /**
     * 薙ぎ払い: 11方向の小ボールを回転させながら連射。
     * 機雷が散らばっている中で自由に動けないプレイヤーを追い詰める。
     */
    private *attackSweep() {
        for (let i = 0; i < 8; i++) {
            remodel()
                .appearance(Bullet.Appearance.Ball)
                .colorful(this.frame)
                .p(this.p.clone())
                .speed(7)
                .radian(T * (this.frame / 240))
                .r(6)
                .ex(11)
                .g((me) => Remodel.appear(me, 8))
                .fire()

            yield* Array(20)
        }
        yield* Array(60)
    }

    /**
     * 包囲収束: 自機を囲む円上に18発の静止弾を展開し、
     * 80f後に一斉収束。機雷で逃げ場が塞がれている状況で使うと凶悪。
     */
    private *attackEncircle() {
        const count = 18
        const radius = 320
        const playerP = g.player.p.clone()

        for (let i = 0; i < count; i++) {
            remodel()
                .appearance(Bullet.Appearance.Ball)
                .colorful(this.frame + i * 15)
                .p(playerP.plus(vec.arg((i / count) * T).scaled(radius)))
                .speed(0)
                .r(28)
                .g(function* (me) {
                    yield* Remodel.appear(me, 15)
                    yield* Array(80)
                    me.radian = g.player.p.minus(me.p).arg()
                    yield* Remodel.accel(me, 20, 12)
                })
                .fire()
        }

        yield* Array(300)
    }
}

/**
 * 振り子アーム：自機狙いで追い込む
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
 * ファンネル：機雷を設置する自律ユニット
 */
class MineLayFunnel extends Enemy {
    constructor(private readonly parent: Enemy) {
        super(250, 24, new EnemyRendererFunnel(), { remainingCharge: 360 })
        this.p = vec(0, 0)

        this.g.push(this.a())
    }

    *G() {
        yield* this.waitCharge()
        const mine = new DeployedMine(this.p.clone())
        g.enemies.push(mine)
        yield* Array(120)
    }

    private *a() {
        while (this.chargeRemaining > 0) {
            this.p = this.parent.p.plus(vec(0, 100))
            yield
        }
        this.funnel(vec(5, 5))
    }
}

/**
 * 機雷：設置後に静止し、一定時間で爆発
 */
class DeployedMine extends Enemy {
    constructor(pos: Vec) {
        super(50, 32, new EnemyRendererMine())
        this.p = pos

        this.mine(300, () => {
            remodel().colorful(this.frame).appearance(Bullet.Appearance.Ball).r(6).p(this.p.clone()).ex(53).fire()
        })
    }
}
