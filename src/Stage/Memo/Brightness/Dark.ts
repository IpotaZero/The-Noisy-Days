import { Stage } from "../../Stage"

export default class extends Stage {
    protected *G(): Generator<void, void, unknown> {
        yield* this.wait(30)

        yield* this.text("棲み分け")
        yield* this.text("意見の異なるコミュニティと接触しないように意図的に行われる自己隔離の事。")
        yield* this.text("お互いを守るための人類の知恵である。")
        yield* this.text("本来は自らの意思で行うものだが、現代では構造的に強制されるものもある。")
    }
}
