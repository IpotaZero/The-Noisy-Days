import { Stage } from "../Stage"

export default class extends Stage {
    protected *G(): Generator<void, void, unknown> {
        yield* this.wait(30)

        yield* this.text(`「今日は届け物だ。あんたも来い。」`, { name: "テル" })
        yield* this.text(`「あたし、荷物持ちじゃないんだけど。」`, { name: "シオン" })
        yield* this.text(`「顔を貸すだけでいい。TAMAMUSHIの名が立ってりゃ、多少はふっかけられずに済む。」`, { name: "テル" })

        // 背景を変更したい(闇市)
        yield* this.wait(30)

        yield* this.text(`焼け跡の隙間に、露店が所狭しと並んでいた。`)
        yield* this.text(`怒鳴り合う声、値切る声、聞き取れない言語の歌。<br>誰も彼も、勝手にばらばらな顔をしていた。`)
        yield* this.text(`隣同士の店主が、値段のことで摑み合いを始める。<br>その隣では、子供たちが石蹴りをして笑っている。`)

        yield* this.text(`「……ここ、好きかも。」`, { name: "シオン" })
        yield* this.text(`「うるさいだけだろ。」`, { name: "テル" })
        yield* this.text(`「うるさいのが、いいんだよ。」`, { name: "シオン" })

        yield* this.text(`テルは片眉を上げたが、それ以上は聞かなかった。`)

        yield* this.text(`広場の街頭ビジョンに、SILOの告知が流れていた。`)
        yield* this.text(`『この区画にも、安全境界を設置します。』`)
        yield* this.text(`『皆さんが、これ以上傷つけ合わずに済むように。』`)

        yield* this.text(`老いた店主が手を叩いて喜んでいる。<br>その隣で、若い男が値札を握りしめたまま黙り込んでいた。`)
        yield* this.text(`「あの兄ちゃん、露店二代目だってよ。境界の中じゃ、この商売は許可制になる。」`, { name: "テル" })
        yield* this.text(`「喜んでる奴と、黙ってる奴と、両方いるんだね。」`, { name: "シオン" })
        yield* this.text(`「そういうもんだろ、大体は。」`, { name: "テル" })

        yield* this.text(`シオンは、さっきまで笑っていた子供たちの方を見た。<br>境界が敷かれたら、この石蹴りも、外から見えなくなるんだろうか。`)
        yield* this.text(`「……こんなの、無くなればいいのに。境界とやら。」`, { name: "シオン" })
        yield* this.text(`「上も同じこと考えてる。今夜、建設部隊が現地入りする前に叩く。」`, { name: "テル" })

        yield* this.text(`「決まってんの、もう。」`, { name: "シオン" })
        yield* this.text(`「ああ。装備、整えとけ。」`, { name: "テル" })

        yield* this.text(`少女は市場の喧騒を、もう一度だけ振り返った。`)
    }
}
