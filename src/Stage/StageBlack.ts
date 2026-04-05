import { Bullet } from "../Game/Bullet/Bullet"
import { Enemy } from "../Game/Enemy/Enemy"
import { remodel } from "../Game/Bullet/Remodel"
import { vec } from "../utils/Vec"
import { g, scorenize, T } from "../global"
import { Stage } from "./Stage"
import { SE } from "../SE"
import { flash, shake } from "../utils/shake"
import { Dom } from "../Dom"

import * as Curves from "../utils/Functions/Curves"
import { EnemyRendererMob } from "../Game/Enemy/EnemyRendererMob"
import { Ease } from "../utils/Functions/Ease"
import { EnemyRendererBoss } from "../Game/Enemy/EnemyRendererBoss"

export default class extends Stage {
    protected *G(): Generator<void, void, unknown> {
        yield* this.wait(30)

        yield* this.text("「熱源反応……? 人間が来ているのか……?」", { name: "シオン" })
        const parent = new E()
        const core0 = new Child(parent, 0)
        const core1 = new Child(parent, 1)
        const core2 = new Child(parent, 2)
        g.enemies.push(parent, core0, core1, core2)

        yield* this.text("「ハローハロー、条約違反の兵器かと思ったけど、まさかホントに人間とはね。」", { name: "スナガワ" })
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
    private readonly curve = Curves.lissajous(g.width * 0.6, g.height / 3, 13, 12)

    phase = 0

    constructor() {
        super(1200, 96, new EnemyRendererBoss())

        this.moveTo(vec(0, -g.height / 4), 60)

        this.isInvincible = true
    }

    *G() {
        this.p = this.curve((this.frame - 60) / 720).plus(vec(0, -g.height / 4))
        yield
    }

    *H() {
        if (this.phase === 0) {
        } else if (this.phase === 1) {
            remodel()
                .colorful(this.frame)
                .appear(30)
                .appearance(Bullet.Appearance.Ball)
                .r(32)
                .p(this.p.clone())
                .speed(0)
                .radian(T / 4)
                .g(function* (me) {
                    yield* Array(10)

                    while (1) {
                        me.speed += 0.2
                        yield
                    }
                })
                .fire()
        } else if (this.phase === 2) {
            remodel()
                .colorful(this.frame)
                .appear(30)
                .appearance(Bullet.Appearance.Ball)
                .r(32)
                .p(this.p.clone())
                .aim(g.player.p.clone())
                .ex(13)
                //
                .fire()
        } else if (this.phase === 3) {
            remodel()
                .colorful(this.frame)
                .appear(30)
                .appearance(Bullet.Appearance.Ball)
                .r(32)
                .p(vec(0, (-g.height / 2) * 0.9))
                .radian(T / 4)
                .shift(Math.floor((Math.sin(this.frame) + 1) * 5), 96)
                //
                .fire()
        } else if (this.phase === 4) {
            remodel()
                .colorful(this.frame)
                .appear(30)
                .appearance(Bullet.Appearance.Ball)
                .r(32)
                .p(this.p.clone())
                .aim(g.player.p)
                .nway(Math.floor((Math.sin(this.frame) + 1) * 5), T / 23)
                .speed(16)
                //
                .fire()
        }

        yield* Array(30)
    }
}

class Child extends Enemy {
    constructor(
        parent: Enemy,
        private readonly index: number,
    ) {
        super(200, 48)
        this.setParent(parent, () => vec.arg(this.frame / 90 + T * (index / 3)).scaled(300))

        this.isInvincible = true
    }
}
