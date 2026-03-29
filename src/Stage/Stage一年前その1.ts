import { Stage } from "./Stage"

export default class extends Stage {
    protected *G(): Generator<void, void, unknown> {
        yield* this.wait(30)

        yield* this.text("教室の喧騒は、シオンの周りだけを避けるように流れている。")
        yield* this.text("『ねえ、SILOが来たら、この机どうなるのかな。』", { name: "子供" })
        yield* this.text("『新しい子が来るんじゃない？ ほら、もっと「普通」の。』", { name: "子供" })

        yield* this.text("目の前に座っているシオンを、彼らの視線は透過していく。")
        // yield* this.text("彼女はまだここに居る。だが、彼らの中では既に『整理済みの過去』なのだ。")

        // 忘れ物の受け渡し
        yield* this.text("『……あの。』", { name: "シオン" })
        yield* this.text("シオンが差し出したプリントに、レイは視線すら向けない。")

        yield* this.text("『……それ、先生から。』", { name: "シオン" })

        yield* this.text("レイは空中に浮いた紙を掴むような手つきでそれを受け取った。")
        yield* this.text("『……あ、そ。』", { name: "レイ" })

        yield* this.text("『……。』", { name: "シオン" })
    }
}
