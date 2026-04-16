import { Stage } from "../Stage"

export default class extends Stage {
    protected *G(): Generator<void, void, unknown> {
        yield* this.wait(30)

        // 柳川 俊介

        yield* this.text("「ドーモ。ヤナガワさん。僕です。」", { name: "マス" })
        yield* this.text("「またアンタか……。なんで何時も場所が分かるかな。」", { name: "ヤナガワ" })

        yield* this.text("シュンスケ・ヤナガワ 当局のSILO推進派のトップ")

        yield* this.text("「先日、ササキさんにも話を聞いてきたんですよ。」", { name: "マス" })
        yield* this.text("「相手もそう思ってるっぽかったですよ。<br>『SILOは合成人を絶滅させる手段に成り得る』と。」", { name: "マス" })
        yield* this.text("「……。」", { name: "ヤナガワ" })
        yield* this.text("「まあ当局からしたら都合は良いですもんね。大戦の遺産を消せるなら。」", { name: "マス" })
        yield* this.text("「だが奴らはアイツらとも手を組んだ。」", { name: "ヤナガワ" })
        yield* this.text("「『日本を取り戻す』とかいう奴ですか。名前に反してアナキストの。」", { name: "マス" })
        yield* this.text("「<ruby>あの合成人<rt>ササキ</rt></ruby>が先制攻撃なんかしないだろ。奴らが世論に耐えられなくなってる証拠だ。あんたも煽るのは程々にしてくれよ。」", { name: "ヤナガワ" })

        // yield* this.text("「しっかし、知ってます? あの子の事。」", { name: "マス" })
        // yield* this.text("「……ああ、例の少年兵か。」", { name: "ヤナガワ" })
        // yield* this.text("「TAMAMUSHIは何を考えているのやら。」", { name: "マス" })
        // yield* this.text("「分かり合えない事も在るだろうさ。」", { name: "ヤナガワ" })

        // todo アナキストの話
    }
}
