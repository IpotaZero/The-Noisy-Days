import { Stage } from "../Stage"

export default class extends Stage {
    protected *G(): Generator<void, void, unknown> {
        yield* this.wait(30)

        yield* this.text("教室の喧騒は、シオンの周りだけを避けるように流れている。")
        yield* this.text("『ねえ、SILOが来たら、この机どうなるのかな。』", { name: "子供" })
        yield* this.text("『新しい子が来るんじゃない? ほら、もっと普通の。』", { name: "子供" })

        yield* this.text("目の前に座っているシオンを、彼らの視線は透過していく。")
        // yield* this.text("彼女はまだここに居る。だが、彼らの中では既に『整理済みの過去』なのだ。")

        // 忘れ物の受け渡し
        yield* this.text("『……あの。』", { name: "シオン" })
        yield* this.text("シオンが差し出したプリントに、レイは視線すら向けない。")

        yield* this.text("『……それ、先生から。』", { name: "シオン" })

        yield* this.text("レイは空中に浮いた紙を掴むような手つきでそれを受け取った。")
        yield* this.text("『……あ、そ。』", { name: "レイ" })

        yield* this.text("『……。』", { name: "シオン" })

        // 背景変更

        // 先生
        yield* this.text("『……と云うことで、ついに我々の町にもSILOがやってくるわけです。皆さん、大いに喜びましょう!』", { name: "先生" })
        yield* this.text("大人たちが拍手を始める。それを真似して子供たちも手を叩く。")
        // 子どもたちはよく分かっていない
        // 分かり合えない人というものを理解していないから
        yield* this.text("それでもシオンはきっと居なくなるだろうというのは子供たちの共通認識であった。")

        // レイ
        yield* this.text("『先生。』", { name: "レイ" })
        yield* this.text("『合成人とは、分かり合えないものなのですか。』", { name: "レイ" })
        yield* this.text("『当たり前だろう。新人類なんだよ。』", { name: "先生" })

        yield* this.text("その夜")
        yield* this.text("『ねえっ、どこいくのっ。』", { name: "シオン" })
        yield* this.text("『どこかっ、大人のいないところっ。』", { name: "レイ" })
        yield* this.text("『どうしてっ、あんたがっ!』", { name: "シオン" })
        yield* this.text("『きゃあっ!』", { name: "レイ" })
        yield* this.text("『ああ、良かった。さあ、親御さんの所へ……』", { name: "警察" })
        yield* this.text("『大人なんてっ、話し合うことを諦めた馬鹿ばっかだ!』", { name: "レイ" })
        yield* this.text("『やめて! さよならなんて言わせないで!』", { name: "レイ" })
    }
}
