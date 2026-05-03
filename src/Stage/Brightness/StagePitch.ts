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
import { Ease } from "../../utils/Functions/Ease"

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
 * 要塞コア（変更なし）
 */
class FortressCore extends Enemy {
    private readonly curve = Curves.lissajous(g.width * 0.45, g.height / 6, 5, 6)
    private readonly moveDuration = 90

    constructor() {
        super(600, 80, new EnemyRendererCore(), { margin: 90, remainingCharge: 1200 })
        this.p = vec(0, -g.height)
        this.moveTo(vec(0, -g.height / 3), this.moveDuration)
    }

    *G() {
        this.p = this.curve((this.frame - this.moveDuration) / 600).plus(vec(0, -g.height / 3))
        yield
    }

    *H() {
        yield* this.waitCharge()

        remodel(this)
            .p(this.p.clone())
            .radian((T * 3) / 16)
            .beam(this, 0)
            .g(function* (me) {
                yield* Remodel.ease(me, "length", g.height, 60, Ease.InOut)
                yield* Remodel.ease(me, "radian", (T * 3) / 16 + T / 8, 60, Ease.InOut)
                yield* Remodel.fadeout(me, 15)
            })
            .fire()

        yield* Array(240)
    }
}

/**
 * 回転シールド — ローズカーブ弾幕
 *
 * k=3 のローズ曲線 r = |cos(3θ)| に沿って弾速を割り当てることで、
 * 弾が広がるにつれ自然に3枚花びらの模様を描く。
 * 弾数を絞り（count=24）、隙間をはっきりさせてプレイヤーの
 * 通れる場所を明示する。花全体がゆっくり回転。
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

        const count = 240
        const baseAngle = T * (this.frame / 360) + (this.shieldIndex * T) / 4

        for (let i = 0; i < count; i++) {
            const theta = (i / count) * T + baseAngle
            // ローズ曲線 r = cos(3θ) の絶対値を弾速に変換
            // cos(3θ) > 0 の花びら部分だけ発射（< 0 なら省略）
            const roseR = Math.cos(5 * theta)
            if (roseR <= 0) continue

            const speed = roseR * 7 + 1 // 1〜8の範囲

            remodel()
                .appearance(Bullet.Appearance.Ball)
                .colorful(this.frame * 2 + this.shieldIndex * 60)
                .p(this.p.clone())
                .speed(speed)
                .radian(theta)
                .r(6)
                .g(function* (me) {
                    yield* Array(120)
                    yield* Remodel.fadeout(me, 15)
                })
                .fire()
        }

        remodel()
            .appearance(Bullet.Appearance.Ball)
            .colorful(this.frame * 2 + this.shieldIndex * 60)
            .p(this.p.clone())
            .speed(1)
            .ex(23)
            .r(6)
            .g(function* (me) {
                yield* Array(120)
                yield* Remodel.fadeout(me, 15)
            })
            .fire()

        yield* Array(120)
    }
}

/**
 * 戦術ドローン — 狙い矢印（単発・高速）
 *
 * シールドの花模様と視覚的に混ざらないよう、
 * 矢印(r=28)の単発狙い弾に限定。
 * 高速（speed=10）で通過が速いため画面に長居しない。
 * 16機がバラバラのタイミングで撃つことで
 * 弾の壁ではなく「散発する脅威」として機能する。
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
        remodel()
            .appearance(Bullet.Appearance.Arrow)
            .collision(Bullet.Collision.Arrow)
            .colorful(this.frame * 3 + this.droneIndex * 30)
            .r(28)
            .p(this.p.clone())
            .aim(g.player.p)
            .speed(10)
            .g((me) => Remodel.appear(me, 8))
            .fire()

        yield* Array(80)
    }
}
