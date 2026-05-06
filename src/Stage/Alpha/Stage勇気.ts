import { Stage } from "../Stage"

export default class extends Stage {
    protected *G(): Generator<void, void, unknown> {
        yield* this.wait(30)

        yield* this.text("「それでも……、分かりたいと、思ったから。」", { name: "レイ" })
        yield* this.text("「アイツが何を感じていたのかなんてのはもう分からないから、せめて、今の気持ちを、知りたい。」", { name: "レイ" })
        yield* this.text("「そのためだったら私はどんな倫理だって乗り越えてやるよ。」", { name: "レイ" })

        // 仮面ライダーを反転させてみる。
        // 仮面ライダーのテーマは「人間と非人間の分かり合い」「命の大切さ」「人の善意を信じる事」だと思う。
        // これを反転させる。
        // 「人間同士のいがみ合い」「命の浪費」「人の善意の滑稽さ」
        // これらは「人は決して分かり合えない」「戦争」「会話のかみ合わなさ」として表現する。
        // これガンダムじゃね？
    }
}
