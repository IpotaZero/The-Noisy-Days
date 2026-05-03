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

const SEGMENT_COUNT = 6
// セグメント間の目標距離
const SEGMENT_LENGTH = 60
// 追従の硬さ（0〜1、大きいほどピタッとついてくる）
const FOLLOW_STIFFNESS = 0.25

export default class extends Stage {
    protected *G(): Generator<void, void, unknown> {
        yield* this.wait(30)

        const head = new SnakeHead()

        // prev: 自分の直前の敵（index=0 は頭、index=i は segments[i-1]）
        const segments: SnakeSegment[] = []
        for (let i = 0; i < SEGMENT_COUNT; i++) {
            const prev = i === 0 ? head : segments[i - 1]
            segments.push(new SnakeSegment(prev, i))
        }

        g.enemies.push(head, ...segments)

        // 尻尾から順に無敵解除
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

/**
 * 蛇の頭
 *
 * G() をジェネレータで制御し、一連の挙動が終わると次のパターンへ遷移する。
 * moveTo() を組み合わせることで、曲線を描く動きを表現する。
 */
class SnakeHead extends Enemy {
    constructor() {
        super(800, 42, new EnemyRendererCore(), { margin: 120 })
        this.isInvincible = true
        this.p = vec(0, -g.height * 2)
        this.moveTo(vec(0, 0), 120)
    }

    *G() {
        // パターンをループ
        const patterns = [() => this.patternSweep(), () => this.patternFigure8(), () => this.patternSpiral(), () => this.patternChase()]
        let i = 0
        while (true) {
            yield* patterns[i % patterns.length]()
            i++
        }
    }

    /** 左右に大きくゆっくり往復する */
    private *patternSweep() {
        const y = 0
        yield* this.moveTo(vec(g.width * 0.42, y), 50, Ease.InOut)
        yield* this.moveTo(vec(g.width * 0.42, y + g.height * 0.2), 30, Ease.InOut)
        yield* this.moveTo(vec(-g.width * 0.42, y - g.height * 0.2), 60, Ease.InOut)
        yield* this.moveTo(vec(-g.width * 0.42, y), 100, Ease.InOut)
        yield* this.moveTo(vec(0, y), 50, Ease.InOut)
    }

    /** 縦長の8の字を描く */
    private *patternFigure8() {
        const cx = 0
        const step = 20
        for (let i = 0; i <= step; i++) {
            const t = (i / step) * T
            // リサージュ 1:2 で8の字
            yield* this.moveTo(vec(cx + Math.sin(t) * g.width * 0.38, -g.height / 5 + Math.sin(2 * t) * g.height * 0.8), 12)
        }
    }

    /** 画面全体を渦巻きながら収束する */
    private *patternSpiral() {
        const cx = 0
        const cy = 0
        const steps = 10
        for (let i = 0; i <= steps; i++) {
            const t = (i / steps) * T * 3
            const r = (1 - i / steps) * g.width * 0.8
            yield* this.moveTo(vec(cx + Math.cos(t) * r, cy + Math.sin(t) * r * 0.6), 30)
        }
        // 中心から広がり直す
        for (let i = 0; i <= steps; i++) {
            const t = (i / steps) * T * 2
            const r = (i / steps) * g.height * 0.8
            yield* this.moveTo(vec(cx + Math.cos(t) * r, cy + Math.sin(t) * r * 0.5), 30)
        }
    }

    /** 自機を追いかけてから勢いよく逸れる */
    private *patternChase() {
        for (let i = 0; i < 4; i++) {
            yield* this.moveTo(g.player.p.clone(), 60)
            yield* Array(10)
        }

        // 自機と逆方向へ勢いよく逸れる
        const away = this.p.minus(g.player.p)
        const target = this.p.plus(away.scaled((1.8 / away.magnitude()) * g.width * 0.4))
        const clamped = vec(Math.max(-g.width * 0.42, Math.min(g.width * 0.42, target.x)), Math.max(-g.height * 0.45, Math.min(0, target.y)))
        yield* this.moveTo(clamped, 80, Ease.Out)
        yield* Array(30)
    }
}

/**
 * 蛇の胴体セグメント（×6）
 *
 * 毎フレーム prev（直前の敵）との距離を計算し、
 * SEGMENT_LENGTH を保つよう速度ベクトルを求めて移動する。
 * 頭の動きに対してフィジカルに追従するため、
 * 頭のパターンが変わると胴体がなめらかに引きずられる。
 */
class SnakeSegment extends Enemy {
    constructor(
        private readonly prev: Enemy,
        private readonly index: number,
    ) {
        const ratio = 1 - index / SEGMENT_COUNT
        const hp = Math.round(300 * ratio + 100)
        const r = Math.round(18 * ratio + 16)
        const renderer = new EnemyRendererMob()

        super(hp, r, renderer)
        this.isInvincible = true

        // 初期位置は prev の真下に並べる
        this.p = vec(0, -g.height * 2)
    }

    *G() {
        while (true) {
            const diff = this.prev.p.minus(this.p)
            const dist = diff.magnitude()

            // prev との距離が SEGMENT_LENGTH を超えたら近づく
            if (dist > SEGMENT_LENGTH) {
                const move = diff.scaled(((dist - SEGMENT_LENGTH) / dist) * FOLLOW_STIFFNESS)
                this.p = this.p.plus(move)
            }

            yield
        }
    }
}
