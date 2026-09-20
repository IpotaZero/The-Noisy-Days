import { Stage } from "../../Stage"

export default class extends Stage {
    protected *G(): Generator<void, void, unknown> {
        yield* this.wait(30)

        yield* this.text("20XX年、レイ・コウダに対するインタビューより。")

        yield* this.text("『学校で合成人は、あの子だけでした。』")
        yield* this.text('『理由なんて"ただ違う"ってだけで、あの子はずっと腫れ物でした。』')
        yield* this.text("『でも私は、なぜだかずっと気になっていて。』")
        yield* this.text('『今にして思えば、あれは"分かりたい"だったんだと思います。』')

        yield* this.text("『父は当局のSILO派の役人でした。母は、いません。』")
        yield* this.text("『ある日、父からTAMAMUSHI側で少女が戦っているという話を聞いて。』")
        yield* this.text("『なぜか、直感的に、彼女だと思いました。』")

        yield* this.text("『それで、パイロットに志願したんです。彼女の気持ちが、分かりたくて。』")
        yield* this.text("『向こうにしてみれば、子供を担ぐのは体裁のいい広報材料だったんでしょうけど。』")
        yield* this.text("『理由なんて、どうでも良かった。』")
        yield* this.text("『訓練は、何度も抜け出しました。会いに行くために。』")

        yield* this.text(
            "『……うちの親世代は、その親から直接、戦争の悲惨さを聞いてるんです。人は分かり合えない、って。』",
        )
        yield* this.text("『でも私たちは、又聞きでしかそれを知らない。それに、合成人がいる。』")
        yield* this.text("『だから、漠然と信じてたんだと思います。人は、分かり合えるはずだって。』")
        yield* this.text("『分かりたいと思ったのは、反抗期だったのかもしれません。』")

        yield* this.text("『彼女とは、あれから会ってはいません。どこにいるかも知りません。』")
        yield* this.text("『もしかしたら、お互いに忘れてしまった方が幸せなのかもしれませんね。』")
    }
}
