import { Stage } from "../Stage"

export default class extends Stage {
    protected *G(): Generator<void, void, unknown> {
        yield* this.wait(30)

        yield* this.text(`テントの外、機体の整備音が絶え間なく響いていた。`)
        yield* this.text(`テルが装備の点検リストを片手に歩いてくる。`)
        yield* this.text(`「SILOの実働部隊、思ったより本気だ。」`, { name: "テル" })
        yield* this.text(`「北の合流地点に、恒久設備を建てる気らしい。」`, { name: "テル" })
        yield* this.text(`「……つまり?」`, { name: "シオン" })
        yield* this.text(`「一度建ったら、次はもうこの辺一帯、丸ごと塗り替えられる。」`, { name: "テル" })

        yield* this.text(`奥で誰かが吐き捨てるように言った。`)
        yield* this.text(`「だったら、建つ前に人ごと落とせばいい話だろ。」`, { name: "TAMAMUSHIの男" })
        yield* this.text(`テルは何も言い返さなかった。少しの間だけ、手元のリストに目を落としていた。`)

        yield* this.text(`「今日の相手は選抜部隊だ。SILOが看板に使ってる、若い連中。」`, { name: "テル" })
        yield* this.text(`「若いって、いくつ。」`, { name: "シオン" })
        yield* this.text(`「知らん。お前と同じくらいだろ。」`, { name: "テル" })
        yield* this.text(`少女は何も言わず、ヘルメットを被った。`)

        yield* this.text(`出撃口の光が、機体の合間から差し込んでいた。`)
        yield* this.text(`「行ってらっしゃい、じゃあ締まらないか。」`, { name: "テル" })
        yield* this.text(`「別に、何でもいいよ。」`, { name: "シオン" })
        yield* this.text(`少女は短く息を吐いて、光の中へ踏み出した。`)
    }
}
