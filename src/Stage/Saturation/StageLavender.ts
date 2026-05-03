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

export default class extends Stage {
    protected *G(): Generator<void, void, unknown> {
        yield* this.wait(30)

        const parent = new E()
        g.enemies.push(parent)
        g.enemies.push(new Child0(parent, 0))
        g.enemies.push(new Child0(parent, 1))
        g.enemies.push(new Child0(parent, 2))
        g.enemies.push(new Child0(parent, 3))

        g.enemies.push(new Child2(parent, 0))
        g.enemies.push(new Child2(parent, 1))
        g.enemies.push(new Child2(parent, 2))
        g.enemies.push(new Child2(parent, 3))
        g.enemies.push(new Child2(parent, 4))

        yield* this.waitDefeatEnemy()
        scorenize()
        flash(Dom.container)
        shake(Dom.container, 750, 8)
    }
}

class E extends Enemy {
    private readonly curve = Curves.lissajous(g.width * 0.6, g.height / 3, 7, 12)

    constructor() {
        super(500, 64)

        this.moveTo(vec(0, -g.height / 4), 60)
    }

    *G() {
        remodel()
            .colorful(this.frame)
            .p(this.p.clone())
            .speed(6)
            .radian(T * (this.frame / 24))
            .ex(3)
            .nway(4, T / 96)
            .fire()

        yield* Array(10)
    }

    *H() {
        this.p = this.curve((this.frame - 60) / 960).plus(vec(0, -g.height / 4))
        yield
    }
}

class Child0 extends Enemy {
    private waited = false

    constructor(
        parent: Enemy,
        private readonly index: number,
    ) {
        super(200, 48, new EnemyRendererMob())
        this.setParent(parent, () => vec.arg(T * (this.frame / 360) + (T / 4) * index).scaled(150))
    }

    *G() {
        if (!this.waited) {
            yield* Array(this.index * 10)
            this.waited = true
        }

        remodel()
            .appearance(Bullet.Appearance.Arrow)
            .collision(Bullet.Collision.Arrow)
            .colorful(this.frame * 2)
            .r(28)
            .p(this.p.clone())
            .aim(g.player.p)
            .sim(4, 16, 32)
            .g(function* (me) {
                yield* Remodel.accel(me, 15, 5)
                yield* Remodel.accel(me, 15, 64)
            })
            .fire()

        yield* Array(90)
    }
}

class Child2 extends Enemy {
    constructor(parent: Enemy, index: number) {
        super(50, 32, new EnemyRendererMob())
        this.setParent(parent, () => Curves.hypotrochoid(300, 180, 300)(this.frame / 18 + (T / 4) * index))
    }

    *G() {
        remodel()
            .colorful(this.frame * 2)
            .appearance(Bullet.Appearance.Ball)
            .speed(12)
            .radian(T / 4)
            .p(this.p.clone())
            .r(28)
            .g((me) => Remodel.appear(me, 15))
            .fire()

        yield* Array(30)
    }
}
