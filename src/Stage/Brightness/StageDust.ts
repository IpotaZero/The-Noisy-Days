import { Bullet } from "../../Game/Bullet/Bullet"
import { Enemy } from "../../Game/Enemy/Enemy"
import { Remodel, remodel } from "../../Game/Bullet/Remodel"
import { Vec, vec } from "../../utils/Vec"
import { g, scorenize, T } from "../../global"
import { Stage } from "../Stage"
import { flash, shake } from "../../utils/shake"
import { Dom } from "../../Dom"

import * as Curves from "../../utils/Functions/Curves"
import { EnemyRendererMob } from "../../Game/Enemy/EnemyRendererMob"
import { EnemyRendererCore } from "../../Game/Enemy/EnemyRendererCore"
import { Ease } from "../../utils/Functions/Ease"
import { EnemyRendererBoss } from "../../Game/Enemy/EnemyRendererBoss"

const SEGMENT_COUNT = 6
const SEGMENT_LENGTH = 60
const FOLLOW_STIFFNESS = 0.25

export default class extends Stage {
    protected *G(): Generator<void, void, unknown> {
        yield* this.wait(30)

        const head = new SnakeHead()

        const segments: SnakeSegment[] = []
        for (let i = 0; i < SEGMENT_COUNT; i++) {
            const prev = i === 0 ? head : segments[i - 1]
            const isTail = i === SEGMENT_COUNT - 1
            segments.push(new SnakeSegment(prev, i, isTail))
        }

        g.enemies.push(head, ...segments)

        yield* this.text("「あなた、合成人でしょう。」", { name: "サカイ" })
        yield* this.text("「誰だアンタは。」", { name: "シオン" })
        yield* this.text("「トウキョウ警察機動隊アルファのサカイです。」", { name: "サカイ" })
        yield* this.text("「……シオン・シマ。」", { name: "シオン" })
        yield* this.text("「それで、あなたしかも、子供でしょう。」", { name: "サカイ" })
        yield* this.text("「ハタチを大人とするなら、そう。」", { name: "シオン" })
        yield* this.text("「可哀相に。」", { name: "サカイ" })
        yield* this.text("「……。」", { name: "シオン" })
        yield* this.text("「SILOの中に居れば、傷付く事なんて無かったのに。」", { name: "サカイ" })
        yield* this.text("「その代わりに絶滅しろと?」", { name: "シオン" })
        yield* this.text("「そんなこと言ってないでしょう!? あなた、TAMAMUSHIの洗脳を受けてるのね。」", {
            name: "サカイ",
        })
        yield* this.text("「可哀相に!」", { name: "サカイ" })
        yield* this.text("「本当に、100%の善意で、そんなことを。」", { name: "シオン" })
        yield* this.text("「そうよ! 全て、あなたたちの為にやってるんじゃない!」", { name: "サカイ" })
        // 本当に分かり合えない人がいるという絶望
        yield* this.text("「……ッ!!」", { name: "シオン" })
        yield* this.text("「もう、やるしかないのよっ!」", { name: "サカイ" })

        head.start()

        // 尻尾を倒す → 分離体が発生、次のセグメントへ
        const tail = segments[SEGMENT_COUNT - 1]
        tail.isInvincible = false
        while (tail.life > 0) yield

        // 尻尾が倒れた場所から分離体が出現
        const detached = new DetachedTail(head, tail.p.clone())
        g.enemies.push(detached)

        // 残りのセグメントを尻尾側から順に無敵解除
        for (let i = SEGMENT_COUNT - 2; i >= 0; i--) {
            segments[i].isInvincible = false
            while (segments[i].life > 0) yield

            // 尻尾が倒れた場所から分離体が出現
            const detached = new DetachedTail(head, segments[i].p.clone())
            g.enemies.push(detached)
        }

        head.isInvincible = false

        yield* this.waitDefeatEnemy()
        scorenize()
        flash(Dom.container)
        shake(Dom.container, 750, 8)

        this.stopSkip()
        yield* this.wait(30)
        yield* this.text("「……はは、はははっ!」", { name: "シオン" })
        yield* this.text("「善意が、傍から見ればこんなにも滑稽だなんて!」", { name: "シオン" })
    }
}

class SnakeHead extends Enemy {
    // H() から参照するためにパターン状態を公開
    isChasing = false

    isStarted = false

    constructor() {
        super(300, 80, new EnemyRendererBoss(), { margin: 120 })
        this.isInvincible = true
        this.p = vec(0, -g.height * 2)
        this.moveTo(vec(0, 0), 120)
    }

    start() {
        this.isStarted = true
    }

    *G() {
        while (!this.isStarted) yield

        const patterns = [() => this.patternSweep(), () => this.patternFigure8(), () => this.patternSpiral(), () => this.patternChase()]
        let i = 0
        while (true) {
            yield* patterns[i % patterns.length]()
            i++
        }
    }

    *H() {
        while (!this.isStarted) yield

        yield
        remodel().colorful(this.frame).r(64).p(this.p.clone()).delete(1).fire()

        if (!this.isChasing)
            remodel()
                .colorful(this.frame * 2)
                .appearance(Bullet.Appearance.Ball)
                .r(6)
                .radian(this.frame ** 2)
                .p(this.p.clone())
                .fire()
    }

    private *patternSweep() {
        this.isChasing = false
        const y = 0
        yield* this.moveTo(vec(g.width * 0.42, y), 60, Ease.InOut)
        yield* this.moveTo(vec(g.width * 0.42, y + g.height * 0.2), 30, Ease.InOut)
        yield* this.moveTo(vec(-g.width * 0.42, y - g.height * 0.2), 60, Ease.InOut)
        yield* this.moveTo(vec(-g.width * 0.42, y), 120, Ease.InOut)
        yield* this.moveTo(vec(0, y), 60, Ease.InOut)
    }

    private *patternFigure8() {
        this.isChasing = false
        const cx = 0
        const step = 20
        for (let i = 0; i <= step; i++) {
            const t = (i / step) * T
            yield* this.moveTo(vec(cx + Math.sin(t) * g.width * 0.38, -g.height / 5 + Math.sin(2 * t) * g.height * 0.8), 15)
        }
    }

    private *patternSpiral() {
        this.isChasing = false
        const cx = 0
        const cy = 0
        const steps = 10
        for (let i = 0; i <= steps; i++) {
            const t = (i / steps) * T * 3
            const r = (1 - i / steps) * g.width * 0.8
            yield* this.moveTo(vec(cx + Math.cos(t) * r, cy + Math.sin(t) * r * 0.6), 30)
        }
        for (let i = 0; i <= steps; i++) {
            const t = (i / steps) * T * 2
            const r = (i / steps) * g.height * 0.8
            yield* this.moveTo(vec(cx + Math.cos(t) * r, cy + Math.sin(t) * r * 0.5), 30)
        }
    }

    private *patternChase() {
        this.isChasing = true
        for (let i = 0; i < 4; i++) {
            const target = this.p.plus(g.player.p.minus(this.p).scaled(0.95))
            yield* this.moveTo(target, 30)

            const dir = g.player.p.minus(this.p).arg()

            remodel()
                .p(this.p.clone())
                .beam(this, 0)
                .duplicate(2, (me, i) => {
                    me.radian = dir + ((2 * i - 1) * T) / 12
                    return me
                })
                .g(function* (me) {
                    yield* Remodel.ease(me, "length", 320, 15, Ease.Out)
                    yield* Remodel.ease(me, "radian", dir, 5, Ease.Out)
                    yield* Remodel.fadeout(me, 15)
                })
                .fire()

            yield* Array(35)
        }
        const away = this.p.minus(g.player.p)
        const target = this.p.plus(away.scaled((1.8 / away.magnitude()) * g.width * 0.4))
        const clamped = vec(Math.max(-g.width * 0.42, Math.min(g.width * 0.42, target.x)), Math.max(-g.height * 0.45, Math.min(0, target.y)))
        this.isChasing = false
        yield* this.moveTo(clamped, 90, Ease.Out)
        yield* Array(30)
    }
}

class SnakeSegment extends Enemy {
    private prevP = vec(0, 0)

    constructor(
        private readonly prev: Enemy,
        private readonly index: number,
        private readonly isTail: boolean,
    ) {
        const ratio = 1 - index / SEGMENT_COUNT
        const hp = Math.round(30 * ratio + 100)
        const r = Math.round(18 * ratio + 32)
        super(hp, r, new EnemyRendererCore())
        this.isInvincible = true
        this.p = vec(0, -g.height * 2)
        this.prevP = this.p.clone()
    }

    *G() {
        const diff = this.prev.p.minus(this.p)
        const dist = diff.magnitude()
        if (dist > SEGMENT_LENGTH) {
            const move = diff.scaled(((dist - SEGMENT_LENGTH) / dist) * FOLLOW_STIFFNESS)
            this.p = this.p.plus(move)
        }
        yield
    }

    /**
     * 胴体の攻撃
     * - 移動速度を毎フレーム計測し、速いほど強い攻撃を出す
     * - 移動方向に垂直な左右へ大ボール(r=28)を発射
     *   → 蛇の胴が横薙ぎに迫るような直接攻撃感
     * - 尻尾は急加速時に扇形弾を追加（方向転換が危険になる）
     */
    *H() {
        const velocity = this.p.minus(this.prevP)
        const speed = velocity.magnitude()
        this.prevP = this.p.clone()

        // 移動速度が一定以上のときだけ攻撃（止まっているときは安全）
        if (speed > 2) {
            // 左右に大ボールを発射（蛇の胴が通る危険ゾーンを作る）
            remodel()
                .colorful(this.frame * 2 + this.index * 30)
                .r(28)
                .p(this.p.clone())
                .speed(0)
                .g(function* (me) {
                    yield* Remodel.appear(me, 15)
                    yield* Array(15)
                    yield* Remodel.fadeout(me, 15)
                })
                .fire()

            yield* Array(30)
        } else {
            yield
        }
    }
}

/**
 * 分離した尻尾
 *
 * 尻尾が撃破された座標から出現し、蛇の頭を中心に公転する。
 * 頭が動くたびに公転中心も動くため、予測しにくい軌道になる。
 * プレイヤーが頭を狙おうとするたびに割り込んでくる番犬的な役割。
 *
 * G(): 頭の周囲を楕円公転。公転半径は時間で変動し、
 *      頭に引き寄せられたり離れたりを繰り返す
 * H(): 2種類の攻撃を交互に使う
 *      - 追尾フェーズ: 自機へ急接近 → すれ違いざまに扇形弾
 *      - 牽制フェーズ: 大ボール(r=28)を11方向放射
 */
class DetachedTail extends Enemy {
    private attackPhase = 0

    constructor(
        private readonly head: SnakeHead,
        spawnP: Vec,
    ) {
        super(400, 28, new EnemyRendererMob(), { margin: 30 })
        this.p = spawnP
        this.moveTo(head.p, 30)
        this.isInvincible = true

        this.g.push(
            function* (this: Enemy) {
                for (let i = 1; i < 31; i++) {
                    this.r = (i / 30) * 28
                    yield
                }
            }.bind(this)(),
        )

        this.setParent(head, () => {
            // 公転半径を150〜280の間で波打たせる
            const radius = 215 + Math.sin(this.frame / 90) * 65
            const angle = (this.frame / 150) * T
            return vec(Math.cos(angle) * radius, Math.sin(angle) * radius * 0.7)
        })
    }

    *G() {
        if (this.attackPhase % 2 === 0) {
            yield* this.attackDash()
        } else {
            yield* this.attackSpread()
        }
        this.attackPhase++
    }

    private *attackDash() {
        remodel(this)
            .appearance(Bullet.Appearance.Ball)
            .color("white")
            .p(this.p.clone())
            .speed(0)
            .r(28)
            .g(function* (this: DetachedTail, me: Bullet) {
                yield* Array(60)
                yield* Remodel.ease(me, "r", 0, 30, Ease.In)
                yield* this.hatch(me.p.clone())
                me.life = 0
            } as any)
            .fire()

        yield* Array(120)
    }

    private *hatch(p: Vec) {
        const target = g.player.p.clone()

        for (let i = 0; i < 4; i++) {
            remodel()
                .appearance(Bullet.Appearance.Arrow)
                .collision(Bullet.Collision.Arrow)
                .color("white")
                .p(p)
                .aim(target)
                .speed(0)
                .r(28) // Arrow制限: 28
                .ex(5)
                .g(function* (me) {
                    const baseRadian = me.radian
                    const shift = 0
                    for (let i = 0; i < 200; i++) {
                        me.radian = Math.floor((baseRadian + Math.sin(i / 10 + shift) * 0.4) * 4) / 4
                        yield
                    }
                })
                .g(function* (me) {
                    while (1) {
                        me.p = me.p.plus(vec.arg(me.radian).scaled(12))
                        yield* Array(2)
                    }
                })
                .fire()

            yield* Array(4)
        }
    }

    /**
     * 11方向大ボール放射（牽制）
     * 公転しながらゆっくり放射するので、頭への接近ルートを塞ぐ
     */
    private *attackSpread() {
        remodel()
            .colorful(this.frame + 120)
            .r(28)
            .p(this.p.clone())
            .speed(6)
            .radian(T * (this.frame / 240))
            .ex(11)
            .g(function* (me) {
                yield* Remodel.appear(me, 10)
                yield* Remodel.stop(me, 20)
                yield* Remodel.accel(me, 20, 9)
            })
            .fire()

        yield* Array(60)
    }
}
