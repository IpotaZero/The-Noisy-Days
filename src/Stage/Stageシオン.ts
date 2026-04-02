import { Stage } from "./Stage"

export default class extends Stage {
    protected *G(): Generator<void, void, unknown> {
        yield* this.wait(30)

        yield* this.text("前世紀、アルゴリズムは人の憎悪を増幅し、ついには人類を世界大戦へと導いた。")
        yield* this.text("世界中の国々が戦争継続能力を喪失して漸く終結した機械大戦。")
        yield* this.text("だが倫理と不釣り合いに増大した科学力は諍いの種を蒔いていった。")
        yield* this.text("（って所かな。）", { name: "マス" })
        yield* this.text("俺は手帳を閉じながらテントに入り、中の少女をちらと見る。")

        // 嶋 詩音
        yield* this.text("「……。」", { name: "シオン" })
        yield* this.text("シオン・シマ 第二世代合成人")
        yield* this.text("東アジア自治体、ニッポンのトウキョウという町に暮らす戦争孤児である。")

        yield* this.text("「よーお、お手柄じゃあないの。さっすが、合成人。」", { name: "マス" })
        yield* this.text("「そういう言い方、好きじゃないし嫌いだよ。何の用かな、新聞屋さん。」", { name: "シオン" })
        yield* this.text("作戦から帰還した恰好のまま、少女は床で伸びている。")
        yield* this.text("「悪ぃ悪ぃ。で、此度の戦闘はどうだったんです?」", { name: "マス" })
        yield* this.text("マスが懐から煙草を取り出し火を付けると、少女は俺の隣へ距離を詰めた。")
        yield* this.text("「あたしにもくれない?」", { name: "シオン" })
        yield* this.text("「あんた何歳だっけ。」", { name: "マス" })
        yield* this.text("「十三。」", { name: "シオン" })
        yield* this.text("「へぇー。サーティーン。世も末だね。」", { name: "マス" })
        yield* this.text("テントの中で二本の紫煙が立ち昇る。")
    }
}
