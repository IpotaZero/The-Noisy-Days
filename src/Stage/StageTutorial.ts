import { Bullet } from "../Game/Bullet/Bullet"
import { Enemy } from "../Game/Enemy/Enemy"
import { remodel } from "../Game/Bullet/Remodel"
import { vec } from "../utils/Vec"
import { g, scorenize, T } from "../global"
import { Stage } from "./Stage"
import { isSmartPhone } from "../utils/Functions/isSmartPhone"
import { SE } from "../SE"
import { flash } from "../utils/shake"
import { Dom } from "../Dom"

import * as Curves from "../utils/Functions/Curves"

export default class extends Stage {
    protected *G(): Generator<void, void, unknown> {
        yield* this.wait(30)

        this.changeBackground("asset/background/buildings.png")

        yield* this.text("プラスチック混じりの砂嵐の吹き荒れる、嘗ては都市だったであろう廃墟群。")
        yield* this.text("虫の羽音の様な騒音と共に小さな人影が飛び去って行く。")

        this.changeBackground(undefined)

        yield* this.text("『こちら本部、シオン、聴こえるか。』", { name: "本部" })
        yield* this.text("「こちらシオン、聴こえるよ。」", { name: "シオン" })

        yield* this.text("酷くノイズの掛かった声がスピーカを通して流れてくる。")
        yield* this.text(
            "『これより高ジャミング地帯へと突入するため通信は途切れる。念のため作戦を復唱せよ。作戦は……』",
            { name: "本部" },
        )
        yield* this.text("「言わなくても分かってる。作戦は……」", { name: "シオン" })

        // ここでドローンが飛び出す
        const e = new EnemyTutorial()
        g.enemies.push(e)

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

        yield* this.text("自機の当たり判定は赤丸のみ")
        yield* this.text("敵自体に当たり判定は無い")

        e.start()

        yield* this.waitDefeatEnemy()
        scorenize()
        flash(Dom.container)
        SE.crush.play()
    }
}

class EnemyTutorial extends Enemy {
    constructor() {
        super(400, 64)

        this.isInvincible = true

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

        remodel([new Bullet()])
            .colorful(this.frame)
            .p(this.p.clone())
            .speed(8)
            .aim(g.player.p)
            .nway(6, T / 12)
            .fire()

        yield* Array(30)
    }

    *H() {
        this.p = Curves.lissajous(
            g.width * 0.8,
            g.height / 3,
            3,
            4,
        )((this.frame - 60) / 120).plus(vec(0, -g.height / 4))
        yield
    }
}
