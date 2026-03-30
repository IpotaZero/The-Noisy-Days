import { Stage } from "./Stage"

export default class extends Stage {
    protected *G(): Generator<void, void, unknown> {
        yield* this.wait(30)

        // 佐々木 碧

        yield* this.text("「いやー、どうも。まさかササキさん本人にお話を伺えるとは。」", { name: "マス" })
        yield* this.text("「こちらこそ、僕らのの意見を表明する機会をいただけてありがたいです。」", { name: "ササキ" })

        yield* this.text("マスはテロ組織のトップにしては若すぎる青年を観察しながら手帳を開く。")
        yield* this.text("アオ・ササキ 第二世代合成人")
        yield* this.text("反SILO組織TAMAMUSHIの代表")

        yield* this.text("「では、早速質問に入らせていただきます。貴方方は何故、SILO政策に反対するのでしょう?」", { name: "マス" })
        yield* this.text("「それは実は個々人によって違うんですよね。ただ、SILOは『SILOに反対する』人をも集めてしまう自己矛盾を抱えています。」", { name: "ササキ" })
        yield* this.text("「僕らのような集団が現れるのは構造的に必然でしょう。」", { name: "ササキ" })
        // 生々しすぎるので書かない
        // yield* this.text("「なるほど。では貴方の理由は何なのでしょうか?」", {
        //     name: "マス",
        // })
        // yield* this.text("「……僕や僕の盟友ら、初期のメンバーは皆合成人です。」", { name: "ササキ" })
        // yield* this.text(
        //     "「合成人は絶対数が少ない。SILOによって閉じ込められ続ければ、いずれ絶滅してしまうでしょう。それは戦争の遺産を消し去りたい政府からすれば都合がいいんでしょうけどね。」",
        //     { name: "ササキ" },
        // )
        // yield* this.text(
        //     "「だから、僕たちは何としても仲間を集める必要があった。それが偶然、反SILO派だったというだけ、と、言ってしまえばそうです。」",
        //     { name: "ササキ" },
        // )

        // 誰もが善意で動いている
        yield* this.text("「なるほど、しかし、ササキさん、若いですね。大変でしょう。」", { name: "マス" })
        yield* this.text("「……はは、僕含め上層部は合成人ですからね、分かって言ってんでしょう?」", { name: "ササキ" })
        yield* this.text("「あー、いや、すみません。」", { name: "マス" })
        yield* this.text("「時間は掛かりますよ、そう云うのを変えるのは。だけど、きっと皆分かり合える。」", { name: "ササキ" })
    }
}
