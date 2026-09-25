import { Stage } from "../Stage"

export default class extends Stage {
    protected *G(): Generator<void, void, unknown> {
        // 戦闘直後
        yield* this.wait(30)

        yield* this.text(`最後の一機が墜ちると、辺りは急に静かになった。`)
        yield* this.text(`焦げた匂いと、誰かの泣き声だけが残っていた。`)

        yield* this.text(`崩れた瓦礫の向こうから、見慣れない大人たちが数人、駆け寄ってくる。`)
        yield* this.text(`「おい、噓だろ。装備が勝手に動いてる……」`, { name: "テル" })
        yield* this.text(`ヘルメットを外すと、その場の全員が動きを止めた。`)
        yield* this.text(`「……子供?」`, { name: "テル" })

        yield* this.text(`「これ、返した方がいい?」`, { name: "シオン" })
        yield* this.text(`少女は装備の腕を軽く持ち上げてみせた。皮肉のつもりだったが、誰も笑わなかった。`)

        yield* this.text(`「いや……いい。それより、あんた、これどこで。」`, { name: "テル" })
        yield* this.text(`「床下。セツさんが。」`, { name: "シオン" })
        yield* this.text(`名前を出すと、テルと呼ばれた男は気まずそうにセツの方を見た。セツは目を逸らした。`)

        yield* this.text(`「巻き込んだのは、悪かったよ。」`, { name: "テル" })
        yield* this.text(`「うちが先に、ちょっとデカい仕事をしてね。締め付けが強くなったのは、多分そのせいだ。」`, { name: "テル" })
        yield* this.text(`意味は半分も分からなかった。分からなくてよかった、と後になって思う。`)

        yield* this.text(`「で、これからどうするの、あんたたち。」`, { name: "シオン" })
        yield* this.text(`テルは辺りを見回した。焼け落ちた壁、割れた窓、震えている子供たち。`)
        yield* this.text(`「施設はもう保たない。役所が来て、子供らは余所の施設に移されるだろうな。」`, { name: "テル" })
        yield* this.text(`「あんたは……その恰好で暴れた後だ。多分、戻れない。」`, { name: "テル" })

        yield* this.text(`少女は驚かなかった。<br>驚けなかった、が近いかもしれない。`)

        yield* this.text(`「リク。」`, { name: "シオン" })
        yield* this.text(`「……うん。」`, { name: "リク" })
        yield* this.text(`「ちゃんと、次のとこでも、アリの引っ越し見なよ。」`, { name: "シオン" })
        yield* this.text(`「そんなの、どこでも見れるよ。」`, { name: "リク" })
        yield* this.text(`「知ってる。」`, { name: "シオン" })

        yield* this.text(`セツは何か言おうとして、結局何も言わなかった。<br>少女もまた、何も聞かなかった。`)

        // キャプション圧縮
        yield* this.wait(30)
        yield* this.text(`それから、幾日か過ぎた。`)

        // マス初登場
        yield* this.text(`「よーお、お手柄じゃあないの。さっすが、合成人。」`, { name: "マス" })
        yield* this.text(`「その言い方、好きじゃないし嫌いだよ。何の用かな、新聞屋さん。」`, { name: "シオン" })
        yield* this.text(`少女は気だるげに床で伸びている。`)
        yield* this.text(`「悪ぃ悪ぃ。で、此度の戦闘はどうでした?」`, { name: "マス" })
        yield* this.text(`マスが懐から煙草を取り出して火を点けると、少女はマスへ距離を詰める。`)
        yield* this.text(`「あたしにもくれない?」`, { name: "シオン" })
        yield* this.text(`「あんた、何歳だっけ。」`, { name: "マス" })
        yield* this.text(`「十三。」`, { name: "シオン" })
        yield* this.text(`「へぇー。サーティーン。世も末だね。」`, { name: "マス" })
        yield* this.text(`テントの中に二本の紫煙が立ち上る。`)

        yield* this.wait(30)

        // 次の戦闘への接続
        yield* this.text(`テントの外で、誰かが叫んだ。`)
        yield* this.text(`「シオン、出るぞ!」`, { name: "テル" })
        yield* this.text(`少女は面倒くさそうに起き上がり、装備に手を伸ばした。`)
        yield* this.text(`「新聞屋さん、暇なら次も見てけば。」`, { name: "シオン" })
    }
}
