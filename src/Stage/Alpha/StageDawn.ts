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
import { GenUtils } from "../../utils/GeneratorUtils"

export default class extends Stage {
    protected *G(): Generator<void, void, unknown> {
        yield* this.wait(30)

        const rei = new Rei()
        const core0 = new Core0(rei)
        const core1 = new Core1(rei)
        const core2 = new Core2(rei)
        g.enemies.push(rei, core0, core1, core2)

        yield* this.text("「こんにちは、<br>シオン・シマ。」", { name: "レイ" })
        yield* this.text("「なっ……なんでアンタが。」", { name: "シオン" })
        yield* this.text("「あなたの気持ちが知りたくて。」", { name: "レイ" })
        yield* this.text("「……家へ帰るんだ。子供が使いこなせるものじゃあない。そもそも誰が……」", { name: "シオン" })
        yield* this.text("「使いこなす必要はないわ。使われるだけ。あなたと同様に。」", { name: "レイ" })
        yield* this.text("「まさかっ人工知能か!? そんなもの! 人を承認するだけの道具にするなんて、絶対にやっちゃいけない事なんだ!」", { name: "シオン" })
        yield* this.text("「ふははっ、相変わらず勘が良いのね。さあ、行きましょう。分かり合いましょう?」", { name: "レイ" })

        rei.isStarted = true
        core0.isInvincible = false

        while (core0.life > 0) yield
        scorenize()
        yield* this.wait(30)
        core1.isInvincible = false

        while (core1.life > 0) yield
        scorenize()
        yield* this.wait(30)
        core2.isInvincible = false

        while (core2.life > 0) yield
        scorenize()

        yield* this.waitDefeatEnemy()
        scorenize()
        flash(Dom.container)
        shake(Dom.container, 750, 8)
    }
}

class Rei extends Enemy {
    private readonly curve = Curves.lissajous(g.width * 0.45, g.height / 5, 5, 6)

    isStarted = false

    constructor() {
        super(600, 128, new EnemyRendererBoss(), { margin: 60 })
        this.p = vec(0, -g.height)
        this.moveTo(vec(0, -g.height / 4), 60)
        this.isInvincible = true
    }

    *G() {
        this.p = this.curve((this.frame - 60) / 480).plus(vec(0, -g.height / 4))
        yield
    }
}

/**
 * レーザーで画面を分割し、そこに自機狙いを打ち込む
 */
class Core0 extends Enemy {
    private readonly curve2 = Curves.lissajous(g.width * 0.8, g.height * 0.8, 5, 6)

    constructor(parent: Enemy) {
        super(400, 60, new EnemyRendererCore(), { margin: 60 })
        this.p = vec(0, -g.height)
        this.setParent(parent, () => vec.arg(T / 4).scaled(200))
        this.isInvincible = true
    }

    *H() {
        while (this.isInvincible) yield

        for (let i = 0; i < 7; i++) {
            remodel()
                .p(this.curve2(this.frame * i))
                .radian(this.frame)
                .ex(2)
                .laser(this)
                .g(function* (me) {
                    yield* Remodel.ease(me, "alpha", 0.1, 30, Ease.Out)
                    yield* Array(30 - i)
                    me.type = Bullet.Type.Enemy
                    yield* GenUtils.parallel(
                        Remodel.ease(me, "r", 12, 30, Ease.Out),
                        Remodel.ease(me, "alpha", 1, 30, Ease.Out),
                        //
                    )
                    yield* Array(30)
                    yield* Remodel.fadeout(me, 15)
                })
                .fire()
            yield
        }

        yield* Array(30)

        for (let i = 0; i < 16; i++) {
            remodel()
                .appearance(Bullet.Appearance.Arrow)
                .collision(Bullet.Collision.Arrow)
                .r(28)
                .color("white")
                .p(this.curve2(this.frame + i * 200).plus(vec(0, -g.height / 4)))
                .radian(T / 4 + i * 5)
                .g(function* (me) {
                    yield* Array(35 - i * 2)
                    yield* Remodel.ease(me, "radian", g.player.p.minus(me.p).arg(), 15, Ease.InOut)
                    yield* Remodel.accel(me, 30, 32)
                })
                .ex(3)
                .fire()
            yield* Array(2)
        }

        yield* Array(150)
    }

    *I() {
        while (this.isInvincible) yield
        remodel().appearance(Bullet.Appearance.Ball).r(6).colorful(this.frame).p(this.p.clone()).speed(7).ex(17).fire()
        yield* Array(23)
    }
}

/**
 *
 */
class Core1 extends Enemy {
    constructor(private readonly parent: Enemy) {
        super(400, 60, new EnemyRendererCore(), { margin: 60 })
        this.p = vec(0, -g.height)
        this.setParent(parent, () => vec.arg(T / 4 + T / 8).scaled(200))
        this.isInvincible = true
    }

    *G() {
        while (this.isInvincible) yield

        for (let i = 0; i < 120; i++) {
            remodel()
                .appearance(Bullet.Appearance.Ball)
                .r(6)
                .colorful(this.frame * 2 + i)
                .p(vec((Math.sin(i + this.frame) * g.width) / 2, -g.height / 2))
                .aim(vec((Math.sin(i ** 2 + this.frame) * g.width) / 2, g.height / 2))
                .speed(0)
                .g(function* (me) {
                    yield* Remodel.accel(me, 30, 12 + Math.sin(i) * 4)
                })
                .fire()
            yield
        }

        yield* Array(60)

        for (let i = 0; i < 15; i++) {
            remodel()
                .appearance(Bullet.Appearance.Line)
                .collision(Bullet.Collision.Line)
                .r(28)
                .colorful(this.frame + i)
                .p(this.parent.p.plus(vec.arg(i).scaled(200)))
                .ex(17)
                .delayByIndex()
                .g(function* (me, i) {
                    yield* Remodel.reaccel(me, 15, 17 - i, 15, 16)
                    yield* Remodel.accel(me, 5, 6)
                })
                .sim(2, 8, 16)
                .forEach((me, i) => {
                    if (i % 2 === 0) me.radian += T / 2
                })
                .fire()
            yield* Array(5)
        }

        yield* Array(150)
    }
}

/**
 *
 */
class Core2 extends Enemy {
    constructor(private readonly parent: Enemy) {
        super(400, 60, new EnemyRendererCore(), { margin: 60 })
        this.p = vec(0, -g.height)
        this.setParent(parent, () => vec.arg(T / 4 + (T / 8) * 2).scaled(200))
        this.isInvincible = true
    }

    *G() {
        while (this.isInvincible) yield

        yield* Array(150)
    }

    *H() {
        while (this.isInvincible) yield

        const p = this.parent.p.clone()

        remodel()
            .appearance(Bullet.Appearance.Ball)
            .r(6)
            .p(p.clone())
            .speed(6)
            .radian(T / 4)
            .nway(2, T / 4)
            .nway(7, T / 30)
            .delayByIndex()
            .sim(15, 1, 32)
            .g((me) => Remodel.reaccel(me, 15, 15, 15, 6))
            .forEach((me, i) => {
                me.color = `hsl(${(i * 2 + this.frame) % 360} 100% 50%)`
            })
            .bounce(Infinity)
            .fire()

        yield* Array(90)
    }
}
