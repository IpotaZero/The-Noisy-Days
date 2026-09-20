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

        yield* this.text(`「面会だった。相手側の代表と、テントで二人きり。」`, { name: "テル" })
        yield* this.text(`「その場に、あの女が紛れ込んでた。」`, { name: "テル" })

        this.changeBackground("asset/background/black.png")
        yield* this.wait(30)

        yield* this.text(`『……あなた、また来たの。』`, { name: "アオ" })
        yield* this.text(`合成人の女性が、隠し持った刃物を握りしめていた。`)
        yield* this.text(`『あの子を看板にして、いつまで続けるつもり?』`)
        yield* this.text(`『矢面に立たせて、あんたは後ろで演説してるだけ。』`)
        yield* this.text(`『待って、話を───』`, { name: "アオ" })
        yield* this.text(`『もう、聞き飽きた。』`)

        yield* this.wait(30)
        this.changeBackground(undefined)
        yield* this.wait(30)

        yield* this.text(`テルはそこで言葉を切った。`)
        yield* this.text(`「……それだけだ。」`, { name: "テル" })

        yield* this.text(`「あの女……前に居住区の前で、あんたを睨んでた奴だ。」`, { name: "テル" })
        yield* this.text(`「……。」`, { name: "シオン" })

        yield* this.text(`「話せば分かるって、いつも言ってたのに。」`, { name: "シオン" })
        // yield* this.text(`「ああ。」`, { name: "テル" })
        // yield* this.text(`「味方だったはずの人に、殺されたんだね。」`, { name: "シオン" })
        yield* this.text(`テルは何も言わなかった。答えを持っている人間は、もうどこにもいなかった。`)

        yield* this.text(`少女はその場に座り込んだ。<br>装備を脱ぐ気力さえ、しばらく戻ってこなかった。`)
    }
}
