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
import { Ease } from "../../utils/Functions/Ease"
import { isSmartPhone } from "../../utils/Functions/isSmartPhone"
import { EnemyRendererFunnel } from "../../Game/Enemy/EnemyRendererFunnel"

export default class extends Stage {
    protected *G(): Generator<void, void, unknown> {
        yield* this.wait(30)

        const core = new ResonanceCore()
        // シールド: 各機の充電時間をずらして段階的に攻撃開始
        const shields = [0, 1, 2, 3].map((i) => new ResonanceShield(core, i))
        // ドローン: 充電あり（最初は静かに公転するだけ）
        const drones = shields.flatMap((s) => [0, 1, 2, 3].map((j) => new ResonanceDrone(s, j)))
        // リングユニット: 充電あり
        const rings = Array.from({ length: 8 }, (_, i) => new ResonanceRing(core, i))
        // 追加: 外周スウィーパー（画面外周を往復しながら薙ぎ払う）
        const sweepers = [0].map((i) => new Sweeper(core, i))
        // 追加: コアを護衛する重装甲ガード（×3）
        const guards = [0, 1, 2].map((i) => new HeavyGuard(core, i))

        g.enemies.push(core, ...shields, ...drones, ...rings, ...sweepers, ...guards)

        yield* this.waitDefeatEnemy()
        scorenize()
        flash(Dom.container)
        shake(Dom.container, 750, 8)
    }
}

/**
 * コア
 * 充電600f後に攻撃開始。
 *
 * 攻撃1: 32方向環状弾
 * 攻撃2: 予測照準ビーム
 *   自機の移動速度ベクトルを毎フレーム計測し、
 *   「今の方向に動き続けたら x フレーム後にいる位置」を
 *   予測して照準する。止まれば通常照準になる。
 */
class ResonanceCore extends Enemy {
    private readonly curve = Curves.lissajous(g.width * 0.2, g.height / 10, 3, 2)
    private prevPlayerP = vec(0, 0)

    constructor() {
        super(2500, 64, new EnemyRendererCore(), { remainingCharge: 600, margin: 120 })
        this.p = vec(0, -g.height)
        this.moveTo(vec(0, -g.height / 4), 120)
    }

    *G() {
        this.p = this.curve((this.frame - 120) / 600).plus(vec(0, -g.height / 4))
        yield
    }

    *H() {
        yield* this.waitCharge()

        let count = 0
        while (true) {
            if (count % 3 !== 2) {
                yield* this.attackRing()
            } else {
                yield* this.attackPredictiveBeam()
            }
            count++
        }
    }

    private *attackRing() {
        remodel()
            .colorful(this.frame / 2)
            .p(this.p.clone())
            .speed(2)
            .nway(32, T / 32)
            .fire()

        yield* Array(100)
    }

    private *attackPredictiveBeam() {
        // 予測照準: 自機の速度ベクトルから先読み位置を計算
        const velocity = g.player.p.minus(this.prevPlayerP)
        const leadFrames = 55 // 何フレーム先を狙うか
        const predictedP = g.player.p.plus(velocity.scaled(leadFrames))
        const beamAngle = predictedP.minus(this.p).arg()

        remodel()
            .p(this.p.clone())
            .radian(beamAngle)
            .beam(this, 0)
            .g(function* (me) {
                yield* Remodel.ease(me, "length", g.height, 60, Ease.Out)
                yield* Array(30)
                yield* Remodel.fadeout(me, 15)
            })
            .fire()

        yield* Array(100)
    }

    // tick のたびに前フレームのプレイヤー位置を記録
    tick() {
        this.prevPlayerP = g.player.p.clone()
        super.tick()
    }
}

/**
 * シールド（×4）
 * 充電時間をずらして段階的に攻撃開始。
 * 充電中は公転するだけなので、最初はシールドの脅威がない。
 */
class ResonanceShield extends Enemy {
    constructor(
        core: Enemy,
        private readonly index: number,
    ) {
        // 充電 300 / 450 / 600 / 750f でずらす
        super(600, 40, new EnemyRendererMob(), { remainingCharge: 300 + index * 150 })
        this.setParent(core, () => vec.arg((this.frame / 200) * T + (this.index * T) / 4).scaled(240))
    }

    *G() {
        yield
    }

    *H() {
        yield* this.waitCharge()

        const baseRad = (this.frame / 200) * T + (this.index * T) / 4
        remodel()
            .colorful(this.frame + 20)
            .p(this.p.clone())
            .radian(baseRad)
            .nway(2, T / 4)
            .speed(5)
            .fire()

        yield* Array(45)
    }
}

/**
 * ドローン（×16）
 * 充電480f後に攻撃開始。margin のずれで一斉に動き出さない。
 */
class ResonanceDrone extends Enemy {
    constructor(
        parent: Enemy,
        private readonly index: number,
    ) {
        super(150, 24, new EnemyRendererMob(), { remainingCharge: 900, margin: index * 20 })
        this.setParent(parent, () => vec.arg((-this.frame / 60) * T + (this.index * T) / 4).scaled(80))
    }

    *G() {
        yield
    }

    *H() {
        yield* this.waitCharge()

        remodel()
            .appearance(Bullet.Appearance.Arrow)
            .collision(Bullet.Collision.Arrow)
            .color("white")
            .r(28)
            .p(this.p.clone())
            .g(function* (me) {
                yield* Remodel.stop(me, 30)
                yield* Array(60)

                if (isSmartPhone) {
                    me.radian = g.player.p.minus(me.p).arg()
                    yield* Array(15)
                } else {
                    yield* Remodel.ease(me, "radian", g.player.p.minus(me.p).arg() + T, 15, Ease.Out)
                }

                yield* Remodel.accel(me, 20, 16)
                yield* Array(120)
                me.life = 0
            })
            .fire()

        yield* Array(120)
    }
}

/**
 * リングユニット（×8）
 * 充電360f後に発射開始。最初はコア近傍を静かに公転。
 */
class ResonanceRing extends Enemy {
    constructor(
        core: Enemy,
        private readonly index: number,
    ) {
        super(100, 18, new EnemyRendererMob(), { remainingCharge: 900, margin: index * 15 })
        this.setParent(core, () => vec.arg((this.frame / 120) * T + (this.index * T) / 8).scaled(130))
    }

    *G() {
        yield
    }

    *H() {
        yield* this.waitCharge()

        const rad = (this.frame / 120) * T + (this.index * T) / 8
        remodel()
            .appearance(Bullet.Appearance.Ball)
            .r(6)
            .p(this.p.clone())
            .radian(rad)
            .speed(4)
            .color("rgba(100, 200, 255)")
            .ex(31)
            .g(function* (me) {
                yield* Array(20)
                yield* Remodel.fadeout(me, 10)
            })
            .fire()

        yield* Array(15) // 元の8fから緩和
    }
}

/**
 * スウィーパー（×2）
 * 画面の左右端から端へゆっくり往復しながら
 * 真下へ7方向の大ボールを掃射する。
 * 2機が逆位相で動くため常に画面のどこかを薙ぎ払っている。
 */
class Sweeper extends Enemy {
    constructor(
        core: Enemy,
        private readonly index: number,
    ) {
        super(350, 24, new EnemyRendererFunnel(), { remainingCharge: 100, margin: 120 + 20 * index })
        this.p = vec(0, -g.height)
        this.moveTo(vec(-g.width * 0.48, g.height * 0.1), 120)
    }

    *G() {
        yield* this.moveTo(vec(g.width * 0.48, g.height * 0.1), 300, Ease.InOut)
        yield* this.moveTo(vec(-g.width * 0.48, g.height * 0.1), 300, Ease.InOut)
    }

    *H() {
        yield* this.waitCharge()

        remodel()
            .colorful(this.frame + this.index * 90)
            .r(28)
            .p(this.p.clone())
            .radian(T / 4)
            .speed(7)
            .ex(13)
            .g((me) => Remodel.appear(me, 8))
            .g(function* (me) {
                let i = 0
                while (1) {
                    me.r = Math.floor((Math.sin(i / 9) + 1) * 22 + 6)
                    i++
                    yield
                }
            })
            .fire()

        yield* Array(30)
    }
}

/**
 * 重装甲ガード（×3）
 * コアを半径170で公転し、コアへの接近を阻む。
 * 充電720f後に11方向の脈動弾を撃つ。
 * HP・r が大きく、撃破に集中砲火が必要。
 */
class HeavyGuard extends Enemy {
    constructor(
        core: Enemy,
        private readonly index: number,
    ) {
        super(450, 50, new EnemyRendererMob(), { remainingCharge: 720, margin: index * 60 })
        this.setParent(core, () => vec.arg((this.frame / 400) * T + (this.index * T) / 3).scaled(170))
    }

    *G() {
        yield
    }

    *H() {
        yield* this.waitCharge()

        remodel()
            .appearance(Bullet.Appearance.Ball)
            .colorful(this.frame + this.index * 60)
            .r(6)
            .p(this.p.clone())
            .speed(6)
            .radian(T * (this.frame / 300))
            .ex(11)
            .g(function* (me) {
                yield* Remodel.appear(me, 10)
                yield* Remodel.stop(me, 15)
                yield* Remodel.accel(me, 15, 9)
            })
            .fire()

        yield* Array(60)
    }
}
