import { Stage } from "../Stage"

export default class extends Stage {
    protected *G(): Generator<void, void, unknown> {
        yield* this.wait(30)

        yield* this.text("「シオン。もう、時間が無くなってしまった。」", { name: "ササキ" })
        yield* this.text("「……。」", { name: "ササキ" })
        yield* this.text("「分かってるよ。私はここの希望なんでしょ。」", { name: "シオン" })
        yield* this.text("「……本当に申し訳ない。」", { name: "ササキ" })
        yield* this.text("「私が一番上手く扱えるのは、どうしようもない現実だし。」", { name: "シオン" })
        yield* this.text("「それに、私には、もうこれしか無いんだよ。」", { name: "シオン" })
        yield* this.text("シオンはレイの顔を思い出したが、それがどうしてかは分からなかった。")

        yield* this.text("2XXX年 夏 重ね着を思い出す季節 トウキョウ内乱 発生")
    }
}
