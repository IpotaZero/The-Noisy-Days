import { Stage } from "./Stage"

export default class extends Stage {
    protected *G(): Generator<void, void, unknown> {
        yield* this.wait(60)

        yield* this.text("機械大戦の終結後、人は己らの行いを反省した。")
        yield* this.text("だが、東アジア自治体の取った方法は逆説的なものであった。")
        yield* this.text("『Social Integration and Longevity Operation』<br>──通称 SILO")
        yield* this.text("アルゴリズムによる、人の同質コミュニティへの自動振り分け機構。")
        yield* this.text("謳い文句は『もう二度と、憎しみが戦争になる前に』。")
    }
}
