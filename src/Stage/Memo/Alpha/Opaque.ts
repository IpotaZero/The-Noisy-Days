import { Stage } from "../../Stage"

export default class extends Stage {
    protected *G(): Generator<void, void, unknown> {
        yield* this.wait(30)

        yield* this.text("アオ・ササキ暗殺")
        yield* this.text("TAMAMUSHI内部の合成人コミュニティによる内ゲバ。")
        yield* this.text(
            '以前よりTAMAMUSHI内部では"看板"と呼ばれる少年兵の扱いに対し衝突があったが、それを口実に代表交代を目的として暗殺が試みられた。',
        )
        yield* this.text(
            `暗殺は成功したが、その後の民族派のリークにより内部は更に混乱し、代表を失ったまま内乱が続くことになった。`,
        )
    }
}
