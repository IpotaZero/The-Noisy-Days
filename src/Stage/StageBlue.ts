import { Bullet } from "../Game/Bullet/Bullet"
import { Enemy } from "../Game/Enemy/Enemy"
import { remodel } from "../Game/Bullet/Remodel"
import { vec } from "../utils/Vec"
import { g, scorenize, T } from "../global"
import { Stage } from "./Stage"
import { SE } from "../SE"
import { flash } from "../utils/shake"
import { Dom } from "../Dom"

import * as Curves from "../utils/Functions/Curves"
import { EnemyRendererMob } from "../Game/Enemy/EnemyRendererMob"
import { Ease } from "../utils/Functions/Ease"

export default class extends Stage {
    protected *G(): Generator<void, void, unknown> {
        yield* this.wait(30)

        const parent = new E()
        g.enemies.push(parent)
        g.enemies.push(new Child(parent, 0))
        g.enemies.push(new Child(parent, 1))

        yield* this.waitDefeatEnemy()
        scorenize()
        flash(Dom.container)
    }
}

class E extends Enemy {
    private readonly curve = Curves.lissajous(g.width * 0.8, g.height / 3, 4, 5)

    constructor() {
        super(800, 64)

        this.moveTo(vec(0, -g.height / 4), 60)
    }

    *G() {
        remodel().colorful(this.frame).p(this.p.clone()).speed(8).aim(g.player.p).ex(13).fire()

        yield* Array(30)
    }

    *H() {
        this.p = this.curve((this.frame - 60) / 240).plus(vec(0, -g.height / 4))
        yield
    }
}

class Child extends Enemy {
    constructor(parent: Enemy, index: number) {
        super(300, 48, new EnemyRendererMob())
        this.setParent(parent, () => vec(150 * (2 * index - 1), 0))
    }

    *G() {
        const num = 13
        for (let i = 0; i < num; i++) {
            remodel()
                .colorful(this.frame * 2)
                .collision(Bullet.Collision.Line)
                .appearance(Bullet.Appearance.Line)
                .p(this.p.clone())
                .r(32)
                .radian(T * (i / num))
                .fire()
            yield
        }

        yield* Array(120)
    }
}
