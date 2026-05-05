import { Stage } from "../Stage"

export default class extends Stage {
    protected *G(): Generator<void, void, unknown> {
        yield* this.wait(30)

        yield* this.text("「それでも……、分かりたいと、思ったから。」", { name: "レイ" })
        yield* this.text("「アイツが何を感じていたのかなんてのはもう分からないから、せめて、今の気持ちを、知りたい。」", { name: "レイ" })
        yield* this.text("「そのためだったら私はどんな倫理だって乗り越えてやるよ。」", { name: "レイ" })
    }
}
