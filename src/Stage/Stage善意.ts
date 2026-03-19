import { Stage } from "./Stage"

export default class extends Stage {
    protected *G(): Generator<void, void, unknown> {
        yield* this.wait(60)

        yield* this.text("「本当に、100%の善意で、そんなことを。」", { name: "シオン" })
        yield* this.text("「そうよ! 全て、あなたたちの為にやってるんじゃない! この、分からず屋!」", { name: "未定" })
        yield* this.text("「……ッ!!」", { name: "シオン" })
        yield* this.text("「もう、やるしかないのよっ! さようならっ!」", { name: "未定" })
    }
}
