import { Stage } from "../Stage"

export default class extends Stage {
    protected *G(): Generator<void, void, unknown> {
        yield* this.wait(30)

        yield* this.text(`キャンプに戻ると、今度は別の怒声が響いていた。`)
        yield* this.text(`土着派の一団が、合成人の居住区の前に押しかけていた。`)

        yield* this.text(`「そもそも、お前らみたいな作り物が居るから、SILOが調子に乗るんや。」`, { name: "土着派の男" })
        yield* this.text(`「日本を取り戻すんに、お前らは要らん。」`, { name: "土着派の男" })

        yield* this.text(`合成人の一人が前に出て、胸ぐらを掴む。<br>一瞬で、乱闘寸前の空気になった。`)

        yield* this.text(`「やめろ! やめないか!」`, { name: "アオ" })
        yield* this.text(`アオが二人の間に体ごと割って入る。<br>殴り飛ばされかけて、それでも退かなかった。`)

        yield* this.text(`場が渋々収まる中、列の端にいたあの女性が、静かに口を開いた。`)
        yield* this.text(`「……アオさん。あなた、いつも自分の身体を張るけど。」`, { name: "合成人の女性" })
        yield* this.text(`「矢面に立たされてるのは、いつもあの子でしょう。」`, { name: "合成人の女性" })

        yield* this.text(`視線の先に、離れて様子を見ていたシオンがいた。`)
        yield* this.text(`「……何、言ってんの。」`, { name: "シオン" })
        yield* this.text(`「あんたには、まだ分からないでしょうね。」`, { name: "合成人の女性" })

        yield* this.text(`女性はそれ以上何も言わず、人混みに紛れて消えた。`)
        yield* this.text(`アオは、その背中を、少しの間だけ目で追っていた。`)
    }
}
