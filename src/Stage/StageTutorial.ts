import { Bullet } from "../Game/Bullet"
import { g } from "../global"
import { Stage } from "./Stage"

export default class extends Stage {
    protected *G(): Generator<void, void, unknown> {
        yield* this.wait(60)

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

        g.bullets.push(new Bullet())

        yield* this.text("「……敵飛行体の殲滅ッ！」", { name: "シオン" })

        // 操作説明
        if (isSmartPhone()) {
            yield* this.text("画面をスライドして移動")
        } else {
            yield* this.text("矢印キーで移動")
            yield* this.text("Shiftキーで低速移動")
            yield* this.text("Controlキーで高速移動")
        }
    }
}

function isSmartPhone() {
    return !!navigator.userAgent.match(/iPhone|Android.+Mobile/)
}
