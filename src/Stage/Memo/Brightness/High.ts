import { Stage } from "../../Stage"

export default class extends Stage {
    protected *G(): Generator<void, void, unknown> {
        yield* this.wait(30)

        yield* this.text("合成人の絶滅")
        yield* this.text("合成人はもともと個体数の少ない存在だ。")
        yield* this.text(
            "しかしSILO自体は出自ではなく思想の違いを判別するため、共感能力の高い合成人はそれぞれの地区になじみ、合成人同士が集まることは少なかった。",
        )
        yield* this.text("しかしそれをアオ・ササキは良しとしなかった。")
        yield* this.text("彼はこのままでは合成人が絶滅してしまうと考えた。")
        yield* this.text("それが彼がTAMAMUSHIを作った理由とされている。")

        // yield* this.text("「やあ、こんにちは、僕はアオ。アオ・ササキ。」", { name: "ササキ" })
        // yield* this.text("アオは髪を耳に掛ける。")
        // yield* this.text("「……。」", { name: "シオン" })
        // yield* this.text("シオンはアオの顔を睨め付けながらも少し警戒を解く。")
        // yield* this.text("「僕らはTAMAMUSHIという、合成人の為のデモ団体を運営しているんだ。」", { name: "ササキ" })
        // yield* this.text("「……SILOを止めたいってわけ。」", { name: "シオン" })
        // yield* this.text("「うん、そうだね。SILOは必要悪なんだろうけど、現状は行き過ぎている。止めたいのは僕らの民族的な理由だけど……。」", { name: "ササキ" })

        // yield* this.wait(30)

        // // 背景変更

        // yield* this.text("「シオン。もう、時間が無くなってしまった。」", { name: "ササキ" })
        // yield* this.text("「……。」", { name: "ササキ" })
        // yield* this.text("「分かってるよ。私はここの希望なんでしょ。」", { name: "シオン" })
        // yield* this.text("「……本当に申し訳ない。」", { name: "ササキ" })
        // yield* this.text("「私が一番上手く扱えるのは、どうしようもない現実だし。」", { name: "シオン" })
        // yield* this.text("「それに、私には、もうこれしか無いんだよ。」", { name: "シオン" })
        // yield* this.text("シオンはレイの顔を思い出したが、それがどうしてかは分からなかった。")

        // yield* this.text("2XXX年 夏 重ね着を思い出す季節 トウキョウ内乱 発生")
    }
}
