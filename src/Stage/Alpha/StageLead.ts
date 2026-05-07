import { Bullet } from "../../Game/Bullet/Bullet"
import { Enemy } from "../../Game/Enemy/Enemy"
import { Remodel, remodel } from "../../Game/Bullet/Remodel"
import { Vec, vec } from "../../utils/Vec"
import { g, scorenize, T } from "../../global"
import { Stage } from "../Stage"
import { flash, shake } from "../../utils/shake"
import { Dom } from "../../Dom"

import { EnemyRendererMob } from "../../Game/Enemy/EnemyRendererMob"
import { EnemyRendererCore } from "../../Game/Enemy/EnemyRendererCore"
import { EnemyRendererBoss } from "../../Game/Enemy/EnemyRendererBoss"
import * as Curves from "../../utils/Functions/Curves"
import { Ease } from "../../utils/Functions/Ease"

// 重力の強さ定数（大きいほど強く引き寄せる）
const GRAVITY_STRENGTH = 10000

export default class extends Stage {
    protected *G(): Generator<void, void, unknown> {
        yield* this.wait(30)

        const core = new GravityCore()

        const wells = [
            new GravityWell(core, vec(-g.width * 0.3, g.height * 0.3)),
            new GravityWell(core, vec(g.width * 0.3, g.height * 0.3)),
            new GravityWell(core, vec(0, g.height * 0.6)),
            //
        ]

        g.enemies.push(core, ...wells)

        yield* this.waitDefeatEnemy()
        scorenize()
        flash(Dom.container)
        shake(Dom.container, 750, 8)
    }
}

/**
 * 重力コア
 * リサージュ曲線で移動しながら2種の弾幕を交互に撃つ。
 * 重力井戸によって弾道が曲がるため、
 * プレイヤー側は軌道の予測が難しくなる。
 */
class GravityCore extends Enemy {
    private readonly curve = Curves.lissajous(g.width * 0.35, g.height / 6, 3, 4)

    constructor() {
        super(800, 56, new EnemyRendererCore(), { remainingCharge: 600, margin: 60 })
        this.p = vec(0, -g.height)
        this.moveTo(vec(0, -g.height / 4), 60)
    }

    *G() {
        this.p = this.curve((this.frame - 60) / 600).plus(vec(0, -g.height / 4))
        yield
    }

    *H() {
        yield* this.waitCharge()

        let count = 0
        while (true) {
            if (count % 2 === 0) {
                yield* this.attackSpiral()
            } else {
                yield* this.attackAimed()
            }
            count++
        }
    }

    /**
     * 螺旋弾
     * 均等放射なので「発射直後は読みやすい」が、
     * 重力井戸に引き寄せられるうちに軌道が複雑になる。
     */
    private *attackSpiral() {
        for (let i = 0; i < 12; i++) {
            remodel()
                .appearance(Bullet.Appearance.Ball)
                .colorful(this.frame + i * 15)
                .p(this.p.clone())
                .speed(6)
                .radian(T * (this.frame / 240) + i * (T / 12))
                .r(6)
                .g((me) => Remodel.appear(me, 8))
                .fire()

            yield* Array(15)
        }
        yield* Array(60)
    }

    /**
     * 狙い矢印
     * 発射時は自機を狙っているが、重力に曲げられて
     * 意外な方向から来ることがある。
     */
    private *attackAimed() {
        for (let i = 0; i < 8; i++) {
            remodel()
                .color("white")
                .p(this.p.clone())
                .aim(g.player.p)
                .ex(53)
                //
                .fire()

            yield* Array(25)
        }
        yield* Array(60)
    }
}

/**
 * 重力井戸
 * 毎フレーム全弾（敵弾・友軍弾どちらも）に重力を適用する。
 * 重力は逆二乗則: strength / dist^2
 * 物理的に正確にするため (radian, speed) を速度ベクトルに
 * 変換してから加速度を加え、また戻す。
 *
 * プレイヤーの弾も曲がるので、重力井戸を考慮した
 * エイムが必要になる。井戸を破壊すると引力がなくなり
 * 弾道が変化する。
 */
class GravityWell extends Enemy {
    constructor(parent: Enemy, pos: Vec) {
        super(1200, 40, new EnemyRendererMob())
        this.setParent(parent, () => pos)
        this.isInvincible = true
    }

    *G() {
        g.bullets.forEach((b) => {
            // エフェクト弾は影響しない
            if (b.type === Bullet.Type.Effect) return

            const diff = this.p.minus(b.p)
            const dist = diff.magnitude()
            if (dist < this.r * 0.9) {
                b.life = 0
                return
            }

            // 逆二乗則で引力を計算
            const force = GRAVITY_STRENGTH / (dist * dist)

            // (radian, speed) → 速度ベクトル
            let vx = Math.cos(b.radian) * b.speed
            let vy = Math.sin(b.radian) * b.speed

            // 引力を速度に加算
            vx += (diff.x / dist) * force
            vy += (diff.y / dist) * force

            // 速度ベクトル → (radian, speed)
            b.speed = Math.min(Math.sqrt(vx * vx + vy * vy), 48)
            b.radian = Math.atan2(vy, vx)
        })

        yield
    }
}
