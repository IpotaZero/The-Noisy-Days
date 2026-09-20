import { Stage } from "../Stage"

export default class extends Stage {
    protected *G(): Generator<void, void, unknown> {
        yield* this.wait(30)

        yield* this.text(`息抜きに、また市場へ足を向けた。<br>あの日感じた"うるささ"が、少しだけ恋しかった。`)

        yield* this.text(`だが今日は、様子が違った。`)
        yield* this.text(`物々交換の秤を巡って、怒声が上がっている。<br>片方は避難民、片方は土着派の行商だった。`)

        yield* this.text(`「その目盛り、いじっただろうが!」`, { name: "行商" })
        yield* this.text(`「言いがかりだ! お前らこそいつも……!」`, { name: "避難民" })

        yield* this.text(`一発、殴り合いが始まると、周りも我先にと加勢し始めた。<br>誰が何の理由で殴っているのか、じきに誰にも分からなくなった。`)

        yield* this.text(`「シオン、下がれ!」`, { name: "テル" })
        yield* this.text(`引き寄せられた拍子に、露店の一つが将棋倒しになる。<br>陶器の割れる音が、悲鳴に混ざった。`)

        // yield* this.text(`「……これが、あたしの好きだった"うるささ"?」`, { name: "シオン" })
        // yield* this.text(`「棲み分けがないってのは、こういうことだ。」`, { name: "テル" })
        // yield* this.text(`「誰も彼も好き勝手やって、そのうち収拾がつかなくなる。」`, { name: "テル" })

        // yield* this.text(`シオンは、何も言い返せなかった。`)
        yield* this.text(`さっきまで石蹴りをしていた子供たちが、泣きながら親を探して走っていた。`)
    }
}
