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
        yield* this.text(`「殺したら、世論が悪くなる。」`, { name: "アオ" })

        yield* this.text(`「甘くない?」`, { name: "シオン" })
        yield* this.text(`「現実を見てるだけさ。」`, { name: "アオ" })
        yield* this.text(`アオは笑った。疲れた笑い方だった。`)

        yield* this.text(`「……だけど、どうしてもSILOは破壊しないと。」`, { name: "アオ" })
        yield* this.text(`「歴史を繰り返すわけにはいかない。」`, { name: "アオ" })
        yield* this.text(`「歴史?」`, { name: "シオン" })
        yield* this.text(`「前世紀の大戦の原因とアナロジーだろう? SILOは。」`, { name: "アオ" })
        yield* this.text(`「理屈的には争いをなくせるが、絶対はないからね。」`, { name: "アオ" })

        yield* this.text(`アオはゆっくりと伸びをした。`)
        yield* this.text(`少女は装備を担ぎながらアオの言葉を咀嚼していた。`)
    }
}
