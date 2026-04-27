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

export default class extends Stage {
    protected *G(): Generator<void, void, unknown> {
        yield* this.wait(30)

        const parent = new E()
        g.enemies.push(parent)

        // 120度間隔で公転しながら「止まって加速」の狙い弾
        g.enemies.push(new Child0(parent, 0))
        g.enemies.push(new Child0(parent, 1))
        g.enemies.push(new Child0(parent, 2))

        // ヒポトロコイド軌道で12方向放射リング
        g.enemies.push(new Child1(parent, 0))
        g.enemies.push(new Child1(parent, 1))
        g.enemies.push(new Child1(parent, 2))
        g.enemies.push(new Child1(parent, 3))

        // 左右固定位置から高頻度7-way扇形
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
 * - HP 1200、リサージュ(3:8)で複雑な軌道
 * - 5方向 × 3-nway の螺旋弾を8フレームごとに発射（密度が高い）
 * - radian の変化速度を速めにして回転螺旋が激しく見える
 */
class E extends Enemy {
    private readonly curve = Curves.lissajous(g.width * 0.55, g.height / 3, 3, 8)

    constructor() {
        super(600, 64)
        this.moveTo(vec(0, -g.height / 4), 60)
    }

    *G() {
        remodel()
            .appearance(Bullet.Appearance.Arrow)
            .collision(Bullet.Collision.Arrow)
            .colorful(this.frame)
            .p(this.p.clone())
            .speed(5)
            .radian(T * (this.frame / 180)) // 速い回転
            .r(24)
            .ex(5)
            .nway(2, T / 60)
            .fire()

        yield* Array(20)
    }

    *H() {
        this.p = this.curve((this.frame - 60) / 600).plus(vec(0, -g.height / 4))
        yield
    }
}

/**
 * 公転子機 (×3)
 * - 120度間隔でボスの周りを公転
 * - 狙い弾を発射後、一度減速停止してから高速加速（読みにくい）
 * - 各インデックスで発射タイミングをずらして弾幕に隙間を作らない
 */
class Child0 extends Enemy {
    private waited = false

    constructor(
        parent: Enemy,
        private readonly index: number,
    ) {
        super(200, 48, new EnemyRendererMob())
        this.setParent(parent, () => vec.arg(T * (this.frame / 480) + (T / 3) * index).scaled(180))
    }

    *G() {
        if (!this.waited) {
            yield* Array(this.index * 20)
            this.waited = true
        }

        remodel()
            .appearance(Bullet.Appearance.Ball)
            .colorful(this.frame * 3)
            .r(28)
            .p(this.p.clone())
            .aim(g.player.p)
            .g(function* (me) {
                yield* Remodel.stop(me, 20) // 20フレームで停止
                yield* Array(10) // 10フレーム静止
                yield* Remodel.accel(me, 20, 18) // 高速で再加速
            })
            .fire()

        yield* Array(60)
    }
}

/**
 * ヒポトロコイド軌道子機 (×4)
 * - 複雑な花びら軌道でボス周辺を漂う
 * - 12方向放射ボールを50フレームごとに発射
 * - Appear アニメーションで出現演出あり
 */
class Child1 extends Enemy {
    constructor(parent: Enemy, index: number) {
        super(100, 36, new EnemyRendererMob())
        this.setParent(parent, () => Curves.hypotrochoid(250, 120, 240)(this.frame / 24 + (T / 4) * index))
    }

    *G() {
        remodel()
            .colorful(this.frame * 2 + 120)
            .appearance(Bullet.Appearance.Ball)
            .speed(7)
            .p(this.p.clone())
            .r(6)
            .ex(13)
            .g((me) => Remodel.appear(me, 20))
            .fire()

        yield* Array(50)
    }
}

/**
 * 左右固定子機 (×2)
 * - ボスの左右下寄りに配置
 * - 7-way 扇形の矢印弾を45フレームごとに高頻度発射
 * - Appear + 加速アニメーションで弾に勢いを持たせる
 */
class Child2 extends Enemy {
    constructor(parent: Enemy, index: number) {
        super(200, 52, new EnemyRendererMob())
        this.setParent(parent, () => vec(200 * (2 * index - 1), 80))
    }

    *G() {
        remodel()
            .colorful(this.frame * 2 + 60)
            .p(this.p.clone())
            .aim(g.player.p)
            .nway(7, T / 12)
            .g((me) => Remodel.appear(me, 12))
            .g(function* (me) {
                yield* Remodel.accel(me, 20, 6)
            })
            .fire()

        yield* Array(45)
    }
}
