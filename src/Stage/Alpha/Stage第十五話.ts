import { Stage } from "../Stage"

export default class extends Stage {
    protected *G(): Generator<void, void, unknown> {
        yield* this.wait(30)

        yield* this.text(`「よお。」`, { name: "マス" })
        yield* this.text(`「……新聞屋さん、茶化しに来た?」`, { name: "シオン" })
        yield* this.text(`「いや。」`, { name: "マス" })
        yield* this.text(`珍しく、マスは煙草に火を点けなかった。`)

        yield* this.text(`「アオに、最後に取材した時のこと、話してなかったよな。」`, { name: "マス" })
        yield* this.text(`「聞きたくない。」`, { name: "シオン" })
        yield* this.text(`「勝手に話す。」`, { name: "マス" })

        yield* this.text(`「……あいつは、最後まで人は分かり合えるって言ってたぜ。」`, { name: "マス" })
        yield* this.text(`「……そうだろうね。でも、そうじゃなかったんだ。」`, { name: "シオン" })
        yield* this.text(`「だが、あいつはそれを信じて、あの女に手を伸ばしたまま死んだ。」`, { name: "マス" })
        yield* this.text(`「……。」`, { name: "シオン" })
        yield* this.text(`「…………。」`, { name: "シオン" })
        yield* this.text(`「……あたしも、分かり合えると思ってた。きっとみんな、分かり合おうとすれば分かり合えると思ってたんだ。」`, { name: "シオン" })
        yield* this.text(`「だけど、ほんとはそんなことはなくて、あたし達は傷つけあうばかりだって、知った。」`, { name: "シオン" })
        yield* this.text(`「ならいっそ、SILOに飲み込まれた方が幸せか?」`, { name: "マス" })
        yield* this.text(`「それがダメだってことは歴史が証明してる。でも、じゃあ、」`, { name: "シオン" })
        yield* this.text(`少女はそこで言葉に詰まった。`)
        yield* this.text(`マスは急かさなかった。ただ、待った。`)

        yield* this.text(`「……傷つけあうのは、たぶん、やめられない。」`, { name: "シオン" })
        yield* this.text(`「ああ。」`, { name: "マス" })
        yield* this.text(`「だったら、せめて、」`, { name: "シオン" })

        yield* this.text(`その先は、言葉にならなかった。`)

        yield* this.text(`「……は?」`, { name: "シオン" })
        yield* this.text(`知らぬ間に、涙が流れていた。`)
        yield* this.text(`自分の頬を触って、初めて気づいたらしかった。`)
        yield* this.text(`「……っ、こんなっ。」`, { name: "シオン" })
        yield* this.text(`「泣いてもいいだろ、別に。」`, { name: "マス" })
        yield* this.text(`「こんなっ体液なんかでっ。」`, { name: "シオン" })

        yield* this.text(`マスは何も言わず、煙草の箱を少女の方へ放った。`)
        yield* this.text(`「……いらないって。」`, { name: "シオン" })
        yield* this.text(`「泣き止むまで、そこに置いとくだけだ。」`, { name: "マス" })

        yield* this.text(`「……大丈夫。最後まで戦える。」`, { name: "シオン" })
    }
}
