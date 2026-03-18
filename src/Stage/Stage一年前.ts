import { Stage } from "./Stage"

export default class extends Stage {
    protected *G(): Generator<void, void, unknown> {
        yield* this.wait(60)

        // 後で人名を表示する機能を作る

        // シオン
        yield* this.text("『あの……これ……。』")

        // レイ
        yield* this.text("『……。』")
        yield* this.text("『何? これ。』")

        yield* this.text("『先生から、渡せって……。』")

        yield* this.text("『そ。』")

        yield* this.text("『……。』")
    }
}
