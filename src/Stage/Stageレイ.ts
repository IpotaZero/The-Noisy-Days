import { Stage } from "./Stage"

export default class extends Stage {
    protected *G(): Generator<void, void, unknown> {
        yield* this.wait(30)

        yield* this.text("私にとって、シオン・シマとは、何であったのだろうか。")
        yield* this.text("レイ・コウダの日記より抜粋")
        yield* this.text("")
    }
}
