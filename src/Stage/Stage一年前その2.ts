import { Stage } from "./Stage"

export default class extends Stage {
    protected *G(): Generator<void, void, unknown> {
        yield* this.wait(60)

        // 先生
        yield* this.text("『……と云うことで、ついに我々の町にもSILOがやってくるわけです。皆さん、大いに喜びましょう!』")
        yield* this.text("大人たちが拍手を始める。それを真似して子供たちも手を叩く。")
        // 子どもたちはよく分かっていない
        // 分かり合えない人というものを理解していないから
        yield* this.text("それでもシオンはきっと居なくなるだろうというのは子供たちの共通認識であった。")

        // レイ
        yield* this.text("『先生。』")
        yield* this.text("『合成人とは、分かり合えないものなのですか。』")

        yield* this.text("『当たり前だろう。新人類なんだよ。』")

        yield* this.text("その夜")
        yield* this.text("『ねえっ、どこいくのっ。』")
        yield* this.text("『どこかっ、大人のいないところっ。』")
        yield* this.text("『どうしてっ、あんたがっ!』")
        yield* this.text("『きゃあっ!』")
        yield* this.text("『ああ、良かった。さあ、親御さんの所へ……』")
        yield* this.text("『大人なんてっ、話し合うことを諦めた馬鹿ばっかだ!』")
        yield* this.text("『やめて! さよならなんて言わせないで!』")
    }
}
