import { Stage } from "../../Stage"

export default class extends Stage {
    protected *G(): Generator<void, void, unknown> {
        yield* this.wait(30)

        yield* this.text("SILO")
        yield* this.text("『Social Integration Longevity Operation』")
        yield* this.text("人々を同質的なコミュニティに自動分配するシステム。")
        // yield* this.text("東アジア自治体では、加盟地域全域においてインターネットの利用が大幅に規制されている。")
        // yield* this.text("これは機械大戦の発端が、SNSを介した扇動にあったという反省に基づくものとされる。")
        yield* this.text("トウキョウにおいて、この十年の間にSILOの導入が段階的に進められてきた。")
        yield* this.text("戦後の復興が進み、人口と経済が回復するにつれて、人々の間には再び摩擦が生まれ始めていた。")
        yield* this.text("トウキョウ議会は、この摩擦の再燃を、かつての惨禍の再来に繋がるものとして強く恐れた。")
        yield* this.text("SILOの導入は、その恐怖に対する議会なりの回答であった。")
    }
}
