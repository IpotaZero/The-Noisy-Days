import { Stage } from "./Stage"

export default class extends Stage {
    protected *G(): Generator<void, void, unknown> {
        yield* this.wait(30)

        yield* this.text("「ササキさん。」")
        yield* this.text("「あなたは……待ってください!」", { name: "ササキ" })
        yield* this.text("「どうして、本当に、戦争なんて!」")
        yield* this.text("「我々は、話せば分かるのです!」", { name: "ササキ" })
        yield* this.text("「私にも子供が居るのよ!」")
        yield* this.wait(30)
        yield* this.text("(熱い。)", { name: "ササキ" })
        yield* this.wait(30)

        // 信じましたが死んじまいました、ね
        // 分かり合えない、ということ
        // それはこの物語世界に於ける真理である
        // それだけは表現しなくてはならなかった

        // もともとTAMAMUSHIは合成人のコミュニティであった
        // そこにアナキストが合流し内乱の機運が高まって行った
        // 殺したのは、一般合成人
        //
    }
}
