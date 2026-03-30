import { Stage } from "./Stage"

export default class extends Stage {
    protected *G(): Generator<void, void, unknown> {
        yield* this.wait(30)

        yield* this.text("新聞記者 兼 戦場撮影家 マスの手記より")
        yield* this.text("俺が初めてシオン・シマに会ったのは、TAMAMUSHIによる先制攻撃の数日後だった。")
        yield* this.text("新聞社の代表として彼女に取材することが許可された。")
        yield* this.text("みすぼらしいテントに入って見た第一印象は、小さい、だった。")
        yield* this.text("140cm程だろうか、飛行装備に最適な身長もそれくらいだったと思い出す。")
        yield* this.text("対面して腰掛けると顔を上げてこちらを向く。")
        yield* this.text("ヘルメットを着けたままの第一声は『誰、アンタ。』だった。")
        yield* this.text("発音が幼い。まさかとは思ったが、ヘルメットを外したときにそれは確信に変わった。")
        yield* this.text("髪の切れ目から覗く、三角に尖った耳。<br>───合成人。")
        yield* this.text("こんな子供が、戦闘の成立要件に、人柱にされているのか。")
        yield* this.text("声を出せずにいると、彼女は『憐れみは止めて。』と言い、トントンと隣を叩いた。")
        yield* this.text("俺が隣に座り直すと彼女は何を言うでもなく前を向いた。")
        // yield* this.text("『軍人が居ないって話? あれホントなんだよ。』", { name: "シオン" })
        // yield* this.text("『だから私しかいない。でもさ……なんでだと思う? こんな小さな体で空を飛ばなきゃいけないのか。怖くないわけないよね。』", { name: "シオン" })
        // yield* this.text("『実際初陣の夜は震えて眠れなかった。だけど一つだけわかったことがある。』", { name: "シオン" })
        // yield* this.text('『戦う意味なんてなくてもいい。ただ、私がここにいることで誰かの帰り道になるなら───それが"役割"ってやつなんだろうなって。』', { name: "シオン" })
        yield* this.text("俺は問うべき事を失った。そしてそれが、彼女が合成人ということなのだろうと悟った。")
    }
}
