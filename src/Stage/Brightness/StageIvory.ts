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
import { Ease } from "../../utils/Functions/Ease"

export default class extends Stage {
    protected *G(): Generator<void, void, unknown> {
        yield* this.wait(30)

        const ship = new Battleship()

        const turrets = [new Turret(ship, 0), new Turret(ship, 1), new Turret(ship, 2), new Turret(ship, 3)]

        const guns = turrets.flatMap((t, i) => [new Gun(t, i), new Gun(t, i + 1), new Gun(t, i + 2)])

        g.enemies.push(ship, ...turrets, ...guns)

        yield* this.waitDefeatEnemy()
        scorenize()
        flash(Dom.container)
        shake(Dom.container, 750, 8)
    }
}

/**
 * 戦艦本体
 * 充電後: 逆回転する二重螺旋の小ボール（11方向 + 7方向）
 * 止まって再加速で読みにくい軌道に
 */
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

        // 正転11方向
        remodel()
            .colorful(this.frame)
            .p(this.p.clone())
            .radian(T * (this.frame / 210))
            .ex(11)
            .fire()

        // 逆転7方向（同時発射で二重螺旋）
        remodel()
            .appearance(Bullet.Appearance.Ball)
            .colorful(this.frame + 180)
            .p(this.p.clone())
            .speed(6)
            .radian(-T * (this.frame / 210))
            .r(28)
            .ex(7)
            .fire()

        yield* Array(30)
    }
}

/**
 * 砲台（×4）
 * 充電後: 狙い矢印を止まって再照準してから加速
 * 4基で周期が異なる（29 / 37 / 41 / 43f）
 */
class Turret extends Enemy {
    private static readonly OFFSETS = [vec(-160, 60), vec(160, 60), vec(-160, -60), vec(160, -60)]

    private readonly interval: number

    constructor(
        ship: Battleship,
        private readonly index: number,
    ) {
        super(200, 44, new EnemyRendererMob(), { remainingCharge: 960 })
        this.setParent(ship, () => Turret.OFFSETS[index])
        this.interval = [29, 37, 41, 43][index]
    }

    *G() {
        yield* this.waitCharge()

        remodel()
            .appearance(Bullet.Appearance.Arrow)
            .collision(Bullet.Collision.Arrow)
            .colorful(this.frame * 2 + this.index * 40)
            .p(this.p.clone())
            .aim(g.player.p)
            .nway(5, T / 20)
            .r(28)
            .speed(8)
            .g(function* (me) {
                yield* Remodel.appear(me, 15)
                yield* Remodel.stop(me, 15)

                const target = g.player.p.minus(me.p).arg() + T
                // 停止中に再照準
                if (isSmartPhone) {
                    // me.radian = target
                    yield* Array(15)
                } else {
                    const first = me.radian
                    for (let i = 1; i < 15 + 1; i++) {
                        me.radian = first + (target - first) * Ease.InOut(i / 15)
                        yield
                    }
                }

                yield* Remodel.accel(me, 15, 12)
            })
            .fire()

        yield* Array(this.interval)
    }
}

/**
 * 砲身（各砲台に×3、計12門）
 * 発射→消えた位置に出現→全方位13方向を一斉放射
 * marginのずれで12門が順番にばらけて撃つ
 */
class Gun extends Enemy {
    constructor(turret: Turret, index: number) {
        super(50, 24, new EnemyRendererMob(), { margin: index * 10 + 30 })
        this.setParent(turret, () => vec.arg(T / 4 + (index - 1) * (T / 6)).scaled(80))
    }

    *G() {
        for (let i = 0; i < 7; i++) {
            remodel()
                .appearance(Bullet.Appearance.Ball)
                .colorful(this.frame + i * 30)
                .r(6)
                .p(this.p.clone())
                .radian((this.frame / 120) * T)
                .ex(13)
                .fire()

            yield* Array(60)
        }

        yield* Array(60)
    }
}
