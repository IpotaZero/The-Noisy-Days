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
    private readonly curve = Curves.lissajous(g.width * 0.6, g.height / 3, 5, 12)

    constructor() {
        super(900, 64)

        this.moveTo(vec(0, -g.height / 4), 60)
    }

    *G() {
        remodel()
            .appearance(Bullet.Appearance.Arrow)
            .collision(Bullet.Collision.Arrow)
            .colorful(this.frame)
            .p(this.p.clone())
            .speed(6)
            .radian(T * (this.frame / 360))
            .r(28)
            .ex(2)
            .fire()

        yield* Array(10)
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
        // remodel()
        //     .colorful(this.frame * 2)
        //     .p(this.p.clone())
        //     .radian(T / 4)
        //     .sim(3, 6, 12)
        //     .fire()

        yield* Array(30)
    }
}

class Child1 extends Enemy {
    constructor(parent: Enemy, index: number) {
        super(300, 48, new EnemyRendererMob())
        this.setParent(parent, () => vec(100 * (2 * index - 1), -50))
    }

    *G() {
        // remodel()
        //     .appearance(Bullet.Appearance.Ball)
        //     .r(6)
        //     .colorful(this.frame * 2)
        //     .p(this.p.clone())
        //     .radian(T / 4)
        //     .sim(3, 6, 12)
        //     .fire()

        yield* Array(50)
    }
}

class Child2 extends Enemy {
    constructor(
        parent: Enemy,
        private readonly index: number,
    ) {
        super(200, 32, new EnemyRendererMob())
        this.setParent(parent, () => vec.arg(T * (this.frame / 720) + index * (T / 2)).scaled(200))
    }

    *G() {
        remodel()
            .colorful(this.frame * 2)
            .appearance(Bullet.Appearance.Ball)
            .speed(12)
            .p(this.p.clone())
            .r(6)
            .radian(T * this.frame ** 2)
            .ex(13)
            .fire()

        yield* Array(10)
    }
}
