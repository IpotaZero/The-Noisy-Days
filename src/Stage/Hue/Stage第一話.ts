import { Stage } from "../Stage"

export default class extends Stage {
    protected *G(): Generator<void, void, unknown> {
        yield* this.wait(30)

        yield* this.text("まだトウキョウが平和だった夏のことを、懐かし気に思い出している。")

        // 背景を変更したい(教室)
        yield* this.wait(30)

        yield* this.text("教室のざわめきは、少女の机の周りだけ薄くなる。")
        yield* this.text("「この問題分かる人。」", { name: "先生" })
        yield* this.text("先生の声に、誰も手を挙げない。少女が挙げると、教室が一瞬だけ静かになった。")
        yield* this.text("「シマさん。じゃあ、黒板に。」", { name: "先生" })
        yield* this.text(`チョークの音だけが響く。書き終えて振り返ると、一番前の席の女子と目が合った。<br>レイ・コウダ。`)
        yield* this.text(`「……なんで分かるの、それ。」`, { name: "レイ" })
        yield* this.text(`独り言みたいな声量だった。少女は答えなかった。`)
        yield* this.text(`レイは別に、睨んでいたわけじゃない。<br>ただ、不思議な虫でも見るような目をしていた。`)

        // 背景を変更したい(帰り道)
        yield* this.wait(30)

        yield* this.text(`放課後、施設への帰り道。`)
        yield* this.text(`ここに親はいない。誰の親もいない。<br>いつもなら、扉を開けた瞬間にリクが足に飛びついてくる。セツさんの「おかえり」より早く。`)
        yield* this.text(`少女がふと空を見ると、小型の飛行兵器が施設方面へ向かっているのが見えた。<br>機体には警察の記号が書かれてあった。`)
        yield* this.text(`少女は走った。`)

        // 背景を変更したい(施設・襲撃)
        yield* this.wait(30)

        yield* this.text(`辿り着いた頃には、施設は激しく攻撃されているところだった。`)
        yield* this.text(`誰も、飛びついてこなかった。`)
        yield* this.text(`土煙の向こうで、無線の声だけが淡々と響いている。`)
        yield* this.text(`「地下、反応あり。例のブツで間違いない。」`, { name: "警察無線" })
        yield* this.text(`「回収まで周辺を固めろ。子供は後回しでいい。」`, { name: "警察無線" })
        yield* this.text(`意味は分からなかった。分からなくてよかった、と後になって思う。`)

        yield* this.text(`崩れた壁の隙間に、震える背中がいくつも並んでいるのが見えた。`)
        yield* this.text(`「シオン……!」`, { name: "セツ" })
        yield* this.text(`職員のセツが、子供たちを抱えるようにして座り込んでいた。腕から血が伝っている。`)
        yield* this.text(`一番後ろで丸くなっていたリクが、顔だけ上げた。`)
        yield* this.text(`「おねえ、ちゃん……。」`, { name: "リク" })
        yield* this.text(`「大丈夫。」`, { name: "シオン" })
        yield* this.text(`何が大丈夫なのか、少女自身にも分からなかった。`)

        yield* this.text(`「セツさん、ここじゃ……」`, { name: "シオン" })
        yield* this.text(`「床下。奥の部屋の。」`, { name: "セツ" })
        yield* this.text(`セツはそれだけ言って、あとは言葉にならなかった。`)
        yield* this.text(`聞くべきことは、他にもたくさんあった気がした。<br>でも今、聞いている時間はなかった。`)

        yield* this.text(`板を剥がすと、継ぎ接ぎだらけの装備が一式、油の匂いと共に眠っていた。`)
        yield* this.text(`綺麗な兵器ではなかった。あちこちが違う持ち主のものみたいに歪だった。`)
        yield* this.text(`それでも、誰かを守れそうな形はしていた。`)

        yield* this.text(`「シオンおねえちゃん、どこ行くの……」`, { name: "リク" })
        yield* this.text(`少女は振り返らずに、装備を抱え直した。`)
        yield* this.text(`「ちょっと、外の音を止めてくる。」`, { name: "シオン" })
    }
}
