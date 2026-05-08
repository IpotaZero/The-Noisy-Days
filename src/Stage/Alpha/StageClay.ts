import { Bullet } from "../../Game/Bullet/Bullet"
import { Enemy } from "../../Game/Enemy/Enemy"
import { Remodel, remodel } from "../../Game/Bullet/Remodel"
import { Vec, vec } from "../../utils/Vec"
import { g, scorenize, T } from "../../global"
import { Stage } from "../Stage"
import { flash, shake } from "../../utils/shake"
import { Dom } from "../../Dom"

import { EnemyRendererCore } from "../../Game/Enemy/EnemyRendererCore"
import { EnemyRendererFunnel } from "../../Game/Enemy/EnemyRendererFunnel"
import { EnemyRendererMine } from "../../Game/Enemy/EnemyRendererMine"
import { EnemyRendererMob } from "../../Game/Enemy/EnemyRendererMob"
import * as Curves from "../../utils/Functions/Curves"
import { Ease } from "../../utils/Functions/Ease"

export default class extends Stage {
    protected *G(): Generator<void, void, unknown> {
        yield* this.wait(30)

        // 1. 双子の指揮官機：互いに反転したリサージュを描く
        const alpha = new CommandUnit("Alpha", 1)
        const beta = new CommandUnit("Beta", -1)

        // 3. 随伴機：各コアを護衛するファンネル
        const units = [...Array.from({ length: 3 }, (_, i) => new Escort(alpha, i)), ...Array.from({ length: 3 }, (_, i) => new Escort(beta, i))]
        const units2 = [...Array.from({ length: 4 }, (_, i) => new Escort2(alpha, i)), ...Array.from({ length: 4 }, (_, i) => new Escort2(beta, i))]

        g.enemies.push(alpha, beta, ...units, ...units2)

        yield* this.waitDefeatEnemy()
        scorenize()
        flash(Dom.container)
        shake(Dom.container, 750, 8)
    }
}

/**
 * 指揮官機：鏡像のように左右対称の動きを見せる
 */
class CommandUnit extends Enemy {
    private readonly curve = Curves.lissajous(g.width * 0.4, g.height / 5, 2, 3)

    constructor(
        public readonly id: string,
        public readonly side: number,
    ) {
        super(500, 56, new EnemyRendererCore(), { remainingCharge: 600 })
        this.p = vec(side * g.width, -g.height)
        this.moveTo(vec(side * g.width * 0.3, -g.height / 4), 60)
    }

    *G() {
        // side(1 or -1) を掛けることで左右反転の軌道を作る
        const basePos = this.curve((this.frame - 60) / 480)
        this.p = vec(basePos.x * this.side, basePos.y).plus(vec(this.side * g.width * 0.3, -g.height / 4))
        yield
    }

    *H() {
        yield* this.waitCharge()

        remodel()
            .appearance(Bullet.Appearance.Ball)
            .colorful(this.frame + 120)
            .r(28)
            .p(this.p.clone())
            .aim(vec((Math.sin(this.frame) * g.width) / 4, g.height / 2))
            .fire()

        yield* Array(80)
    }
}

/**
 * 護衛：コアの周囲を旋回し、機雷を設置して安地を潰す
 */
class Escort extends Enemy {
    constructor(
        parent: CommandUnit,
        private index: number,
    ) {
        super(100, 24, new EnemyRendererMob())
        this.setParent(parent, () => {
            const angle = (this.frame / 360) * T * parent.side + (this.index / 3) * T
            return vec.arg(angle).scaled(150)
        })
    }

    *G() {
        // 150フレームごとに、その場に機雷を「遺棄」する
        g.enemies.push(new TacticalMine(this.p.clone()))
        yield* Array(150)
    }
}

/**
 * 護衛：コアの周囲を旋回し、機雷を設置して安地を潰す
 */
class Escort2 extends Enemy {
    constructor(
        parent: CommandUnit,
        private index: number,
    ) {
        super(100, 32, new EnemyRendererMob(), { margin: 30 + index * 30 })
        this.setParent(parent, () => {
            const angle = -(this.frame / 360) * T * parent.side + (this.index / 4) * T
            return vec.arg(angle).scaled(200)
        })
    }

    *G() {
        remodel()
            .appearance(Bullet.Appearance.Line)
            .collision(Bullet.Collision.Line)
            .colorful(this.frame + this.index * 30)
            .r(28)
            .p(this.p.clone())
            .speed(24)
            .ex(31)
            .delayByIndex()
            .g((me, i) => Remodel.reaccel(me, 15, 45 - i, 30, 16))
            //
            .fire()

        remodel()
            .appearance(Bullet.Appearance.Line)
            .collision(Bullet.Collision.Line)
            .colorful(this.frame + this.index * 30)
            .r(28)
            .p(this.p.clone())
            .speed(16)
            .ex(31)
            .forEach((me) => {
                me.radian += T / 2
            })
            .delayByIndex()
            .g((me, i) => Remodel.reaccel(me, 15, 45 - i, 30, 16))
            //
            .fire()

        yield* Array(240)
    }
}

/**
 * 戦術機雷：静止し、一定時間後に美しい幾何学弾幕を展開
 */
class TacticalMine extends Enemy {
    constructor(pos: Vec) {
        super(20, 32, new EnemyRendererMine(), { margin: 0 })
        this.p = pos

        this.mine(300, () => {
            remodel()
                .appearance(Bullet.Appearance.Ball)
                .r(6)
                .p(this.p.clone())
                .colorful(this.frame)
                .speed(5)
                .ex(53)
                //
                .fire()
        })
    }

    *G() {
        this.p.y += 6
        yield
    }
}
