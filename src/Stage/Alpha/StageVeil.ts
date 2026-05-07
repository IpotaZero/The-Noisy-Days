import { Bullet } from "../../Game/Bullet/Bullet"
import { Enemy } from "../../Game/Enemy/Enemy"
import { Remodel, remodel } from "../../Game/Bullet/Remodel"
import { Vec, vec } from "../../utils/Vec"
import { g, scorenize, T } from "../../global"
import { Stage } from "../Stage"
import { flash, shake } from "../../utils/shake"
import { Dom } from "../../Dom"

import { EnemyRendererFunnel } from "../../Game/Enemy/EnemyRendererFunnel"
import { EnemyRendererMob } from "../../Game/Enemy/EnemyRendererMob"
import { EnemyRendererCore } from "../../Game/Enemy/EnemyRendererCore"
import * as Curves from "../../utils/Functions/Curves"
import { Ease } from "../../utils/Functions/Ease"

// 遊撃機の数
const FUNNEL_COUNT = 64

export default class extends Stage {
    protected *G(): Generator<void, void, unknown> {
        yield* this.wait(30)

        const core = new Core()
        const funnels = Array.from({ length: FUNNEL_COUNT }, (_, i) => new TrailFunnel(core, i))

        g.enemies.push(core, ...funnels)

        yield* this.waitDefeatEnemy()
        scorenize()
        flash(Dom.container)
        shake(Dom.container, 750, 8)
    }
}

/**
 * コア
 * 移動: リサージュ曲線でゆっくり泳ぐ
 * 攻撃: 2種を交互に
 *   - 追尾反転弾: 自機方向へ飛んでから止まり、
 *     自機の現在位置へ再照準して急加速。
 *     「止まった弾」が突然動き出す。
 *   - 包囲遅延弾: 自機を囲む円上に静止弾を展開し、
 *     外側から内側へ順番に時間差で収束する。
 *     弾の波が内側に向かって迫る。
 */
class Core extends Enemy {
    private readonly curve = Curves.lissajous(g.width * 0.45, g.height / 5, 5, 6)

    constructor() {
        super(300, 60, new EnemyRendererCore(), { remainingCharge: 900, margin: 60 })
        this.p = vec(0, -g.height)
        this.moveTo(vec(0, -g.height / 4), 60)
    }

    *G() {
        this.p = this.curve((this.frame - 60) / 480).plus(vec(0, -g.height / 4))
        yield
    }

    *H() {
        yield* this.waitCharge()
        yield* this.attackHomingReverse()
    }

    /**
     * 追尾反転弾
     * 7発を20fおきに発射。各弾が自機方向へ飛んで止まり、
     * 停止中に再照準して急加速する。
     * 止まったタイミングと再加速のタイミングがずれるので
     * 複数弾が異なるタイミングで動き出す。
     */
    private *attackHomingReverse() {
        for (let i = 0; i < 7; i++) {
            remodel()
                .appearance(Bullet.Appearance.Arrow)
                .collision(Bullet.Collision.Arrow)
                .colorful(this.frame + i * 20)
                .p(this.p.clone())
                .aim(g.player.p)
                .r(28)
                .speed(5)
                .nway(7, T / 24)
                .g(function* (me) {
                    yield* Array(15)
                    yield* Remodel.ease(me, "radian", g.player.p.minus(me.p).arg(), 20, Ease.InOut)
                    yield* Remodel.accel(me, 15, 32)
                })
                .fire()

            yield* Array(20)
        }
        yield* Array(80)
    }
}

/**
 * 遊撃機（×8）
 *
 * 充電中: コアの周囲を公転
 * 充電後: 画面内を壁反射しながら自由飛行
 *
 * 移動中、毎フレーム自分の座標に超短命（trailFrames）の
 * エフェクト弾を残すことで「軌跡」を描く。
 * 軌跡弾は当たり判定あり(Enemy弾)で、
 * 遊撃機が通った場所が一時的に危険ゾーンになる。
 *
 * 各機の充電時間が異なるため、バラバラに飛び始め
 * 軌跡の密度が均等にならない。
 */
class TrailFunnel extends Enemy {
    // 軌跡が残るフレーム数（小さいほど短命）
    private readonly trailFrames: number
    private readonly speed: Vec

    constructor(
        private readonly core: Enemy,
        private readonly index: number,
    ) {
        // 充電時間を 240〜600f の範囲で各機にばらつかせる
        const charge = 240 + index * 50
        super(20, 20, new EnemyRendererFunnel(), { remainingCharge: charge })

        // 各機の軌跡の長さも少し変える（8〜20f）
        this.trailFrames = 180 + Math.floor(Math.sin(index) * 90)

        // 充電後の速度ベクトル（各機で向きをずらす）
        const baseAngle = (index / FUNNEL_COUNT) * T
        const spd = 3.5 + (index % 3) * 0.8
        this.speed = vec(Math.cos(baseAngle) * spd, Math.sin(baseAngle) * spd)

        this.p = core.p.plus(vec.arg(baseAngle).scaled(150))
        this.g.push(this.movement())
    }

    // 移動と軌跡生成を担うジェネレータ
    private *movement() {
        // 充電中: コアを公転
        while (this.chargeRemaining > 0) {
            const angle = (this.frame / 300) * T + (this.index / FUNNEL_COUNT) * T
            this.p = this.core.p.plus(vec(Math.sin(angle * 2) * 3, Math.cos(angle * 5)).scaled(150))
            yield
        }

        // 充電後: 壁反射しながら飛行し、軌跡を残す
        this.funnel(this.speed)

        while (true) {
            this.leaveTrail()
            yield* Array(15)
        }
    }

    private leaveTrail() {
        const frames = this.trailFrames
        remodel()
            .appearance(Bullet.Appearance.Ball)
            .colorful(this.frame + this.index * 30)
            .p(this.p.clone())
            .speed(0)
            .r(6)
            .g(function* (me) {
                yield* Array(frames)
                // フェードアウトしながら消える
                yield* Remodel.fadeout(me, 2)
            })
            .fire()
    }
}
