import { Stage } from "../Stage"

export default class extends Stage {
    protected *G(): Generator<void, void, unknown> {
        yield* this.wait(30)

        yield* this.text(`電報の文字は、短すぎて現実味がなかった。`)
        yield* this.text(`「アオ・ササキ、死亡。」`)
        yield* this.text(`それだけだった。理由も、経緯も、何も書かれていなかった。`)

        yield* this.text(`キャンプに戻ると、テルが黙って迎えた。`)
        yield* this.text(`「……何があったの。」`, { name: "シオン" })
        yield* this.text(`テルはしばらく答えなかった。`)

        yield* this.text(`「面会だった。テントの前で、女が一人。」`, { name: "テル" })
        yield* this.text(`「非武装だって、確認は取れてた。だから誰も止めなかった。」`, { name: "テル" })

        this.changeBackground("asset/background/black.png")
        yield* this.wait(30)

        yield* this.text(`『あなたは───待ってください!』`, { name: "アオ" })
        yield* this.text(`何の変哲もない主婦が、その手に光線銃を構えていた。`)
        yield* this.text(`『どうして、本当に、戦争なんて!』`)
        yield* this.text(`『我々は話せば分かる!』`, { name: "アオ" })
        yield* this.text(`『私にも子供が居るのよ!』`)

        yield* this.wait(30)
        this.changeBackground(undefined)
        yield* this.wait(30)

        yield* this.text(`テルはそこで言葉を切った。`)
        yield* this.text(`「……それだけだ。」`, { name: "テル" })

        yield* this.text(`「……もう一つある。」`, { name: "テル" })
        yield* this.text(`「あの女も、合成人だったらしい。」`, { name: "テル" })
        yield* this.text(`「……。」`, { name: "シオン" })

        yield* this.text(`「話せば分かるって、言ったんでしょ。」`, { name: "シオン" })
        yield* this.text(`「ああ。」`, { name: "テル" })
        yield* this.text(`「なのに。」`, { name: "シオン" })
        yield* this.text(`テルは何も言わなかった。答えを持っている人間は、もうどこにもいなかった。`)

        yield* this.text(`少女はその場に座り込んだ。<br>装備を脱ぐ気力さえ、しばらく戻ってこなかった。`)
    }
}
