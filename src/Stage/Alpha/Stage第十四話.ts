import { Stage } from "../Stage"

export default class extends Stage {
    protected *G(): Generator<void, void, unknown> {
        yield* this.wait(30)

        yield* this.text(`南への出撃で、少女は一瞬、照準を外した。`)
        yield* this.text(`敵機のシルエットに、レイの顔がちらついた。それだけだった。`)
        yield* this.text(`その一瞬の隙を、庇ったのはテルだった。`)

        yield* this.text(`帰還後、テルは撃ち抜かれた腕を吊っていた。`)
        yield* this.text(`「……ごめん。」`, { name: "シオン" })
        yield* this.text(`「別に。」`, { name: "テル" })
        yield* this.text(`「噓じゃん、痛そうじゃん。」`, { name: "シオン" })
        yield* this.text(`「痛いよ。だから、次は気を抜くな。」`, { name: "テル" })

        yield* this.text(`「知り合いが、向こうにいて。それで……。」`, { name: "シオン" })
        yield* this.text(`「知ってる。」`, { name: "テル" })
        yield* this.text(`「……。」`, { name: "シオン" })

        yield* this.text(`「悪いが、それを聞いてやれるほど、こっちも暇じゃない。」`, { name: "テル" })
        yield* this.text(`テルはそれだけ言って、片手のまま歩いていった。`)

        yield* this.text(`責めているわけじゃないと、頭では分かっていた。<br>それでも、伸ばした手を払われたような気がした。`)
    }
}
