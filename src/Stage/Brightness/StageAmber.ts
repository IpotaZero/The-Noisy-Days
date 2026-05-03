import { Bullet } from "../../Game/Bullet/Bullet"
import { Enemy } from "../../Game/Enemy/Enemy"
import { Remodel, remodel } from "../../Game/Bullet/Remodel"
import { vec } from "../../utils/Vec"
import { g, scorenize, T } from "../../global"
import { Stage } from "../Stage"
import { flash, shake } from "../../utils/shake"
import { Dom } from "../../Dom"

import { EnemyRendererMob } from "../../Game/Enemy/EnemyRendererMob"
import { EnemyRendererCore } from "../../Game/Enemy/EnemyRendererCore"
import { Ease } from "../../utils/Functions/Ease"

export default class extends Stage {
    protected *G(): Generator<void, void, unknown> {
        yield* this.wait(30)

        const core = new Core()
        const wings = [new Wing(core, 0), new Wing(core, 1)]
        const turrets = wings.flatMap((w, wi) => Array.from({ length: 13 }, (_, i) => new Turret(w, wi, i)))

        g.enemies.push(core, ...wings, ...turrets)

        yield* this.waitDefeatEnemy()
        scorenize()
        flash(Dom.container)
        shake(Dom.container, 750, 8)
    }
}

/**
 * コア
 * 画面上部を左右に往復する。シンプルな動きで弾幕を読みやすくする。
 * 2種の攻撃を交互に使う。
 * - 奇数回: 13方向回転小ボール
 * - 偶数回: 5-way狙い矢印
 */
class Core extends Enemy {
    private shotCount = 0

    constructor() {
        super(900, 64, new EnemyRendererCore(), { remainingCharge: 1200, margin: 60 })
        this.p = vec(0, -g.height * 2)
        this.moveTo(vec(0, -g.height / 4), 60)
    }

    *G() {
        yield* this.moveTo(vec(g.width * 0.35, -g.height / 4), 120, Ease.InOut)
        yield* this.moveTo(vec(-g.width * 0.35, -g.height / 4), 240, Ease.InOut)
        yield* this.moveTo(vec(0, -g.height / 4), 120, Ease.InOut)
    }

    *H() {
        yield* this.waitCharge()

        const frame = 60

        const p = this.p.clone()

        for (let i = 0; i < frame; i++) {
            remodel()
                .colorful(this.frame)
                .p(p.plus(vec.arg(T * (i / frame)).scaled(200)))
                .radian(T * (i / frame))
                .speed(-8)
                .g(function* (me, j) {
                    yield* Array(30)
                    yield* Remodel.reaccel(me, 30, frame - j, 30, 8)
                })
                .fire()
            yield
        }

        yield* Array(120)

        this.shotCount++
    }
}

/**
 * ウィング（×2）
 * コアの左右に固定。コアが往復するのに合わせて一緒に動く。
 * 小ボール(r=6)を7方向に放射。左右で回転方向を逆にして
 * 画面全体に弾が広がる。
 */
class Wing extends Enemy {
    constructor(
        core: Core,
        private readonly index: number, // 0=左 1=右
    ) {
        super(400, 48, new EnemyRendererMob())
        this.setParent(core, () => vec((index === 0 ? -1 : 1) * 220, 0))
    }

    *G() {
        const dir = this.index === 0 ? 1 : -1

        remodel()
            .appearance(Bullet.Appearance.Ball)
            .colorful(this.frame * 2 + this.index * 90)
            .p(this.p.clone())
            .speed(7)
            .radian(T * (this.frame / 240) * dir)
            .r(6)
            .ex(7)
            .g((me) => Remodel.appear(me, 8))
            .fire()

        yield* Array(40)
    }
}

/**
 * タレット（各ウィングに×2、計4基）
 * ウィングの上下に配置。狙い矢印を単発で撃つ。
 * 4基で発射間隔をずらす（60 / 80 / 100 / 120f）ことで
 * 攻撃が均等にばらける。
 */
class Turret extends Enemy {
    private readonly interval: number

    constructor(
        wing: Wing,
        wingIndex: number,
        private readonly index: number, // 0=上 1=下
    ) {
        super(150, 30, new EnemyRendererMob(), { remainingCharge: 600 })
        this.setParent(wing, () => vec.arg(T * (index / 13) - T / 4).scaled(90))
        this.interval = Math.floor((Math.sin(index) + 1) * 30) + 30
    }

    *G() {
        yield* this.waitCharge()

        remodel()
            .appearance(Bullet.Appearance.Arrow)
            .collision(Bullet.Collision.Arrow)
            .colorful(this.frame * 3)
            .r(28)
            .p(this.p.clone())
            .aim(g.player.p)
            .speed(9)
            .g((me) => Remodel.appear(me, 8))
            .fire()

        yield* Array(this.interval)
    }
}
