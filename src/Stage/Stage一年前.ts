import { Stage } from "./Stage"

export default class extends Stage {
    protected *G(): Generator<void, void, unknown> {
        yield* this.wait(60)

        // 後で人名を表示する機能を作る

        // シオン
        yield* this.text("『あの……これ……。』", { name: "シオン" })

        // レイ
        yield* this.text("『……。』", { name: "レイ" })
        yield* this.text("『何? これ。』", { name: "レイ" })

        yield* this.text("『先生から、渡せって……。』", { name: "シオン" })

        yield* this.text("『そ。』", { name: "レイ" })

        yield* this.text("『……。』", { name: "シオン" })
    }
}
