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

export default class extends Stage {
    protected *G(): Generator<void, void, unknown> {
        yield* this.wait(30)

        const star = new Star()
        const planet0 = new Planet(star, 0)
        const planet1 = new Planet(star, 1)
        const satellite00 = new Satellite(planet0, 0)
        const satellite01 = new Satellite(planet0, 1)
        const satellite10 = new Satellite(planet1, 0)
        const satellite11 = new Satellite(planet1, 1)

        g.enemies.push(star, planet0, planet1, satellite00, satellite01, satellite10, satellite11)

        yield* this.text("「ちょいちょいちょおいっ!<br>自律兵器は条約違反でしょおっ!?」", { name: "イシカワ" })
        yield* this.text("「生憎あたしはロボットじゃあない。」", { name: "シオン" })
        yield* this.text("「って、にゃるへそ『当たらなければどうということはない』<br>……ってかぁ?」", { name: "イシカワ" })
        yield* this.text("「てゆーか、なんで君は戦ってるのかな?」", { name: "イシカワ" })
        yield* this.text("「SILOは悪意を増幅させる!」", { name: "シオン" })
        yield* this.text("「それは建前だ。本当は誰も悪意なんて持ってない事、分かってんでしょう?」", { name: "イシカワ" })
        yield* this.text("「悪意があるから人が死ぬんだろっ!?」", { name: "シオン" })
        yield* this.text("「それにはハンロンさせてもらうよっ!」", { name: "イシカワ" })

        star.started = true
        planet0.started = true
        planet1.started = true
        satellite00.started = true
        satellite01.started = true
        satellite10.started = true
        satellite11.started = true

        while (satellite00.life > 0 || satellite01.life > 0 || satellite10.life > 0 || satellite11.life > 0) yield

        planet0.isInvincible = false
        planet1.isInvincible = false
        star.phase = 1
        while (planet0.life > 0 || planet1.life > 0) yield

        star.isInvincible = false
        star.phase = 2

        yield* this.waitDefeatEnemy()
        scorenize()
        flash(Dom.container)
        shake(Dom.container, 3000, 12)
    }
}

/**
 * 恒星
 * - phase 0: 11方向回転小ボール、間隔23f
 * - phase 1: 13方向回転＋5-way狙い矢印×2連射、間隔13f
 * - phase 2: 17方向高速回転（止まって再加速）＋7-way狙い矢印＋逆回転11方向の三重攻撃、間隔11f
 */
class Star extends Enemy {
    private readonly curve = Curves.lissajous(g.width * 0.3, g.height / 5, 3, 2)
    phase = 0

    started = false

    constructor() {
        super(600, 96, new EnemyRendererBoss())
        this.isInvincible = true
        this.moveTo(vec(0, -g.height / 4), 60)
    }

    *G() {
        this.p = this.curve((this.frame - 60) / 960).plus(vec(0, -g.height / 4))
        yield
    }

    *H() {
        while (!this.started) yield

        if (this.phase === 0) yield* this.phase0()
        else if (this.phase === 1) yield* this.phase1()
        else {
            let phase2Gen = this.phase2()
            let phase22Gen = this.phase22()

            while (true) {
                const r1 = phase2Gen.next()
                const r2 = phase22Gen.next()

                if (r1.done) phase2Gen = this.phase2()
                if (r2.done) phase22Gen = this.phase22()

                yield
            }
        }
    }

    private *phase0() {
        remodel()
            .appearance(Bullet.Appearance.Ball)
            .colorful(this.frame)
            .p(this.p.clone())
            .speed(8)
            .radian(T * (this.frame / 300))
            .r(6)
            .ex(11)
            .g((me) => Remodel.appear(me, 10))
            .fire()

        yield* Array(23)
    }

    private *phase1() {
        remodel()
            .appearance(Bullet.Appearance.Ball)
            .colorful(this.frame * 2)
            .r(6)
            .p(this.p.clone())
            .radian(T * (this.frame / 240))
            .ex(7)
            .nway(5, T / 128)
            .fire()

        yield* Array(13)
    }

    private *phase2() {
        remodel()
            .appearance(Bullet.Appearance.Ball)
            .alpha(0.3)
            .colorful(this.frame * 3)
            .p(this.p.clone())
            .type(Bullet.Type.Neutral)
            .speed(0)
            .g(
                function* (this: Enemy, me: Bullet) {
                    const homingFrame = 15
                    const finishedFrame = 15

                    for (let i = 1; i < homingFrame + 1; i++) {
                        yield
                        const p = g.player.p
                        me.p = me.p.plus(p.minus(me.p).scaled(1 / 6))
                    }

                    const p = g.player.p.clone()

                    for (let i = 1; i < finishedFrame + 1; i++) {
                        yield
                        me.p = me.p.plus(p.minus(me.p).scaled(1 / 6))
                    }

                    me.life = 0

                    remodel()
                        .appearance(Bullet.Appearance.Arrow)
                        .collision(Bullet.Collision.Arrow)
                        .r(28)
                        .colorful(this.frame)
                        .p(me.p.clone())
                        .aim(g.player.p)
                        .ex(7)
                        .g((me) => Remodel.appear(me, 10))
                        .fire()

                    remodel()
                        .appearance(Bullet.Appearance.Arrow)
                        .collision(Bullet.Collision.Arrow)
                        .r(28)
                        .colorful(this.frame + 180)
                        .p(me.p.clone())
                        .aim(g.player.p)
                        .speed(4)
                        .ex(13)
                        .g((me) => Remodel.appear(me, 10))
                        .fire()
                }.bind(this),
            )
            .g(function* (me) {
                const frame = 60

                for (let i = 1; i < frame + 1; i++) {
                    remodel()
                        .appearance(Bullet.Appearance.Player)
                        .r(12)
                        .alpha(0.1)
                        .color("white")
                        .type(Bullet.Type.Effect)
                        .p(me.p.clone())
                        .circle(12, (1 - Ease.Out(i / frame)) * 128)
                        .delete()
                        .fire()

                    remodel()
                        .appearance(Bullet.Appearance.Player)
                        .r(12)
                        .alpha(0.2)
                        .color("white")
                        .type(Bullet.Type.Effect)
                        .p(me.p.clone())
                        .duplicate(4, (b, j) => {
                            const angle = (T / 4) * j
                            b.p = b.p.plus(vec.arg(angle).scaled((1 - Ease.Out(i / frame)) * 128 + 18))
                            return b
                        })
                        .delete()
                        .fire()

                    yield
                }
            })
            .fire()

        yield* Array(120)
    }

    private *phase22() {
        for (let i = 0; i < 17; i++) {
            remodel()
                .appearance(Bullet.Appearance.Ball)
                .colorful(this.frame * 2)
                .r(28)
                .p(this.p.clone())
                .radian((this.frame / 120) ** 2)
                .ex(13)
                .fire()

            yield* Array(20)
        }

        for (let i = 0; i < 240; i++) {
            remodel()
                .appearance(Bullet.Appearance.Line)
                .collision(Bullet.Collision.Line)
                .colorful(this.frame * 4)
                .r(28)
                .p(this.p.clone())
                .radian((this.frame / 12) ** 2)
                .ex(2)
                .fire()
            yield
        }
    }
}

/**
 * 惑星（×2）
 * - 11方向放射小ボール＋3-way狙い矢印の同時発射
 * - 間隔 29f / 37f（素数）
 */
class Planet extends Enemy {
    private readonly interval: number

    started = false

    constructor(
        star: Star,
        private readonly index: number,
    ) {
        super(300, 56, new EnemyRendererCore())
        this.isInvincible = true
        this.setParent(star, () => vec.arg(T * (this.frame / 600) + T * (index / 2)).scaled(250))
        this.interval = index === 0 ? 29 : 37
    }

    *G() {
        while (!this.started) yield

        // 11方向回転小ボール、出現後に加速
        remodel()
            .colorful(this.frame)
            .p(this.p.clone())
            .speed(5)
            .radian(T * (this.frame / 240))
            .ex(5)
            .nway(3, T / 128)
            .fire()

        yield* Array(this.interval)
    }
}

/**
 * 衛星（各惑星に×2、計4機）
 * - 5-way狙い矢印、出現演出あり
 * - 間隔 41f / 53f（素数）
 */
class Satellite extends Enemy {
    private readonly interval: number

    started = false

    constructor(
        planet: Planet,
        private readonly index: number,
    ) {
        super(150, 36, new EnemyRendererMob())
        this.setParent(planet, () => vec.arg(T * (this.frame / 240) + T * (index / 2)).scaled(120))
        this.interval = index === 0 ? 41 : 53
    }

    *G() {
        while (!this.started) yield

        remodel()
            .appearance(Bullet.Appearance.Arrow)
            .collision(Bullet.Collision.Arrow)
            .colorful(this.frame * 3)
            .r(28)
            .p(this.p.clone())
            .aim(g.player.p)
            .ex(5)
            .g((me) => Remodel.appear(me, 7))
            .g(function* (me) {
                yield* Remodel.stop(me, 15)

                if (!isSmartPhone) {
                    const frame = 15
                    const target = Math.atan2(g.player.p.y - me.p.y, g.player.p.x - me.p.x) + T
                    const start = me.radian
                    for (let i = 1; i < frame + 1; i++) {
                        me.radian = start + (target - start) * Ease.InOut(i / frame)
                        yield
                    }
                } else {
                    me.radian = g.player.p.minus(me.p).arg()
                    yield* Array(15)
                }

                yield* Remodel.accel(me, 15, 32)
            })
            .fire()

        yield* Array(this.interval)
    }
}
