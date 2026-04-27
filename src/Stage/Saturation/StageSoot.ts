import { Stage } from "../Stage"

export default class extends Stage {
    protected *G(): Generator<void, void, unknown> {
        yield* this.wait(30)

        yield* this.text("「自律兵器は条約違反でしょおっ!」", { name: "イシカワ" })
        yield* this.text("「あたしはロボットじゃない。」", { name: "シオン" })
        yield* this.text("「って、にゃるへそ。当たらなければどうということは無い……ってかあ?」", { name: "イシカワ" })
    }
}
