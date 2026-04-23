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
            .colorful(this.frame * 2)
            .appearance(Bullet.Appearance.Ball)
            .speed(12)
            .radian(T / 4)
            .p(this.p.clone())
            .r(4)
            .radian(T / 4)
            .nway(13, T / 24)
            .delayByIndex(2)
            .sim(4, 4, 8)
            .fire()

        yield* Array(60)
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
        for (let i = 0; i < 90; i++) {
            remodel()
                .colorful(this.frame * 2)
                .p(this.p.clone())
                .radian(T * (this.frame / 360) + (T / 4) * this.index)
                .fire()
            yield* Array(10)
        }

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

        yield* Array(60)
    }
}
