import { Bullet } from "../../Game/Bullet/Bullet"
import { Enemy } from "../../Game/Enemy/Enemy"
import { Remodel, remodel } from "../../Game/Bullet/Remodel"
import { vec } from "../../utils/Vec"
import { g, scorenize, T } from "../../global"
import { Stage } from "../Stage"
import { flash, shake } from "../../utils/shake"
import { Dom } from "../../Dom"

import * as Curves from "../../utils/Functions/Curves"
import { EnemyRendererMob } from "../../Game/Enemy/EnemyRendererMob"
import { EnemyRendererCore } from "../../Game/Enemy/EnemyRendererCore"
import { isSmartPhone } from "../../utils/Functions/isSmartPhone"

export default class extends Stage {
    protected *G(): Generator<void, void, unknown> {
        yield* this.wait(30)

        // ここでドローンが飛び出す
        const e = new EnemyTutorial()
        g.enemies.push(e)

        yield* this.waitDefeatEnemy()
        scorenize()
        flash(Dom.container)
        shake(Dom.container, 750, 8)
    }
}

class EnemyTutorial extends Enemy {
    constructor() {
        super(400, 64)

        this.isInvincible = true

        this.p = vec(g.width / 2, -g.height / 2)
    }

    *G() {
        const leftTop = vec(-g.width / 2, -g.height / 2)

        // donut
        remodel()
            .p(leftTop.plus(vec(100, 100)))
            .speed(0)
            .fire()

        remodel()
            .appearance(Bullet.Appearance.Ball)
            .p(leftTop.plus(vec(200, 100)))
            .r(6)
            .speed(0)
            .fire()

        remodel()
            .appearance(Bullet.Appearance.Ball)
            .p(leftTop.plus(vec(300, 100)))
            .r(28)
            .speed(0)
            .fire()

        remodel()
            .appearance(Bullet.Appearance.Line)
            .collision(Bullet.Collision.Line)
            .p(leftTop.plus(vec(400, 100)))
            .r(28)
            .speed(0)
            .fire()

        remodel()
            .appearance(Bullet.Appearance.Arrow)
            .collision(Bullet.Collision.Arrow)
            .p(leftTop.plus(vec(500, 100)))
            .r(28)
            .speed(0)
            .fire()

        while (1) yield
    }

    *H() {
        remodel()
            .appearance(Bullet.Appearance.Ball)
            .p(vec(200, -300))
            .radian(T / 4)
            .r(28)
            .fire()
        yield* Array(30)
    }
}
