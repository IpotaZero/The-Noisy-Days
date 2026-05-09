import { Stage } from "../Stage"

export default class extends Stage {
    protected *G(): Generator<void, void, unknown> {
        yield* this.wait(30)

        yield* this.text("「ササキさん。」")
        yield* this.text("「あなたは───待ってください!」", { name: "ササキ" })
        yield* this.text("何の変哲もない主婦が、その手に光線銃を構えている。")
        yield* this.text("「どうして、本当に、戦争なんて!」")
        yield* this.text("「我々は話せば分かる!」", { name: "ササキ" })
        yield* this.text("「私にも子供が居るのよ!」")
        yield* this.wait(30)
        yield* this.text("(熱い。)", { name: "ササキ" })
        yield* this.wait(30)
        yield* this.text("2XXX年 9月 アオ・ササキ 死亡")
        yield* this.text("実行犯は合成人の主婦であった。")

        // 信じましたが死んじまいました、ね
        // 分かり合えない、ということ
        // それはこの物語世界に於ける真理である
        // それだけは表現しなくてはならなかった
    }
}
