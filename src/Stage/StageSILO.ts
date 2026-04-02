import { Stage } from "./Stage"

export default class extends Stage {
    protected *G(): Generator<void, void, unknown> {
        yield* this.wait(30)

        yield* this.text("「そういえば、ヤナガワさんからの声明が出ましたよっと。」", { name: "マス" })
        yield* this.text("俺は煙草を咥えながら少女に新聞を渡す。")
        yield* this.text("「ヤナガワ……防衛大臣か。SILO派のトップの。」", { name: "シオン" })
        yield* this.text("少女はそれを広げると、見出しを指でなぞった。")

        yield* this.text("『機械大戦は終わった、だが人は己らの行いを反省しなければならない。』")
        // yield* this.text("『だが、ニッポンの属する東アジア自治体の取った方法は逆説的なものであった。』")
        yield* this.text("『「Social Integration and Longevity Operation』<br>──通称 SILO』")
        yield* this.text("『アルゴリズムによる、同質コミュニティへの自動振り分け機構。』")
        yield* this.text("『謳い文句は「もう二度と、憎しみが戦争になる前に」。』")

        yield* this.text("「……それが、過度な同質性が大戦の原因だったと分からないのか。」", { name: "シオン" })
        yield* this.text("少女は新聞を固く握りしめた。")
        yield* this.text("「……機械大戦、か。」", { name: "マス" })

        // SILOの良くない面を強調
        // 過度な同質性がエコーチェンバを生み、憎悪を増幅させる
    }
}
