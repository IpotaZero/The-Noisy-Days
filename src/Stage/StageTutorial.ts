import { Bullet } from "../Game/Bullet"
import { Enemy } from "../Game/Enemy"
import { remodel } from "../Game/Remodel"
import { vec } from "../utils/Vec"
import { g, T } from "../global"
import { Stage } from "./Stage"
import { Curves } from "../utils/Curves"

export default class extends Stage {
    protected *G(): Generator<void, void, unknown> {
        yield* this.wait(30)

        yield* this.text("プラスチック混じりの砂嵐の吹き荒れる、嘗ては都市だったであろう廃墟群。")
        yield* this.text("虫の羽音の様な騒音と共に小さな人影が飛び去って行く。")

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
        } else {
            yield* this.text("矢印キーで移動")
            yield* this.text("Shiftキーで低速移動")
            yield* this.text("Controlキーで高速移動")
        }

        e.start()

        yield* this.waitDefeatEnemy()
        yield* this.clear()
    }
}

function isSmartPhone() {
    return !!navigator.userAgent.match(/iPhone|Android.+Mobile/)
}

class EnemyTutorial extends Enemy {
    private readonly orbit

    private started = false

    constructor() {
        super(200)

        this.orbit = Curves.Lissajous(g.width * 0.8, g.height / 3, 3, 4).curve

        this.moveTo(vec(0, -g.height / 4), 60)
    }

    start() {
        this.started = true
    }

    *G() {
        if (!this.started) {
            this.life = 200
            yield
            return
        }

        remodel([new Bullet()])
            .colorful(this.frame)
            .p(this.p.clone())
            .speed(8)
            .radian(T / 4)
            .nway(7, T / 12)
            .fire()

        yield* Array(10)
    }

    *H() {
        this.p = this.orbit((this.frame - 60) / 120).point.plus(vec(0, -g.height / 4))
        yield
    }
}
