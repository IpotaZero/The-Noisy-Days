import { Stage } from "../Stage"

export default class extends Stage {
    protected *G(): Generator<void, void, unknown> {
        yield* this.wait(30)

        yield* this.text(`「今日の的は、ヤナガワの視察団だ。」`, { name: "アオ" })
        yield* this.text(`アオが地図を広げながら言った。テントの中、彼が直接指示を出すのは珍しかった。`)
        yield* this.text(`「新聞に載ってる、あのおっさん?」`, { name: "シオン" })
        yield* this.text(`「そう。SILO政策のトップだ。」`, { name: "アオ" })

        yield* this.text(`「殺すの?」`, { name: "シオン" })
        yield* this.text(`「いや。護衛を落として、追い返すだけでいい。」`, { name: "アオ" })
        yield* this.text(`「殺したら、僕らは本当にただのテロリストだ。」`, { name: "アオ" })

        yield* this.text(`「甘くない?」`, { name: "シオン" })
        yield* this.text(`「甘いよ。」`, { name: "アオ" })
        yield* this.text(`アオは笑った。疲れた笑い方だった。`)

        yield* this.text(`「でも、僕がそこで甘さを捨てたら、君を担ぎ出した理由も消える。」`, { name: "アオ" })
        yield* this.text(`「……よく分かんない。」`, { name: "シオン" })
        yield* this.text(`「分からなくていいよ。ただ、殺さないでくれ。それだけ覚えてて。」`, { name: "アオ" })

        yield* this.text(`少女は装備を担ぎながら、初めて、この人の弱さを見た気がした。`)
    }
}
