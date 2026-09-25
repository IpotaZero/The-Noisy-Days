import { Stage } from "../Stage"

export default class extends Stage {
    protected *G(): Generator<void, void, unknown> {
        yield* this.wait(30)

        yield* this.text(`漏れた情報の分だけ、迎撃はいつもより苛烈だった。`)
        yield* this.text(`シオンは無我夢中で機体を振り回していたが、照準はどこか上滑りしていた。`)

        yield* this.text(`敵機のシルエットに、一瞬だけレイの顔がちらついた。`)
        yield* this.text(`(……何であたし、今これ撃ってるんだっけ。)`)
        yield* this.text(`SILOを憎んでいたはずだった。<br>でも今、目の前にいるのは誰で、何のために墜としてるんだろう。`)

        yield* this.text(`考え込んだ一瞬の隙を、庇ったのはテルだった。`)

        yield* this.text(`帰還後、テルは撃ち抜かれた腕を吊っていた。`)
        yield* this.text(`「……ごめん。」`, { name: "シオン" })
        yield* this.text(`「別に。」`, { name: "テル" })
        yield* this.text(`「噓じゃん、痛そうじゃん。」`, { name: "シオン" })
        yield* this.text(`「痛いよ。だから、次は気を抜くな。」`, { name: "テル" })

        yield* this.text(`「……あたし、何のために戦ってるんだろう。」`, { name: "シオン" })
        yield* this.text(`「アオがいなくなって、仲間同士でいがみ合って。」`, { name: "シオン" })

        yield* this.text(`「悪いが、それを聞いてやれるほど、こっちも暇じゃない。」`, { name: "テル" })
        yield* this.text(`テルはそれだけ言って、片手のまま歩いていった。`)

        yield* this.text(`責めているわけじゃないと、頭では分かっていた。<br>それでも、伸ばした手を払われたような気がした。`)
    }
}
