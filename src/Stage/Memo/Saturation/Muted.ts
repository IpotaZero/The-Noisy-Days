import { Stage } from "../../Stage"

export default class extends Stage {
    protected *G(): Generator<void, void, unknown> {
        yield* this.wait(30)

        // 柳川 俊介
        yield* this.text("「ドーモ。ヤナガワさん。僕です。」", { name: "マス" })
        yield* this.text("「またアンタか……。なんで何時も場所が分かるかな。」", { name: "ヤナガワ" })

        yield* this.text("シュンスケ・ヤナガワ 当局のSILO推進派のトップ")

        yield* this.text("「先日、ササキさんにも話を聞いてきたんですよ。」", { name: "マス" })
        yield* this.text("「相手もそう思ってるっぽかったですよ。<br>『SILOは合成人を絶滅させる手段に成り得る』と。」", {
            name: "マス",
        })
        yield* this.text("「……。」", { name: "ヤナガワ" })
        yield* this.text("「まあ当局からしたら都合は良いですもんね。大戦の遺産を消せるなら。」", { name: "マス" })
        yield* this.text("「だが奴らはアイツらとも手を組んだ。」", { name: "ヤナガワ" })
        yield* this.text("「『日本を取り戻す』とかいう奴ですか。名前に反してアナキストの。」", { name: "マス" })
        yield* this.text(
            "「<ruby>あの合成人<rt>ササキ</rt></ruby>が先制攻撃なんかしないだろ。奴らが世論に耐えられなくなってる証拠だ。あんたも煽るのは程々にしてくれよ。」",
            { name: "ヤナガワ" },
        )

        yield* this.text("「じゃあ、『日本を取り戻す会』とは、そもそも何なんです?」", { name: "マス" })
        yield* this.text("「元は、大戦で親を亡くした連中の互助会だったって話だ。」", { name: "ヤナガワ" })
        yield* this.text("「それがいつの間にか、『棲み分けそのものを認めない』方に転んだ。」", { name: "ヤナガワ" })
        yield* this.text("「皮肉なもんだ。棲み分けを一番嫌う奴らが、一番棲み分けに向いてない連中と手を組んでる。」", {
            name: "ヤナガワ",
        })

        yield* this.text("「トウキョウは、いつまでこの均衡を保てますかね。」", { name: "マス" })
        yield* this.text("「保てなくなったら、俺たちの出番が増えるだけだ。」", { name: "ヤナガワ" })
        yield* this.text("「制圧、というやつですか。」", { name: "マス" })
        yield* this.text("「聞こえの良い言葉を使うなよ。踏み潰す、でいい。」", { name: "ヤナガワ" })

        yield* this.text("「しっかし、知ってます? あの子の事。」", { name: "マス" })
        yield* this.text("「……ああ、例の少年兵か。」", { name: "ヤナガワ" })
        yield* this.text("「TAMAMUSHIは何を考えているのやら。」", { name: "マス" })
        yield* this.text("「分かり合えない事も在るだろうさ。」", { name: "ヤナガワ" })
        yield* this.text("「それでも、子供を担ぎ出すのは、外聞が悪いでしょう。」", { name: "マス" })
        yield* this.text("「担ぎ出してるのは向こうだ。こっちは、迎え撃つだけだ。」", { name: "ヤナガワ" })
        yield* this.text("ヤナガワの声には、迷いがなかった。")
    }
}
