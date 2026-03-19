import { Stage } from "./Stage"

export default class extends Stage {
    protected *G(): Generator<void, void, unknown> {
        yield* this.wait(30)

        yield* this.text("「あなた、合成人でしょう。」", { name: "サカイ" })
        yield* this.text("「誰だアンタは。」", { name: "シオン" })
        yield* this.text("「トウキョウ警察機動隊アルファのサカイです。」", { name: "サカイ" })
        yield* this.text("「……シオン・シマ。」", { name: "シオン" })
        yield* this.text("「それで、あなたしかも、子供でしょう。」", { name: "サカイ" })
        yield* this.text("「ハタチを大人とするなら、そう。」", { name: "シオン" })
        yield* this.text("「可哀相に。」", { name: "サカイ" })
        yield* this.text("「……。」", { name: "シオン" })
        yield* this.text("「SILOの中に居れば、傷付く事なんて無かったのに。」", { name: "サカイ" })
        yield* this.text("「その代わりに絶滅しろと?」", { name: "シオン" })
        yield* this.text("「そんなこと言ってないでしょう!? あなた、TAMAMUSHIの洗脳を受けてるのね。」", {
            name: "サカイ",
        })
        yield* this.text("「可哀相に!」", { name: "サカイ" })
        yield* this.text("「本当に、100%の善意で、そんなことを。」", { name: "シオン" })
        yield* this.text("「そうよ! 全て、あなたたちの為にやってるんじゃない!」", { name: "サカイ" })
        // 本当に分かり合えない人がいるという絶望
        yield* this.text("「……ッ!!」", { name: "シオン" })
        yield* this.text("「もう、やるしかないのよっ! さようならっ!」", { name: "サカイ" })

        // 戦闘

        yield* this.wait(30)

        yield* this.text("「……はは、はははっ!」", { name: "シオン" })
        yield* this.text("「善意が、傍から見ればこんなにも滑稽だなんて!」", { name: "シオン" })
    }
}
