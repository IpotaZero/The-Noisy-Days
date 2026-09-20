import { Stage } from "../Stage"

export default class extends Stage {
    protected *G(): Generator<void, void, unknown> {
        yield* this.wait(30)

        yield* this.text(`アオがいなくなってから、テントの中の声はいつも尖っていた。`)
        yield* this.text(`「後任は俺だ。文句あるか。」`, { name: "ヨウ" })
        yield* this.text(`「話し合いで決める話だろう。」`, { name: "テル" })
        yield* this.text(`「話し合いなんぞしてる間に、また誰か殺られるんだよ。」`, { name: "ヨウ" })

        yield* this.text(`少女は隅で、ただそれを聞いていた。`)
        yield* this.text(`「……アオの葬式も、まだなのに。」`, { name: "シオン" })
        yield* this.text(`誰も、答えなかった。`)

        yield* this.text(`そこへ、無線の係が慌てて飛び込んできた。`)
        yield* this.text(`「大変です! 南のSILO駐屯地、警備が急に厚くなって……。」`, { name: "通信係" })
        yield* this.text(`「は? 情報が漏れてんじゃねえのか。」`, { name: "ヨウ" })
        yield* this.text(`「装備を担当してたのは……ちっ、あの民族派の男か。」`, { name: "テル" })

        // yield* this.text(`一同の視線が、自然と一箇所に集まった。<br>民族派を束ねる、ジンという男だった。`)

        // yield* this.text(`「……見損なったぜ、ジン。」`, { name: "ヨウ" })
        // yield* this.text(`「見損なうのは勝手だが、俺たちには俺たちの筋がある。」`, { name: "ジン" })
        // yield* this.text(`「装備の在処を渡す代わりに、俺の同胞の安全は保障された。」`, { name: "ジン" })
        // yield* this.text(`「日本を取り戻すのに、お前らと心中する義理はない。」`, { name: "ジン" })

        yield* this.text(`「アオが死んで、まだ十日と経ってないんだぞ。」`, { name: "テル" })
        yield* this.text(`「アオが甘すぎたんだよ。誰でも受け入れりゃ、こうなるに決まってる。」`, { name: "ヨウ" })

        yield* this.text(`その一言に、誰も言い返せなかった。<br>それが一番、事実に近かったからだ。`)

        yield* this.text(`シオンは、じっと拳を握っていた。<br>外の世界と、何も変わらない。`)
    }
}
