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
import * as Curves from "../../utils/Functions/Curves"
import { Ease } from "../../utils/Functions/Ease"

export default class extends Stage {
    protected *G(): Generator<void, void, unknown> {
        yield* this.wait(30)

        // 1. 固定支点（コア）
        const anchor = new Anchor()

        // 2. 元の振り子アーム構造（4段の数珠つなぎ）
        const arm1 = new Arm(anchor, { hp: 100, r: 48 })
        const arm2 = new Arm(arm1, { hp: 100, r: 40 })
        const arm3 = new Arm(arm2, { hp: 100, r: 32 })
        const arm4 = new Arm(arm3, { hp: 100, r: 26 })

        // 3. 追加の衛星システム
        // コア（anchor）の周りをまわる 4基の子機
        const satellites = [0, 1, 2, 3].map((i) => new Satellite(anchor, i))
        // 各子機の周りをまわる 3基の孫機
        const subSatellites = satellites.flatMap((s) => [0, 1, 2].map((j) => new SubSatellite(s, j)))

        g.enemies.push(anchor, arm1, arm2, arm3, arm4, ...satellites, ...subSatellites)

        yield* this.waitDefeatEnemy()
        scorenize()
        flash(Dom.container)
        shake(Dom.container, 750, 8)
    }
}

/**
 * 支点コア：リサージュ移動 ＋ 一方向矩形ビーム
 */
class Anchor extends Enemy {
    private readonly curve = Curves.lissajous(g.width * 0.45, g.height / 6, 5, 6)
    protected margin: number = 60

    constructor() {
        super(600, 56, new EnemyRendererCore(), { remainingCharge: 1200 })
        this.p = vec(0, -g.height * 2)
        this.moveTo(vec(0, -g.height / 5), 60)
    }

    *G() {
        this.p = this.curve((this.frame - 60) / 360).plus(vec(0, -g.height / 5))
        yield
    }

    *H() {
        yield* this.waitCharge()

        remodel()
            .p(this.p.clone())
            .beam(this, 0)
            .radian(T / 8)
            .ex(4)
            .g(function* (me, i) {
                yield* Remodel.ease(me, "length", g.height, 30, Ease.Out)
                yield* Array(30)
                yield* Remodel.ease(me, "radian", (T / 4) * i + T / 8 + T / 4, 360, Ease.Out)
                yield* Remodel.fadeout(me, 30)
            })
            .fire()

        yield* Array(480)
    }
}

/**
 * 振り子アーム：前のEnemyを支点として旋回
 */
class Arm extends Enemy {
    constructor(parent: Enemy, { hp = 300, r = 36 }) {
        super(hp, r, new EnemyRendererMob())
        // StageFog 本来の連結ロジック
        this.setParent(parent, () => vec.arg((this.frame / r) * 4).scaled(r * 2))
    }

    *G() {
        remodel()
            .appearance(Bullet.Appearance.Ball)
            .r(28)
            .colorful(this.frame)
            .p(this.p.clone())
            .aim(g.player.p)
            .speed(4)
            //
            .fire()
        yield* Array(60)
    }
}

/**
 * 子機衛星：コアの周囲を一定距離で旋回
 */
class Satellite extends Enemy {
    constructor(
        parent: Enemy,
        private readonly index: number,
    ) {
        super(200, 64, new EnemyRendererMob(), { remainingCharge: 600 })
        this.setParent(parent, () => vec.arg((this.frame / 360) * T + (this.index * T) / 4).scaled(280))
    }

    *G() {
        yield* this.waitCharge()
        remodel()
            .p(this.p.clone())
            .colorful(this.frame)
            .radian(T / 4)
            .nway(13, T / 16)
            .fire()
        yield* Array(45)
    }
}

/**
 * 孫機衛星：子機の周囲を旋回
 */
class SubSatellite extends Enemy {
    constructor(
        parent: Enemy,
        private readonly index: number,
    ) {
        super(50, 48, new EnemyRendererMob())
        this.setParent(parent, () => vec.arg((-this.frame / 240) * T + (this.index * T) / 3).scaled(96))
    }

    *G() {
        remodel()
            .appearance(Bullet.Appearance.Arrow)
            .collision(Bullet.Collision.Arrow)
            .colorful(this.frame)
            .p(this.p.clone())
            .speed(9)
            .r(28)
            .aim(g.player.p)
            //
            .fire()
        yield* Array(40)
    }
}
