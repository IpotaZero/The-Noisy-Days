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
        const cores = [
            new Core0(rei),
            new Core1(rei),
            new Core2(rei),
            new Core3(rei),
            new Core4(rei),
            new Core5(rei),

            //
        ]
        g.enemies.push(rei, ...cores)

        yield* this.text("「こんにちは、<br>シオン・シマ。」", { name: "レイ" })
        yield* this.text("「なっ……なんでアンタが。」", { name: "シオン" })
        yield* this.text("「あなたの気持ちが知りたくて。」", { name: "レイ" })
        yield* this.text("「……家へ帰るんだ。子供が使いこなせるものじゃあない。そもそも誰が……」", { name: "シオン" })
        yield* this.text("「使いこなす必要はないわ。使われるだけ。あなたと同様に。」", { name: "レイ" })
        yield* this.text("「まさかっ人工知能か!? そんなもの! 人を承認するだけの道具にするなんて、絶対にやっちゃいけない事なんだ!」", { name: "シオン" })
        yield* this.text("「ふははっ、相変わらず勘が良いのね。さあ、行きましょう。分かり合いましょう?」", { name: "レイ" })

        rei.isStarted = true

        for (let i = 0; i < cores.length; i++) {
            cores[i].isInvincible = false
            while (cores[i].life > 0) yield
            yield
            scorenize()
            yield* this.wait(30)
        }

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
    private frame2 = 0

    constructor(parent: Enemy) {
        super(300, 60, new EnemyRendererCore(), { margin: 60 })
        this.p = vec(0, -g.height)
        this.setParent(parent, () => vec.arg(T / 4).scaled(200))
        this.isInvincible = true
    }

    *G() {
        while (this.isInvincible) yield
        this.frame2++
        yield
    }

    *H() {
        while (this.isInvincible) yield

        for (let i = 0; i < 7; i++) {
            remodel()
                .p(this.curve2(this.frame2 * i))
                .radian(this.frame2)
                .ex(2)
                .laser(this, 30 - i, 30)
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
                .p(this.curve2(this.frame2 + i * 200).plus(vec(0, -g.height / 4)))
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
        remodel().appearance(Bullet.Appearance.Ball).r(6).colorful(this.frame2).p(this.p.clone()).speed(7).ex(17).fire()
        yield* Array(23)
    }
}

/**
 *
 */
class Core1 extends Enemy {
    private frame2 = 0

    constructor(private readonly parent: Enemy) {
        super(300, 60, new EnemyRendererCore(), { margin: 60 })
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
                .colorful(this.frame2 * 2 + i)
                .p(vec((Math.sin(i + this.frame2) * g.width) / 2, -g.height / 2))
                .aim(vec((Math.sin(i ** 2 + this.frame2) * g.width) / 2, g.height / 2))
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
                .colorful(this.frame2 + i)
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

    *H() {
        while (this.isInvincible) yield
        this.frame2++
        yield
    }
}

/**
 *
 */
class Core2 extends Enemy {
    private frame2 = 0

    constructor(private readonly parent: Enemy) {
        super(300, 60, new EnemyRendererCore(), { margin: 60 })
        this.p = vec(0, -g.height)
        this.setParent(parent, () => vec.arg(T / 4 + (T / 8) * 2).scaled(200))
        this.isInvincible = true
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
                me.color = `hsl(${(i + this.frame2) % 360} 100% 50%)`
            })
            .bounce(Infinity)
            .fire()

        yield* Array(90)
    }

    *I() {
        while (this.isInvincible) yield
        this.frame2++
        yield
    }
}

/**
 *
 */
class Core3 extends Enemy {
    private frame2 = 0
    private readonly curve2 = Curves.lissajous(g.width * 0.8, g.height * 0.8, 5, 6)

    constructor(private readonly parent: Enemy) {
        super(300, 60, new EnemyRendererCore(), { margin: 60 })
        this.p = vec(0, -g.height)
        this.setParent(parent, () => vec.arg(T / 4 + (T / 8) * 3).scaled(200))
        this.isInvincible = true
    }

    *H() {
        while (this.isInvincible) yield

        for (let i = 0; i < 17; i++) {
            remodel()
                .p(this.curve2(this.frame2 * i * 8))
                .radian(this.frame2)
                .ex(2)
                .laser(this, 30 - i, 30)
                .fire()
            yield
        }

        const p = this.parent.p.clone()

        for (let i = 0; i < 25; i++) {
            remodel()
                .appearance(Bullet.Appearance.Ball)
                .r(6)
                .p(p.clone())
                .radian(T / 4 + T * ((i / 180) * 4) + T * (this.frame2 / 1800))
                .ex(8)
                .fire()
            remodel()
                .appearance(Bullet.Appearance.Ball)
                .r(6)
                .p(p.clone())
                .radian(T / 4 - T * ((i / 180) * 4) + T * (this.frame2 / 1800))
                .ex(8)
                .fire()
            yield* Array(4)
        }

        yield* Array(90)
    }

    *I() {
        while (this.isInvincible) yield
        this.frame2++
        yield
    }
}

/**
 *
 */
class Core4 extends Enemy {
    private frame2 = 0
    private readonly curve2 = Curves.lissajous(g.width * 0.8, g.height * 0.4, 5, 6)

    constructor(private readonly parent: Enemy) {
        super(300, 60, new EnemyRendererCore(), { margin: 60 })
        this.p = vec(0, -g.height)
        this.setParent(parent, () => vec.arg(T / 4 + (T / 8) * 4).scaled(200))
        this.isInvincible = true
    }

    *G() {
        while (this.isInvincible) yield

        remodel()
            .colorful(this.frame)
            .p(this.parent.p.clone())
            .radian(T / 4 + T * (this.frame2 / 18))
            .ex(7)
            .nway(7, T / 37)
            .fire()
        yield* Array(30)
    }

    *H() {
        while (this.isInvincible) yield

        for (let i = 0; i < 5; i++) {
            remodel()
                .appearance(Bullet.Appearance.Ball)
                .r(6)
                .p(this.curve2(this.frame2 * i * 4).plus(vec(0, -g.height / 4)))
                .aim(g.player.p)
                .nway(3, T / 12)
                .sim(24, 6, 32)
                .fire()
            yield* Array(15)
        }

        yield* Array(90)
    }

    *I() {
        while (this.isInvincible) yield
        this.frame2++
        yield
    }
}

/**
 *
 */
class Core5 extends Enemy {
    private frame2 = 0
    private readonly curve2 = Curves.lissajous(g.width * 0.8, g.height * 0.4, 5, 6)

    constructor(private readonly parent: Enemy) {
        super(300, 60, new EnemyRendererCore(), { margin: 60 })
        this.p = vec(0, -g.height)
        this.setParent(parent, () => vec.arg(T / 4 + (T / 8) * 5).scaled(200))
        this.isInvincible = true
    }

    *G() {
        while (this.isInvincible) yield

        const radian = g.player.p.minus(this.p).arg()

        remodel()
            .radian(radian)
            .nway(2, T / 2)
            .beam(this.parent, 0)
            .g(function* (me, i) {
                const moto = me.radian
                yield* Remodel.ease(me, "length", g.height, 30)
                yield* Remodel.ease(me, "radian", radian + (T / 32) * (2 * i - 1), 90, Ease.InOut)
                yield* Array(15)
                yield* Remodel.ease(me, "radian", moto, 90, Ease.InOut)
                yield* Remodel.fadeout(me, 15)
            })
            .nway(4, T / 24)
            .fire()

        remodel()
            .radian(radian)
            .nway(2, (T * 4) / 5)
            .beam(this.parent, 0)
            .color("yellow")
            .g(function* (me, i) {
                const moto = me.radian
                yield* Remodel.ease(me, "length", g.height, 30)
                yield* Remodel.ease(me, "radian", radian + (T / 32) * (2 * i - 1), 120, Ease.InOut)
                yield* Array(15)
                yield* Remodel.ease(me, "radian", moto, 120, Ease.InOut)
                yield* Remodel.fadeout(me, 15)
            })
            .nway(4, T / 24)
            .fire()

        yield* Array(300)
    }

    *H() {
        while (this.isInvincible) yield

        remodel()
            .appearance(Bullet.Appearance.Ball)
            .r(6)
            .colorful(this.frame)
            .speed(5)
            .p(this.parent.p.clone())
            .radian(T / 4 + T * (this.frame2 / 32))
            .ex(4)
            .delayByIndex()
            .fire()

        remodel()
            .colorful(this.frame + 120)
            .p(this.parent.p.clone())
            .radian(T / 4 + T * (this.frame2 / 32) * 2)
            .speed(4)
            .ex(4)
            .delayByIndex()
            .fire()

        yield* Array(3)
    }

    *I() {
        while (this.isInvincible) yield
        this.frame2++
        yield
    }
}
