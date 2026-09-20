import { Stage } from "../Stage"

export default class extends Stage {
    protected *G(): Generator<void, void, unknown> {
        yield* this.wait(30)

        yield* this.text(`アオがいなくなってから、テントの中の声はいつも尖っていた。`)
        yield* this.text(`「今度は南だ。SILOの補給線を叩く。看板も連れて行く。」`, { name: "ヨウ" })
        yield* this.text(`「補給線の裏は住宅区だぞ。」`, { name: "テル" })
        yield* this.text(`「上等だ。アオを殺ったのはあっち側だ。」`, { name: "ヨウ" })

        yield* this.text(`少女は初めて聞く話だった。`)
        yield* this.text(`「ちょっと待って。看板って、あたしのこと?」`, { name: "シオン" })
        yield* this.text(`「決まってるだろ。TAMAMUSHIの顔が出りゃ、住民だって多少は黙る。」`, { name: "ヨウ" })

        yield* this.text(`「あたしは行くなんて言ってない。」`, { name: "シオン" })
        yield* this.text(`「言う必要ない。決まったことだ。」`, { name: "ヨウ" })

        yield* this.text(`テルが割って入った。`)
        yield* this.text(`「本人の意思も聞かずに勝手に……」`, { name: "テル" })
        yield* this.text(`「お前が甘やかしすぎたんだよ、テル。」`, { name: "ヨウ" })

        yield* this.text(`二人は睨み合ったまま、しばらく動かなかった。<br>その間、少女に話しかける者は誰もいなかった。`)
        yield* this.text(`まるで、そこに置物でもあるかのように。`)

        yield* this.text(`「……あたしの話、してるんだよね。」`, { name: "シオン" })
        yield* this.text(`誰も答えなかった。`)
    }
}
