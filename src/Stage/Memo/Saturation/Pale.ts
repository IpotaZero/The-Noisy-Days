import { Stage } from "../../Stage"

export default class extends Stage {
    protected *G(): Generator<void, void, unknown> {
        yield* this.wait(30)

        yield* this.text("TAMAMUSHI")
        yield* this.text(
            "SILOによる棲み分け政策の中で、行き場を失った合成人たちが自然発生的に寄り集まって形成した互助組織が、その起源であるとされる。",
        )
        yield* this.text(
            "結成当初は非合成人社会への迎合も辞さず、非暴力の陳情・デモ活動を中心とした穏健な団体であった。",
        )
        yield* this.text(
            "しかし組織の維持と拡大のため、思想や出自を問わず加入を認める、いわゆる来る者拒まずの方針が採られたことが、後の変質を招く一因となった。",
        )
        yield* this.text(
            "SILOの棲み分け政策によって同様に存続の危機に瀕していた少数民族の合流者や、既存国家そのものの解体を志向する急進的な民族主義者らが、次々と組織内へ流入した。",
        )
        yield* this.text(
            "流入した勢力の一部は、当初の穏健な運動方針に飽き足らず、独自に破壊工作及び要人襲撃を実行するようになる。",
        )
        yield* this.text(
            "これら一連の事件がTAMAMUSHIの名において行われたことにより、組織全体がテロリズム集団として当局から認定されるに至った。",
        )
        yield* this.text(
            "結成当初の理念であった共存の模索と、結果として先鋭化した排他的な武装闘争との間には、今なお大きな乖離が存在する。",
        )
    }
}
