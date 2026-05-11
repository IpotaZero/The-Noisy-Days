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
import { EnemyRendererBoss } from "../../Game/Enemy/EnemyRendererBoss"
import { Ease } from "../../utils/Functions/Ease"
import { isSmartPhone } from "../../utils/Functions/isSmartPhone"
import { EnemyRendererFunnel } from "../../Game/Enemy/EnemyRendererFunnel"
import { GenUtils } from "../../utils/GeneratorUtils"
import { EnemyRendererMine } from "../../Game/Enemy/EnemyRendererMine"

export default class extends Stage {
    protected *G(): Generator<void, void, unknown> {
        yield* this.wait(30)

        const rei = new Rei()

        let i = 0

        const cores = [
            new Core7(rei, i++),
            new Core0(rei, i++),
            new Core1(rei, i++),
            new Core2(rei, i++),
            new Core4(rei, i++),
            new Core3(rei, i++),
            new Core6(rei, i++),
            new Core5(rei, i++),
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

        this.stopSkip()
        rei.isInvincible = false
        yield* this.text("「どうしてっ分かり合えないのっ!?」", { name: "レイ" })
        yield* this.text("「邪魔だ! 黙れ!」", { name: "シオン" })

        yield* this.waitDefeatEnemy()
        scorenize()
        flash(Dom.container)
        shake(Dom.container, 750, 8)

        this.stopSkip()
        yield* this.wait(240)

        // 背景変更
        this.changeBackground("asset/background/black.png")

        yield* this.text("アオは死んだ。")
        yield* this.text("頭を失ったTAMAMUSHIは烏合の衆と化し瓦解した。")
        yield* this.text("玉虫色が、黒く塗りつぶされていく。")
        yield* this.text("だが、一つだけ勝ち取ったものがあった。当局は反政府主義の凝集をリスクと認識し、一部地域でのSILOの導入を見送ったのだ。")
        yield* this.text("完全な単色化は起きなかった。")

        this.changeBackground("asset/background/buildings.png")

        yield* this.text("「……。」", { name: "シオン" })
        yield* this.text("「……。」", { name: "レイ" })

        yield* this.text("混ざり合えない、分かり合えない、<ruby>摩擦<rt>ノイズ</rt></ruby>だらけの、斑のある鈍色の都市。")
        yield* this.text("「さようなら。レイ。」", { name: "シオン" })
        yield* this.text("「……さようなら。」", { name: "レイ" })
        yield* this.text("分かり合えなかったら、サヨナラしましょう。")

        // 多様性を担保するためには、いろんな人がいればそれだけでいいわけではなくて、
        // それぞれの色が混ざり合わずに同時に存在している、つまり意見を表明できなければならない
        // それには色同士の境界が必要で、それは人間関係の摩擦ともいえるのだろうけど、それが必要である

        // SILOは摩擦をゼロにするために色を相対的に無くす（単色化する）措置である
        // 初期TAMAMUSHI（合成人の集団）は様々な色の存在を目指したが、結局はマイノリティとして単色化された
        // アナキストとの合流は最初は新たな色の登場であったが、アオの死亡により黒く塗りつぶされていった
        // だがSILOの影響から逃れたことにより完全な単色化は逃れ、鈍く輝く廃墟となったトウキョウにシオンとレイが隣に座る、という終わり方
        // ちがああうう！！！
        // その方が終わり方として美しいけれど、云いたいことはそうじゃあない
        // 結局の所、分かり合えないのさ
        // これは前向きな諦めで、傷つけられたことを許すことなんだ
        // もう二度と出会いませんように
        // これは、許せるようになる物語?
    }
}

class Rei extends Enemy {
    private readonly curve = Curves.lissajous(g.width * 0.45, g.height / 5, 5, 6)

    isStarted = false

    constructor() {
        super(1200, 128, new EnemyRendererBoss(), { margin: 60 })
        this.p = vec(0, -g.height)
        this.moveTo(vec(0, -g.height / 4), 60)
        this.isInvincible = true
    }

    *G() {
        this.p = this.curve((this.frame - 60) / 480).plus(vec(0, -g.height / 4))
        yield
    }

    *H() {
        while (this.isInvincible) yield
        remodel()
            .appearance(Bullet.Appearance.Line)
            .collision(Bullet.Collision.Line)
            .r(28)
            .color("black")
            .p(this.p.clone())
            .radian(T / 4 + this.frame / 30)
            .speed(4)
            .ex(5)
            .nway(7, T / 24)
            .fire()
        yield* Array(30)
    }

    *I() {
        while (this.isInvincible) yield

        remodel()
            .appearance(Bullet.Appearance.Ball)
            .r(6)
            .speed(6)
            .p(this.p.clone())
            .radian(T / 4 + this.frame / 60)
            .ex(8)
            .fire()

        remodel()
            .appearance(Bullet.Appearance.Ball)
            .r(6)
            .speed(6)
            .p(this.p.clone())
            .radian(T / 4 - this.frame / 60)
            .ex(8)
            .fire()

        yield* Array(8)
    }
}

/**
 * レーザーで画面を分割し、そこに自機狙いを打ち込む
 */
class Core0 extends Enemy {
    private readonly curve2 = Curves.lissajous(g.width * 0.8, g.height * 0.8, 5, 6)
    private frame2 = 0

    constructor(parent: Enemy, index: number) {
        super(300, 60, new EnemyRendererCore(), { margin: 60 })
        this.p = vec(0, -g.height)
        this.setParent(parent, () => vec.arg(T / 4 + (T / 8) * (index + 1)).scaled(200))
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

    constructor(
        private readonly parent: Enemy,
        index: number,
    ) {
        super(300, 60, new EnemyRendererCore(), { margin: 60 })
        this.p = vec(0, -g.height)
        this.setParent(parent, () => vec.arg(T / 4 + (T / 8) * (index + 1)).scaled(200))
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
                .color("white")
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

    constructor(
        private readonly parent: Enemy,
        index: number,
    ) {
        super(300, 60, new EnemyRendererCore(), { margin: 60 })
        this.p = vec(0, -g.height)
        this.setParent(parent, () => vec.arg(T / 4 + (T / 8) * (index + 1)).scaled(200))
        this.isInvincible = true
    }

    *G() {
        while (this.isInvincible) yield

        remodel()
            .appearance(Bullet.Appearance.Ball)
            .r(28)
            .p(vec(Math.sin(this.frame2) * g.width, g.height / 2))
            .radian(-T / 4)
            .speed(4)
            .color("silver")
            .g(function* (me) {
                yield* Array(30)
                yield* Remodel.fadeout(me, 15)
            })
            .fire()

        yield* Array(5)
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
            .color("yellow")
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

    constructor(
        private readonly parent: Enemy,
        index: number,
    ) {
        super(300, 60, new EnemyRendererCore(), { margin: 60 })
        this.p = vec(0, -g.height)
        this.setParent(parent, () => vec.arg(T / 4 + (T / 8) * (index + 1)).scaled(200))
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

    constructor(
        private readonly parent: Enemy,
        index: number,
    ) {
        super(300, 60, new EnemyRendererCore(), { margin: 60 })
        this.p = vec(0, -g.height)
        this.setParent(parent, () => vec.arg(T / 4 + (T / 8) * (index + 1)).scaled(200))
        this.isInvincible = true
    }

    *G() {
        while (this.isInvincible) yield

        remodel()
            .colorful(this.frame)
            .p(this.parent.p.clone())
            .radian(T / 4 + T * (this.frame2 / 18))
            .ex(7)
            .nway(3, T / 48)
            .fire()
        yield* Array(60)
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
                .sim(24, 6, 24)
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

    constructor(
        private readonly parent: Enemy,
        index: number,
    ) {
        super(300, 60, new EnemyRendererCore(), { margin: 60 })
        this.p = vec(0, -g.height)
        this.setParent(parent, () => vec.arg(T / 4 + (T / 8) * (index + 1)).scaled(200))
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
                yield* Remodel.ease(me, "radian", radian + (T / 16) * (2 * i - 1), 90, Ease.InOut)
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
                yield* Remodel.ease(me, "radian", radian + (T / 16) * (2 * i - 1), 120, Ease.InOut)
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
            .ex(13)
            .delayByIndex()
            .fire()

        remodel()
            .colorful(this.frame + 120)
            .p(this.parent.p.clone())
            .radian(T / 4 + T * (this.frame2 / 32) * 2)
            .speed(4)
            .ex(13)
            .delayByIndex()
            .fire()

        yield* Array(15)
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
class Core6 extends Enemy {
    private frame2 = 0
    private readonly curve2 = Curves.lissajous(g.width * 0.9, g.height * 0.4, 5, 6)

    constructor(
        private readonly parent: Enemy,
        index: number,
    ) {
        super(300, 60, new EnemyRendererCore(), { margin: 60 })
        this.p = vec(0, -g.height)
        this.setParent(parent, () => vec.arg(T / 4 + (T / 8) * (index + 1)).scaled(200))
        this.isInvincible = true
    }

    *G() {
        while (this.isInvincible) yield

        const count = 17
        for (let i = 0; i < count; i++) {
            g.enemies.push(new DeployedMine(this.parent.p.clone(), T * (i / count)))
            g.enemies.push(new DeployedMine(this.parent.p.clone(), -T * (i / count) + T / count / 2))
            yield
        }

        yield* Array(300)
    }

    *H() {
        while (this.isInvincible) yield

        yield* GenUtils.parallel(
            this.musi(0),
            this.musi(1),
            //
        )

        yield* Array(3)
    }

    private *musi(h: number) {
        const p = this.curve2(this.frame2 + h * 40).plus(vec(0, -g.height / 4))

        for (let i = 0; i < 8; i++) {
            remodel()
                .appearance(Bullet.Appearance.Arrow)
                .collision(Bullet.Collision.Arrow)
                .color("white")
                .p(p.clone())
                .radian(T / 4)
                .speed(0)
                .r(14) // Arrow制限: 28
                .g(function* (me) {
                    const baseRadian = me.radian
                    const shift = 0
                    for (let h = 0; h < 10; h++) {
                        for (let i = 0; i < 60; i++) {
                            me.radian = Math.floor((baseRadian + Math.sin(i / 10 + shift) * 0.4) * 4) / 4
                            yield* Array(2)
                        }
                        yield* Array(30)
                    }
                })
                .g(function* (me) {
                    while (1) {
                        me.p = me.p.plus(vec.arg(me.radian).scaled(12))
                        yield* Array(2)
                    }
                })
                .fire()

            yield* Array(2)
        }
    }

    *I() {
        while (this.isInvincible) yield
        this.frame2++
        yield
    }
}

/**
 * 機雷：設置後に静止し、一定時間で爆発
 */
class DeployedMine extends Enemy {
    constructor(pos: Vec, angle: number) {
        super(20, 32, new EnemyRendererMine())
        this.p = pos

        this.g.push(this.physics(angle))

        this.mine(
            90,
            function* () {
                remodel()
                    .color("yellow")
                    .appearance(Bullet.Appearance.Ball)
                    .r(64)
                    .p(this.p.clone())
                    .speed(0)
                    .g(function* (me) {
                        yield* Array(15)
                        yield* Remodel.fadeout(me, 30)
                    })
                    .fire()

                yield* Array(5)

                remodel()
                    .color("yellow")
                    .appearance(Bullet.Appearance.Ball)
                    .r(28)
                    .p(this.p.clone())
                    .speed(8)
                    .duplicate(13, (me, i) => {
                        me.radian = i ** 2
                        return me
                    })
                    .g(function* (me) {
                        yield* Array(30)
                        yield* Remodel.fadeout(me, 30)
                    })
                    .fire()

                yield* Array(5)

                remodel()
                    .color("yellow")
                    .appearance(Bullet.Appearance.Ball)
                    .r(6)
                    .p(this.p.clone())
                    .speed(12)
                    .duplicate(23, (me, i) => {
                        me.radian = i ** 3
                        return me
                    })
                    .g(function* (me) {
                        yield* Array(30)
                        yield* Remodel.fadeout(me, 30)
                    })
                    .fire()
            },
            1,
        )
    }

    private *physics(angle: number) {
        const friction = 0.97
        let speed = 25
        const dx = Math.cos(angle)
        const dy = Math.sin(angle)

        // 摩擦で減速しながら移動
        while (speed > 0.3) {
            this.p.add(vec(dx * speed, dy * speed))
            speed *= friction
            yield
        }
    }
}

/**
 *
 */
class Core7 extends Enemy {
    private frame2 = 0

    private a = 90

    constructor(
        private readonly parent: Enemy,
        index: number,
    ) {
        super(300, 60, new EnemyRendererCore(), { margin: 60 })
        this.p = vec(0, -g.height)
        this.setParent(parent, () => vec.arg(T / 4 + (T / 8) * (index + 1)).scaled(200))
        this.isInvincible = true
    }

    *G() {
        while (this.isInvincible) yield

        for (let i = 0; i < 10; i++) {
            remodel()
                .p(vec(0, (i - 5) * 120))
                .radian(0)
                .ex(2)
                .laser(this, 30 - i, 30)
                .fire()
            yield
        }

        for (let i = 0; i < 10; i++) {
            remodel()
                .p(vec((i - 5) * 120, 0))
                .radian(T / 4)
                .ex(2)
                .laser(this, 20 - i, 30)
                .fire()
            yield
        }

        yield* Array(120)
    }

    *I() {
        while (this.isInvincible) yield
        this.frame2++
        yield
    }
}
