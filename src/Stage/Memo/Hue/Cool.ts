import { Stage } from "../../Stage"

export default class extends Stage {
    protected *G(): Generator<void, void, unknown> {
        yield* this.wait(30)

        yield* this.text("戦後処理")
        yield* this.text("機械大戦の末期、トウキョウには新型爆弾が投下された。")
        yield* this.text("これにより日本は事実上、政府としての機能を喪失することとなる。")
        yield* this.text("戦後、中国を主導とする地域共同体の形成が始まり、それが現在の東アジア自治体へと発展していった。")
        yield* this.text("トウキョウは、この東アジア自治体の統治下で、緩やかに復興していくことになる。")
        yield* this.text("戦後まもなく、自律兵器の使用を全面的に禁止する条約が結ばれた。")
        yield* this.text("これは単なる軍縮ではない。人命の損失そのものを戦争の成立要件とすることで、戦争そのものへの抑止力とする狙いがあったとされる。")
        yield* this.text("すなわち、人が生身で傷つき、死ぬ可能性のない戦いは、もはや戦争として認められない。")
        yield* this.text("もっとも、この条約にも抜け穴はある。")
        yield* this.text("前世紀の自律兵器そのものは、今も完全には失われていない。")
        yield* this.text("人間が一人、その判断の一切に無条件で許可を与え続けさえすれば、それは形式上、人間が戦っていることになる。")
        yield* this.text("条約の文言は、そこまでは想定していなかった。")
    }
}
