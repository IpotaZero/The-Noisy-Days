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

        const ship = new HeavyCruiser()
        const turrets = [new WaveTurret(ship, 0), new WaveTurret(ship, 1), new WaveTurret(ship, 2), new WaveTurret(ship, 3)]

        const guns = turrets.flatMap((t, i) => [new ClusterGun(t, i), new ClusterGun(t, i + 1), new ClusterGun(t, i + 2)])

        g.enemies.push(ship, ...turrets, ...guns)

        yield* this.waitDefeatEnemy()
        scorenize()
        flash(Dom.container)
        shake(Dom.container, 750, 8)
    }
}

/**
 * 重巡洋艦
 * 本体サイズ r: 80 (Battleship準拠)
 */
class HeavyCruiser extends Enemy {
    private readonly curve = Curves.lissajous(g.width * 0.6, g.height / 3, 13, 12)
    protected margin: number = 60

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
            .speed(4)
            .r(6) // Ball制限: 6
            .circle(40, 100)
            .radian(T / 4)
            .speed(-4)
            .g(function* (me) {
                while (me.life > 0) {
                    me.speed += 0.5
                    yield
                }
            })
            .fire()

        yield* Array(45)
    }
}

/**
 * 波動砲台
 * 砲台サイズ r: 44 (Turret準拠)
 */
class WaveTurret extends Enemy {
    private static readonly OFFSETS = [vec(-180, 40), vec(180, 40), vec(-100, -80), vec(100, -80)]

    constructor(
        ship: Enemy,
        private readonly turretIndex: number,
    ) {
        super(400, 44, new EnemyRendererMob(), { remainingCharge: 960 })
        this.setParent(ship, () => WaveTurret.OFFSETS[turretIndex])
    }

    *G() {
        yield* this.waitCharge()

        const target = g.player.p.clone()
        const p = this.p.clone()

        for (let i = 0; i < 4; i++) {
            remodel()
                .appearance(Bullet.Appearance.Arrow)
                .collision(Bullet.Collision.Arrow)
                .color("white")
                .p(p.clone())
                .aim(target)
                .speed(0)
                .r(28) // Arrow制限: 28
                .g(function* (me) {
                    const baseRadian = me.radian
                    const shift = 0
                    for (let i = 0; i < 200; i++) {
                        me.radian = Math.floor((baseRadian + Math.sin(i / 10 + shift) * 0.4) * 4) / 4
                        yield
                    }
                })
                .g(function* (me) {
                    while (1) {
                        me.p = me.p.plus(vec.arg(me.radian).scaled(12))
                        yield* Array(2)
                    }
                })
                .fire()
            yield* Array(4)
        }

        yield* Array(30)
    }
}

/**
 * クラスター砲
 * 砲身サイズ r: 24 (Gun準拠)
 */
class ClusterGun extends Enemy {
    constructor(turret: Enemy, index: number) {
        super(50, 24, new EnemyRendererMob(), { margin: index * 10 + 30 })
        this.setParent(turret, () => vec.arg(T / 4 + (index - 1) * (T / 6)).scaled(80))
    }

    *G() {
        const seedFrame = this.frame

        remodel()
            .appearance(Bullet.Appearance.Ball)
            .colorful(seedFrame)
            .p(this.p.clone())
            .r(28) // Ball制限: 28
            .radian(T / 4)
            .speed(12)
            .g(function* (me) {
                yield* Remodel.stop(me, 30)

                const currentPos = me.p.clone()
                const currentRad = me.radian

                const frame = 15
                for (let i = 1; i < frame + 1; i++) {
                    me.r = 28 * Ease.In(1 - i / frame) // 徐々に小さく
                    yield
                }

                remodel()
                    .appearance(Bullet.Appearance.Ball)
                    .colorful(seedFrame + 100)
                    .p(currentPos)
                    .speed(10)
                    .r(6) // Ball制限: 6
                    .radian(currentRad)
                    .nway(3, T / 12)
                    .fire()

                me.life = 0
            })
            .fire()

        yield* Array(80)
    }
}
