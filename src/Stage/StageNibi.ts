import { Stage } from "./Stage"

export default class extends Stage {
    protected *G(): Generator<void, void, unknown> {
        yield* this.wait(30)

        yield* this.text("アオは死んだ。")
        yield* this.text("頭を失ったTAMAMUSHIは烏合の衆と化し瓦解した。")
        yield* this.text("玉虫色が、黒く塗りつぶされていく。")
        yield* this.text("だが、一つだけ勝ち取ったものがあった。当局は反政府主義の凝集をリスクと認識し、一部地域でのSILOの導入を見送ったのだ。")
        yield* this.text("完全な単色化は起きなかった。")

        yield* this.text("「……。」", { name: "シオン" })
        yield* this.text("「……。」", { name: "レイ" })

        yield* this.text("混ざり合えない、分かり合えない、<ruby>摩擦<rt>ノイズ</rt></ruby>だらけの、斑のある鈍色の都市。")
        yield* this.text("それでも、二人の少女は隣り合って座っていた。")

        // 多様性を担保するためには、いろんな人がいればそれだけでいいわけではなくて、
        // それぞれの色が混ざり合わずに同時に存在している、つまり意見を表明できなければならない
        // それには色同士の境界が必要で、それは人間関係の摩擦ともいえるのだろうけど、それが必要である

        // SILOは摩擦をゼロにするために色を相対的に無くす（単色化する）措置である
        // 初期TAMAMUSHI（合成人の集団）は様々な色の存在を目指したが、結局はマイノリティとして単色化された
        // アナキストとの合流は最初は新たな色の登場であったが、アオの死亡により黒く塗りつぶされていった
        // だがSILOの影響から逃れたことにより完全な単色化は逃れ、鈍く輝く廃墟となったトウキョウにシオンとレイが隣に座る、という終わり方
    }
}
