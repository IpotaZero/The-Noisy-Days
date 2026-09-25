import { Stage } from "../../Stage"

export default class extends Stage {
    protected *G(): Generator<void, void, unknown> {
        yield* this.wait(30)

        yield* this.text("合成人")
        yield* this.text("機械大戦の後期、日本国内において、遺伝子操作によって新たな人類を生み出す計画が立ち上がった。")
        yield* this.text("目的は、互いに分かり合うことのできる人類の創出であったとされる。")
        yield* this.text("計画上、対象個体は感知能力および知能において従来の人類を上回るよう設計された。")
        yield* this.text("ただし、感知能力や知能が高いことと、他者を理解できることは、本来別の問題である。")
        yield* this.text("この点は、計画の初期段階からすでに指摘されていたとされる。")
        yield* this.text("対象個体には、一目で識別できるよう、尖った耳という外見上の特徴が設計段階から組み込まれた。")
        yield* this.text("計画は、あくまで表向きは戦争遂行を目的として進められたものである。")
        yield* this.text("戦争の終結を前後して、第一世代がようやく誕生した。")
        yield* this.text("しかし倫理的な問題が指摘され、計画を主導した研究所は閉鎖されるに至った。")
    }
}
