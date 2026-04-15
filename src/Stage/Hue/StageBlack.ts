import { Bullet } from "../../Game/Bullet/Bullet"
import { Enemy } from "../../Game/Enemy/Enemy"
import { Remodel, remodel } from "../../Game/Bullet/Remodel"
import { vec } from "../../utils/Vec"
import { g, scorenize, T } from "../../global"
import { Stage } from "../Stage"
import { SE } from "../../SE"
import { flash, shake } from "../../utils/shake"
import { Dom } from "../../Dom"

import * as Curves from "../../utils/Functions/Curves"
import { EnemyRendererMob } from "../../Game/Enemy/EnemyRendererMob"
import { Ease } from "../../utils/Functions/Ease"
import { EnemyRendererBoss } from "../../Game/Enemy/EnemyRendererBoss"

export default class extends Stage {
    protected *G(): Generator<void, void, unknown> {
        yield* this.wait(30)

        yield* this.text("「熱源反応……? 人間が来ているのか……?」", {
            name: "シオン",
        })
        const parent = new E()
        const core0 = new Child(parent, 0)
        const core1 = new Child(parent, 1)
        const core2 = new Child(parent, 2)
        g.enemies.push(parent, core0, core1, core2)

        yield* this.text(
            "「ハローハロー、条約違反の兵器かと思ったけど、まさかホントに人間とはね。」",
            { name: "スナガワ" },
        )
        yield* this.text("「五月蝿い奴だ。」", { name: "シオン" })
        yield* this.text("「逮捕、させてもらうよ。」", { name: "スナガワ" })
        yield* this.text("「できるもんならね。」", { name: "シオン" })

        core0.isInvincible = false
        parent.phase = 1

        while (core0.life > 0) yield
        parent.phase = 2
        core1.isInvincible = false
        while (core1.life > 0) yield
        parent.phase = 3
        core2.isInvincible = false
        while (core2.life > 0) yield
        parent.phase = 4
        parent.isInvincible = false

        yield* this.waitDefeatEnemy()
        scorenize()
        flash(Dom.container)
        shake(Dom.container, 750, 8)
    }
}

class E extends Enemy {
    protected margin: number = 60
    private readonly curve = Curves.lissajous(
        g.width * 0.6,
        g.height / 3,
        13,
        12,
    )

    phase = 0

    constructor() {
        super(400, 96, new EnemyRendererBoss())

        this.moveTo(vec(0, -g.height / 4), 60)

        this.isInvincible = true
    }

    *G() {
        this.p = this.curve((this.frame - 60) / 720).plus(vec(0, -g.height / 4))
        yield
    }

    *H() {
        if (this.phase === 0) {
            yield
        } else if (this.phase === 1) {
            yield* this.phase1()
        } else if (this.phase === 2) {
            yield* this.phase2()
        } else if (this.phase === 3) {
            yield* this.phase3()
        } else if (this.phase === 4) {
            yield* this.phase4()
        }
    }

    private *phase1() {
        const num = 30

        const p = this.p.clone()

        for (let i = 0; i < num; i++) {
            remodel()
                .colorful(this.frame)
                .appearance(Bullet.Appearance.Ball)
                .r(6)
                .p(p.clone())
                .radian((i / num) * T)
                .g((me) => Remodel.reaccel(me, 30, 30 - i, 30, 16))
                //
                .fire()
            yield
        }
    }

    private *phase2() {
        const num = 60

        const p = this.p.clone()

        for (let i = 0; i < num; i++) {
            remodel()
                .colorful(this.frame)
                .appearance(Bullet.Appearance.Ball)
                .r(6)
                .p(p.clone())
                .radian((i / num) * T * 0.5)
                .g(function* (me) {
                    yield* Remodel.stop(me, 60)
                    me.radian += (T / 24) * (2 * i - 1)
                    yield* Remodel.accel(me, 30, 16)
                })
                //
                .fire()
            yield
        }
    }

    private *phase3() {
        const p = this.p.plus(vec.arg(this.frame).scaled(150))

        remodel()
            .colorful(this.frame)
            .appearance(Bullet.Appearance.Ball)
            .r(6)
            .p(p.clone())
            .ex(24)
            .g(function* (me) {
                yield* Remodel.stop(me, 10)
                me.radian = T / 4
                yield* Remodel.accel(me, 30, 16)
            })
            //
            .fire()

        yield* Array(10)
    }

    private *phase4() {
        const num = 31
        const num2 = 8

        const p = this.p.clone()

        for (let i = 0; i < num; i++) {
            for (let j = 0; j < num2; j++)
                remodel()
                    .colorful(this.frame)
                    .appearance(Bullet.Appearance.Ball)
                    .r(6)
                    .p(p.clone())
                    .radian((i / num) * T * (2 * j - 1))
                    .g((me) => Remodel.reaccel(me, 30, 10, 30, 16))
                    //
                    .fire()

            yield
        }
    }
}

class Child extends Enemy {
    constructor(parent: Enemy, index: number) {
        super(250, 64)
        this.setParent(parent, () =>
            vec.arg(this.frame / 90 + T * (index / 3)).scaled(300),
        )

        this.isInvincible = true
    }
}
