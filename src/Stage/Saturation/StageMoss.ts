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
import { Ease } from "../../utils/Functions/Ease"
import { isSmartPhone } from "../../utils/Functions/isSmartPhone"

export default class extends Stage {
    protected *G(): Generator<void, void, unknown> {
        yield* this.wait(30)

        const parent = new E()
        g.enemies.push(parent)

        g.enemies.push(new Child0(parent, 0))
        g.enemies.push(new Child0(parent, 1))
        g.enemies.push(new Child0(parent, 2))

        g.enemies.push(new Child1(parent, 0))
        g.enemies.push(new Child1(parent, 1))
        g.enemies.push(new Child1(parent, 2))
        g.enemies.push(new Child1(parent, 3))

        g.enemies.push(new Child2(parent, 0))
        g.enemies.push(new Child2(parent, 1))

        yield* this.waitDefeatEnemy()
        scorenize()
        flash(Dom.container)
        shake(Dom.container, 750, 8)
    }
}

/**
 * ボス本体
 * - 8方向均等放射の小ボール(r=6)をばらまく
 * - ゆっくり回転するので次の弾がどこに来るか読める（読めるわけないだろ！！！！！！！！！！）
 * - 間隔55フレーム
 */
class E extends Enemy {
    private readonly curve = Curves.lissajous(g.width * 0.55, g.height / 3, 3, 8)

    constructor() {
        super(600, 64)
        this.moveTo(vec(0, -g.height / 4), 60)
    }

    *G() {
        remodel()
            .appearance(Bullet.Appearance.Ball)
            .colorful(this.frame)
            .p(this.p.clone())
            .radian(T * (this.frame / 360))
            .r(6)
            .speed(6)
            .ex(31)
            .fire()

        yield* Array(40)
    }

    *H() {
        this.p = this.curve((this.frame - 60) / 600).plus(vec(0, -g.height / 4))
        yield
    }
}

/**
 * 公転子機 (×3)
 * - 自機狙い矢印弾を1発。見た目で狙い弾だと分かる
 * - 各機の発射周期を 70 / 90 / 110 フレームと変えることで
 *   自然に位相がずれ、攻撃が単調にならない
 */
class Child0 extends Enemy {
    private readonly interval: number

    constructor(
        parent: Enemy,
        private readonly index: number,
    ) {
        super(200, 48, new EnemyRendererMob())
        this.setParent(parent, () => vec.arg(T * (this.frame / 480) + (T / 3) * index).scaled(180))
        this.interval = 240 + index * 15 // 40 / 55 / 70
    }

    *G() {
        remodel()
            .appearance(Bullet.Appearance.Arrow)
            .collision(Bullet.Collision.Arrow)
            .colorful(this.frame * 2 + 120)
            .p(this.p.clone())
            .r(28)
            .ex(13)
            .g(function* (me) {
                yield* Remodel.stop(me, 20) // 20フレームで停止
                yield* Array(5) // 10フレーム静止

                // スマホだと描画が重すぎた
                if (!isSmartPhone) {
                    const frame = 15

                    const radian = me.radian
                    for (let i = 1; i < frame + 1; i++) {
                        me.radian = radian + (T / 2) * Ease.InOut(i / frame)
                        yield
                    }
                }

                yield* Remodel.accel(me, 20, 18) // 高速で再加速
            })
            .fire()

        yield* Array(this.interval)
    }
}

/**
 * ヒポトロコイド軌道子機 (×4)
 * - 小ボール(r=6)を4方向にばらまく
 * - 各機の周期を 80 / 95 / 110 / 125 フレームとすることで
 *   4機が少しずつずれながら発射し、絶え間ない圧を生む
 */
class Child1 extends Enemy {
    private readonly interval: number

    constructor(
        parent: Enemy,
        private readonly index: number,
    ) {
        super(100, 36, new EnemyRendererMob())
        this.setParent(parent, () => Curves.hypotrochoid(250, 120, 240)(this.frame / 24 + (T / 4) * index))
        this.interval = 40 + index * 12 // 40 / 52 / 64 / 76
    }

    *G() {
        remodel()
            .appearance(Bullet.Appearance.Ball)
            .colorful(this.frame * 3)
            .r(28)
            .p(this.p.clone())
            .radian(T / 4)
            .fire()

        yield* Array(this.interval)
    }
}

/**
 * 左右固定子機 (×2)
 * - 自機狙い矢印弾1発。見た目でどこに飛ぶか分かる
 * - index=0 は周期90、index=1 は周期65 と大きく変えることで
 *   左右の発射リズムが長期的にすれ違い、交互に来たり重なったりする
 */
class Child2 extends Enemy {
    private readonly interval: number

    constructor(
        parent: Enemy,
        private readonly index: number,
    ) {
        super(200, 52, new EnemyRendererMob())
        this.setParent(parent, () => vec(200 * (2 * index - 1), 80))
        this.interval = index === 0 ? 50 : 35
    }

    *G() {
        remodel()
            .colorful(this.frame * 2 + 60)
            .p(this.p.clone())
            .radian(T / 4)
            .nway(7, T / 24)
            .fire()

        yield* Array(this.interval)
    }
}
