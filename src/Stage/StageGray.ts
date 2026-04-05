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

export default class extends Stage {
    protected *G(): Generator<void, void, unknown> {
        yield* this.wait(30)

        const parent = new E()
        g.enemies.push(parent)
        g.enemies.push(new Child(parent, 0))
        g.enemies.push(new Child(parent, 1))
        g.enemies.push(new Child(parent, 2))

        yield* this.waitDefeatEnemy()
        scorenize()
        flash(Dom.container)
        shake(Dom.container, 750, 8)
    }
}

class E extends Enemy {
    protected margin: number = 60
    private readonly curve = Curves.lissajous(g.width * 0.6, g.height / 3, 13, 12)

    constructor() {
        super(600, 64)

        this.moveTo(vec(0, -g.height / 4), 60)
    }

    *G() {
        this.p = this.curve(this.frame / 240).plus(vec(0, -g.height / 4))
        yield
    }

    *H() {
        remodel()
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

        yield* Array(30)
    }
}

class Child extends Enemy {
    constructor(
        parent: Enemy,
        private readonly index: number,
    ) {
        super(200, 48, new EnemyRendererMob())
        this.setParent(parent, () => vec.arg(this.frame / 30 + T * (index / 3)).scaled(150))
    }

    *G() {
        remodel()
            .appearance(Bullet.Appearance.Ball)
            .colorful(this.frame + this.index * 30)
            .r(6)
            .p(this.p.clone())
            .radian(T / 4)
            //
            .fire()

        yield* Array(10)
    }
}
