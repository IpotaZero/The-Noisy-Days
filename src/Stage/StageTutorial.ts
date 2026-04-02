import { Bullet } from "../Game/Bullet/Bullet"
import { Enemy } from "../Game/Enemy/Enemy"
import { remodel } from "../Game/Bullet/Remodel"
import { vec } from "../utils/Vec"
import { g, scorenize, T } from "../global"
import { Stage } from "./Stage"
import { isSmartPhone } from "../utils/Functions/isSmartPhone"
import { SE } from "../SE"
import { flash, shake } from "../utils/shake"
import { Dom } from "../Dom"

import * as Curves from "../utils/Functions/Curves"
import { EnemyRendererMob } from "../Game/Enemy/EnemyRendererMob"

export default class extends Stage {
    protected *G(): Generator<void, void, unknown> {
        yield* this.wait(30)

        this.changeBackground("asset/background/buildings.png")

        yield* this.text("プラスチック混じりの砂嵐の吹き荒れる、嘗ては都市だったであろう廃墟群。")
        yield* this.text("虫の羽音めいた騒音と共に小さな人影が飛び去って行く。")

        this.changeBackground(undefined)

        yield* this.text("『こちら本部、シオン、聴こえるか。』", { name: "本部" })
        yield* this.text("「こちらシオン、聴こえるよ。」", { name: "シオン" })

        yield* this.text("酷くノイズの掛かった声がスピーカを通して流れてくる。")
        yield* this.text("『これより高ジャミング地帯へと突入するため通信は途切れる。復唱せよ。作戦は……』", { name: "本部" })
        yield* this.text("「言わなくても分かってる。作戦は……」", { name: "シオン" })

        // ここでドローンが飛び出す
        const e = new EnemyTutorial()
        const c = new Child(e)
        g.enemies.push(e)
        g.enemies.push(c)

        yield* this.text("「……敵飛行体の殲滅ッ！」", { name: "シオン" })

        // 操作説明
        if (isSmartPhone()) {
            yield* this.text("画面をスライドして移動")
            yield* this.text("2本指タップで自爆")
        } else {
            yield* this.text("矢印キーで移動<br>Shiftで低速移動")
            yield* this.text("Controlで0.5秒間高速移動(無敵)<br>チャージに2秒掛かる")
            yield* this.text("Escapeで自爆")
        }

        yield* this.text("自機の当たり判定は赤丸のみ<br>敵自体に当たり判定は無い")
        yield* this.text("盾は8枚ある")

        e.start()
        c.start()

        yield* this.waitDefeatEnemy()
        scorenize()
        flash(Dom.container)
        shake(Dom.container)
    }
}

class EnemyTutorial extends Enemy {
    private readonly curve = Curves.lissajous(g.width * 0.8, g.height / 3, 3, 4)

    constructor() {
        super(400, 64)

        this.isInvincible = true

        this.p = vec(g.width / 2, -g.height / 2)
        this.moveTo(vec(0, -g.height / 4), 60)
    }

    start() {
        this.isInvincible = false
    }

    *G() {
        if (this.isInvincible) {
            yield
            return
        }

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
        super(300, 48, new EnemyRendererMob())
        this.setParent(parent, () => vec.arg(this.frame / 60).scaled(150))
        this.isInvincible = true
    }

    start() {
        this.isInvincible = false
    }
}
