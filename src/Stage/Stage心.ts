import { Stage } from "./Stage"

export default class extends Stage {
    protected *G(): Generator<void, void, unknown> {
        yield* this.wait(30)

        // 兄弟であり、恋人である

        yield* this.text("「ねえ新聞屋さん。あたしに心ってあると思う?」", { name: "シオン" })
        yield* this.text("ぺた……。")
        yield* this.text("「あるじゃん。心。」", { name: "マス" })
        yield* this.text("「レトリックは止めろよ。嫌いなんだ。合成人にも、人と同じ心が在るのか、気になって。」", {
            name: "シオン",
        })
        yield* this.text("「じゃあ俺に心が在るかはどうなんだ?」", { name: "マス" })
        yield* this.text("「……。」", { name: "シオン" })
        yield* this.text("「俺たちに見えるものは関わり合いだけだ。そして俺たちにとって重要な事も関わり合いだけだ。」", {
            name: "マス",
        })
        yield* this.text("「超関数?」", { name: "シオン" })
        yield* this.text("「俺は縁起と言いたいね。」", { name: "マス" })
        yield* this.text("「言いたいことは分かるけどさ……。」", { name: "シオン" })
        yield* this.text("「それでも何かを信じたいなら、まずは目の前にいる奴を信じてみるこったな。」", { name: "マス" })
        yield* this.text("「お互いに、心が在ると、信じるのさ。」", { name: "マス" })
        yield* this.text("「お互いに……。」", { name: "シオン" })

        // ランダムフラスコベイビーズって作品がすごい好き
    }
}
