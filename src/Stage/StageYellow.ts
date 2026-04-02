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
        g.enemies.push(new Child(parent))

        yield* this.waitDefeatEnemy()
        scorenize()
        flash(Dom.container)
    }
}

class E extends Enemy {
    private readonly curve = Curves.lissajous(g.width * 0.8, g.height / 3, 3, 4)

    constructor() {
        super(400, 64)

        this.moveTo(vec(0, -g.height / 4), 60)
    }

    *G() {
        remodel()
            .colorful(this.frame)
            .p(this.p.clone())
            .speed(8)
            .aim(g.player.p)
            .nway(6, T / 12)
            .fire()

        yield* Array(30)
    }

    *H() {
        this.p = this.curve((this.frame - 60) / 120).plus(vec(0, -g.height / 4))
        yield
    }
}

class Child extends Enemy {
    constructor(parent: Enemy) {
        super(200, 48, new EnemyRendererMob())
        this.setParent(parent, () => vec.arg(this.frame / 30).scaled(150))
    }

    *G() {
        remodel()
            .colorful(this.frame * 2)
            .appearance(Bullet.Appearance.Ball)
            .p(this.p.clone())
            .speed(8)
            .r(8)
            .aim(g.player.p)
            .g(function* (me) {
                const frame = 30
                for (let i = 1; i < frame + 1; i++) {
                    me.r = Ease.Out(i / frame) * 8 + 8
                    yield
                }
            })
            .fire()

        yield* Array(30)
    }
}
