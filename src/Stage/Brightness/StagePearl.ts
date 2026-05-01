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

export default class extends Stage {
    protected *G(): Generator<void, void, unknown> {
        yield* this.wait(30)

        const ship = new Battleship()

        // 前方2基・後方2基の砲台
        const turrets = [
            new Turret(ship, 0), // 左前
            new Turret(ship, 1), // 右前
            new Turret(ship, 2), // 左後
            new Turret(ship, 3), // 右後
        ]

        // 各砲台に砲身3門
        const guns = turrets.flatMap((t, i) => [new Gun(t, i), new Gun(t, i + 1), new Gun(t, i + 2)])

        g.enemies.push(ship, ...turrets, ...guns)

        yield* this.waitDefeatEnemy()
        scorenize()
        flash(Dom.container)
        shake(Dom.container, 750, 8)
    }
}

class Battleship extends Enemy {
    phase = 0
    protected margin: number = 60

    private readonly curve = Curves.lissajous(g.width * 0.6, g.height / 3, 13, 12)

    constructor() {
        super(600, 80, new EnemyRendererCore(), { remainingCharge: 2400 })
        this.p = vec(-g.width * 2, -g.height)
        this.moveTo(vec(0, -g.height / 4), 60)
    }

    *G() {
        this.p = this.curve((this.frame - 60) / 720).plus(vec(0, -g.height / 4))
        yield
    }

    *H() {
        yield* this.waitCharge()

        remodel()
            .appearance(Bullet.Appearance.Ball)
            .colorful(this.frame)
            .p(this.p.clone())
            .speed(6)
            .radian(T * (this.frame / 180))
            .r(6)
            .ex(5)
            .nway(3, T / 48)
            .fire()

        yield* Array(10)
    }
}

/**
 * 砲台（×4）
 * - 戦艦の前後左右に固定配置
 */
class Turret extends Enemy {
    // 前左・前右・後左・後右の配置オフセット
    private static readonly OFFSETS = [
        vec(-160, 60), // 左前
        vec(160, 60), // 右前
        vec(-160, -60), // 左後
        vec(160, -60), // 右後
    ]

    constructor(
        ship: Battleship,
        private readonly index: number,
    ) {
        super(400, 44, new EnemyRendererMob(), { remainingCharge: 960 })
        this.setParent(ship, () => Turret.OFFSETS[index])
    }

    *G() {
        yield* this.waitCharge()

        remodel()
            .appearance(Bullet.Appearance.Line)
            .collision(Bullet.Collision.Line)
            .colorful(this.frame * 2 + this.index * 40)
            .p(this.p.clone())
            .radian(T / 4)
            .r(28)
            .speed(4)
            .g((me) => Remodel.accel(me, 30, 16))
            .fire()

        yield* Array(3)
    }
}

/**
 * 砲身（各砲台に×3、計12門）
 * - 砲台の周囲に扇形に配置
 * - 小さく素早い狙い矢印を撃つ
 */
class Gun extends Enemy {
    constructor(turret: Turret, index: number) {
        super(50, 24, new EnemyRendererMob(), { margin: index * 10 + 30 })
        // 砲台の前方に扇形（-60度・0度・+60度）に配置
        this.setParent(turret, () => vec.arg(T / 4 + (index - 1) * (T / 6)).scaled(80))
    }

    *G() {
        for (let i = 0; i < 8; i++) {
            remodel()
                .appearance(Bullet.Appearance.Arrow)
                .collision(Bullet.Collision.Arrow)
                .colorful(this.frame * 3)
                .r(28)
                .p(this.p.clone())
                .aim(g.player.p)
                .nway(3, T / 24)
                .g(function* (me) {
                    yield* Remodel.stop(me, 15)
                    me.radian = g.player.p.minus(me.p).arg()
                    yield* Remodel.accel(me, 15, 15)
                })
                .fire()

            yield* Array(40)
        }

        yield* Array(60)
    }
}
