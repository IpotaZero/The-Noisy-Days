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

        for (let i = SEGMENT_COUNT - 1; i >= 0; i--) {
            segments[i].isInvincible = false
            while (segments[i].life > 0) yield
        }

        head.isInvincible = false

        yield* this.waitDefeatEnemy()
        scorenize()
        flash(Dom.container)
        shake(Dom.container, 750, 8)
    }
}

class SnakeHead extends Enemy {
    // H() から参照するためにパターン状態を公開
    isChasing = false

    constructor() {
        super(400, 80, new EnemyRendererBoss(), { margin: 120 })
        this.isInvincible = true
        this.p = vec(0, -g.height * 2)
        this.moveTo(vec(0, 0), 120)
    }

    *G() {
        const patterns = [() => this.patternSweep(), () => this.patternFigure8(), () => this.patternSpiral(), () => this.patternChase()]
        let i = 0
        while (true) {
            yield* patterns[i % patterns.length]()
            i++
        }
    }

    *H() {
        yield
        remodel().colorful(this.frame).r(64).p(this.p.clone()).delete(1).fire()

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
        yield* this.moveTo(vec(g.width * 0.42, y), 50, Ease.InOut)
        yield* this.moveTo(vec(g.width * 0.42, y + g.height * 0.2), 30, Ease.InOut)
        yield* this.moveTo(vec(-g.width * 0.42, y - g.height * 0.2), 60, Ease.InOut)
        yield* this.moveTo(vec(-g.width * 0.42, y), 100, Ease.InOut)
        yield* this.moveTo(vec(0, y), 50, Ease.InOut)
    }

    private *patternFigure8() {
        this.isChasing = false
        const cx = 0
        const step = 20
        for (let i = 0; i <= step; i++) {
            const t = (i / step) * T
            yield* this.moveTo(vec(cx + Math.sin(t) * g.width * 0.38, -g.height / 5 + Math.sin(2 * t) * g.height * 0.8), 12)
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
        for (let i = 0; i < 8; i++) {
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
        yield* this.moveTo(clamped, 80, Ease.Out)
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
        const hp = Math.round(100 * ratio + 100)
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
