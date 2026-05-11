import { Bullet } from "../../Game/Bullet/Bullet"
import { Enemy } from "../../Game/Enemy/Enemy"
import { Remodel, remodel } from "../../Game/Bullet/Remodel"
import { Vec, vec } from "../../utils/Vec"
import { g, scorenize, T } from "../../global"
import { Stage } from "../Stage"
import { flash, shake } from "../../utils/shake"
import { Dom } from "../../Dom"

import { EnemyRendererCore } from "../../Game/Enemy/EnemyRendererCore"
import { EnemyRendererFunnel } from "../../Game/Enemy/EnemyRendererFunnel"
import { EnemyRendererMine } from "../../Game/Enemy/EnemyRendererMine"
import { EnemyRendererMob } from "../../Game/Enemy/EnemyRendererMob"
import * as Curves from "../../utils/Functions/Curves"
import { Ease } from "../../utils/Functions/Ease"

export default class extends Stage {
    protected *G(): Generator<void, void, unknown> {
        yield* this.wait(30)

        const alpha = new CommandUnit("Alpha", 1)
        const beta = new CommandUnit("Beta", -1)

        const units = [...Array.from({ length: 3 }, (_, i) => new Escort(alpha, i)), ...Array.from({ length: 3 }, (_, i) => new Escort(beta, i))]
        const units2 = [...Array.from({ length: 4 }, (_, i) => new Escort2(alpha, i)), ...Array.from({ length: 4 }, (_, i) => new Escort2(beta, i))]

        g.enemies.push(alpha, beta, ...units, ...units2)

        yield* this.waitDefeatEnemy()
        scorenize()
        flash(Dom.container)
        shake(Dom.container, 750, 8)
    }
}

/**
 * 指揮官機
 * 左右の双子が「鏡像弾幕」で連携する。
 *
 * 攻撃1 (交差壁): AlphaとBetaが互いの位置へ向かって
 *   大ボール(r=28)を7-wayで撃つ。2機の弾が画面中央で
 *   交差し、通り抜けにくいX字の壁を作る。
 *
 * 攻撃2 (鏡像収束): 自機を中心とした円上に静止弾を展開。
 *   AlphaとBetaで色が違うため、どちらの弾かを見分けながら
 *   逃げ場を判断する必要がある。
 */
class CommandUnit extends Enemy {
    private readonly curve = Curves.lissajous(g.width * 0.4, g.height / 5, 2, 3)
    private shotCount = 0

    constructor(
        public readonly id: string,
        public readonly side: number,
    ) {
        super(500, 56, new EnemyRendererCore(), { remainingCharge: 600 })
        this.p = vec(side * g.width, -g.height)
        this.moveTo(vec(side * g.width * 0.3, -g.height / 4), 60)
    }

    *G() {
        const basePos = this.curve((this.frame - 60) / 480)
        this.p = vec(basePos.x * this.side, basePos.y).plus(vec(this.side * g.width * 0.3, -g.height / 4))
        yield
    }

    *H() {
        yield* this.waitCharge()

        while (true) {
            if (this.shotCount % 2 === 0) {
                yield* this.attackCross()
            } else {
                yield* this.attackEncircle()
            }
            this.shotCount++
        }
    }

    /** 交差壁: 相手の位置へ向けて7-way発射。中央で交差する */
    private *attackCross() {
        // 相手（反対側）の方向へ向けて撃つ
        const targetX = -this.side * g.width * 0.3
        for (let i = 0; i < 5; i++) {
            remodel()
                .appearance(Bullet.Appearance.Ball)
                .colorful(this.side > 0 ? this.frame : this.frame + 180)
                .r(28)
                .p(this.p.clone())
                .radian(
                    vec(targetX, -g.height / 4)
                        .minus(this.p)
                        .arg(),
                )
                .nway(7, T / 22)
                .speed(7)
                .g((me) => Remodel.appear(me, 8))
                .fire()

            yield* Array(20)
        }
        yield* Array(80)
    }

    /** 鏡像収束: 自機を囲む円に静止弾を展開し収束 */
    private *attackEncircle() {
        const count = 14
        const radius = 200
        const playerP = g.player.p.clone()

        // AlphaとBetaで展開範囲を半分ずつ分担（上半円・下半円）
        const offset = this.side > 0 ? 0 : Math.PI

        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI + offset
            remodel()
                .appearance(Bullet.Appearance.Ball)
                .colorful(this.side > 0 ? this.frame : this.frame + 180)
                .p(playerP.plus(vec.arg(angle).scaled(radius)))
                .speed(0)
                .r(28)
                .g(function* (me) {
                    yield* Remodel.appear(me, 12)
                    yield* Array(70)
                    me.radian = g.player.p.minus(me.p).arg()
                    yield* Remodel.accel(me, 20, 12)
                })
                .fire()
        }

        yield* Array(280)
    }
}

/**
 * 護衛 (Escort)
 * 旋回しながら「遅延狙い弾」を軌跡上に置いていく。
 * 発射時は speed=0 で静止し、40f後に自機方向へ急加速。
 * 護衛が通った場所に時差爆弾が並ぶ形になり、
 * しばらく経ってから一斉に動き出す。
 */
class Escort extends Enemy {
    constructor(
        parent: CommandUnit,
        private index: number,
    ) {
        super(100, 24, new EnemyRendererMob(), { remainingCharge: 300 })
        this.setParent(parent, () => {
            const angle = (this.frame / 360) * T * parent.side + (this.index / 3) * T
            return vec.arg(angle).scaled(150)
        })
    }

    *G() {
        g.enemies.push(new TacticalMine(this.p.clone()))
        yield* Array(600)
    }
}

/**
 * 護衛2 (Escort2)
 * 31方向の螺旋ラインを2連射する。
 * 1射目と2射目で radian を T/62 だけずらすことで
 * 弾の「隙間」が埋まる模様になる。
 * delayByIndex で波状展開し、美しい螺旋を描く。
 */
class Escort2 extends Enemy {
    constructor(
        parent: CommandUnit,
        private index: number,
    ) {
        super(100, 32, new EnemyRendererMob(), { margin: 30 + index * 30 })
        this.setParent(parent, () => {
            const angle = -(this.frame / 360) * T * parent.side + (this.index / 4) * T
            return vec.arg(angle).scaled(200)
        })
    }

    *G() {
        // 1射目
        remodel()
            .appearance(Bullet.Appearance.Line)
            .collision(Bullet.Collision.Line)
            .color("rgba(180, 230, 255, 0.9)")
            .r(28)
            .p(this.p.clone())
            .speed(20)
            .ex(31)
            .delayByIndex()
            .g((me, i) => Remodel.reaccel(me, 15, 45 - i, 30, 16))
            .fire()

        yield* Array(15)

        // 2射目: T/62 ずらして隙間を埋める
        remodel()
            .appearance(Bullet.Appearance.Line)
            .collision(Bullet.Collision.Line)
            .color("rgba(255, 200, 120, 0.9)")
            .r(28)
            .p(this.p.clone())
            .speed(20)
            .ex(31)
            .forEach((me, i) => {
                me.radian += T / 62
            })
            .delayByIndex()
            .g((me, i) => Remodel.reaccel(me, 15, 45 - i, 30, 16))
            .fire()

        yield* Array(240)
    }
}

/**
 * 戦術機雷
 * 爆発時: 7枚ローズカーブ(k=7)の弾幕を展開。
 * 幾何学的に美しく、かつ花弁の隙間がはっきりしているので
 * 「どこに逃げるか」が見えやすい。
 * ただし機雷は少し下に流れて設置されるため、
 * 画面下部で突然爆発することがある。
 */
class TacticalMine extends Enemy {
    constructor(pos: Vec) {
        super(20, 32, new EnemyRendererMine(), { margin: 0 })
        this.p = pos

        this.mine(400, () => this.explosion())
    }

    *G() {
        this.p.y += 4
        yield
    }

    private *explosion() {
        const count = 280
        const baseAngle = this.frame * 0.1

        for (let i = 0; i < count; i++) {
            const theta = (i / count) * T + baseAngle
            const roseR = Math.cos(7 * theta)
            if (roseR <= 0) continue

            remodel()
                .appearance(Bullet.Appearance.Ball)
                .colorful(this.frame + i * 10)
                .r(6)
                .p(this.p.clone())
                .speed(roseR * 7 + 1)
                .radian(theta)
                .g((me) => Remodel.appear(me, 8))
                .fire()

            if (i % 10 === 0) yield
        }
    }
}
