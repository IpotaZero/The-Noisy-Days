import { Stage } from "./Stage"

export default class extends Stage {
    protected *G(): Generator<void, void, unknown> {
        yield* this.wait(30)

        yield* this.text("機械大戦の始まりは、アルゴリズムによって増幅された局所的な、民族差別に由来する憎悪であった。")
        yield* this.text("民主主義は、民意の儘に、人類を世界大戦へと導いた。")
        yield* this.text("機械大戦の罪は戦闘成立要件に「人命の損失」を必要としたことであろう。")
        yield* this.text("戦争の長期化を防ぐ、というのが建前であり本音でもあるが、本来の目的はインフラ施設の保護である。")
        yield* this.text("インフラの崩壊こそが、最も人命の損失を生むのだから。")
    }
}
