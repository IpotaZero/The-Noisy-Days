import { Bullet } from "../../Game/Bullet/Bullet"
import { Enemy } from "../../Game/Enemy/Enemy"
import { remodel } from "../../Game/Bullet/Remodel"
import { vec } from "../../utils/Vec"
import { g, scorenize, T } from "../../global"
import { Stage } from "../Stage"
import { SE } from "../../SE"
import { flash, shake } from "../../utils/shake"
import { Dom } from "../../Dom"

import * as Curves from "../../utils/Functions/Curves"
import { EnemyRendererMob } from "../../Game/Enemy/EnemyRendererMob"
import { Ease } from "../../utils/Functions/Ease"

export default class extends Stage {
    protected *G(): Generator<void, void, unknown> {
        yield* this.wait(30)

        const parent = new E()
        g.enemies.push(parent)
        g.enemies.push(new Child0(parent, 0))
        g.enemies.push(new Child0(parent, 1))
        g.enemies.push(new Child1(parent, 0))
        g.enemies.push(new Child1(parent, 1))
        g.enemies.push(new Child2(parent, 0))
        g.enemies.push(new Child2(parent, 1))

        yield* this.waitDefeatEnemy()
        scorenize()
        flash(Dom.container)
        shake(Dom.container, 750, 8)
    }
}

class E extends Enemy {
    private readonly curve = Curves.lissajous(g.width * 0.6, g.height / 4, 5, 12)

    constructor() {
        super(1200, 64)

        this.moveTo(vec(0, -g.height / 4), 60)
    }

    *G() {
        remodel().colorful(this.frame).p(this.p.clone()).speed(6).aim(g.player.p).ex(13).fire()

        yield* Array(30)
    }

    *H() {
        this.p = this.curve((this.frame - 60) / 480).plus(vec(0, -g.height / 4))
        yield
    }
}

class Child0 extends Enemy {
    constructor(parent: Enemy, index: number) {
        super(300, 48, new EnemyRendererMob())
        this.setParent(parent, () => vec(150 * (2 * index - 1), 50))
    }

    *G() {
        remodel()
            .colorful(this.frame * 2)
            .appearance(Bullet.Appearance.Line)
            .collision(Bullet.Collision.Line)
            .p(this.p.clone())
            .r(28)
            .radian(T / 4)
            .fire()

        yield* Array(20)
    }
}

class Child1 extends Enemy {
    constructor(parent: Enemy, index: number) {
        super(300, 48, new EnemyRendererMob())
        this.setParent(parent, () => vec(100 * (2 * index - 1), -50))
    }

    *G() {
        remodel()
            .colorful(this.frame * 2)
            .p(this.p.clone())
            .aim(g.player.p)
            .ex(13)
            .fire()

        yield* Array(40)
    }
}

class Child2 extends Enemy {
    constructor(parent: Enemy, index: number) {
        super(200, 32, new EnemyRendererMob())
        this.setParent(parent, () => vec(200 * (2 * index - 1), 0))
    }

    *G() {
        remodel()
            .colorful(this.frame * 2)
            .collision(Bullet.Collision.Arrow)
            .appearance(Bullet.Appearance.Arrow)
            .speed(12)
            .p(this.p.clone())
            .r(28)
            .aim(g.player.p)
            .fire()

        yield* Array(60)
    }
}
