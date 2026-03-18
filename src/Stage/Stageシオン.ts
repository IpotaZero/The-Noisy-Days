import { Stage } from "./Stage"

export default class extends Stage {
    protected *G(): Generator<void, void, unknown> {
        yield* this.wait(60)

        yield* this.text("前世紀、アルゴリズムは人の憎悪を増幅し、ついには人類を世界大戦へと導いた。")
        yield* this.text("世界中の国々が戦争継続能力を喪失して漸く終結した機械対戦。")
        yield* this.text("だが倫理と不釣り合いに増大した科学力は諍いの種を蒔いていった。")

        // 嶋 詩音
        yield* this.text("「……。」")
        yield* this.text("シオン・シマ 第二世代合成人")
        yield* this.text("東アジア自治体、ニッポンのトウキョウという町に暮らす戦争孤児である。")
    }
}
