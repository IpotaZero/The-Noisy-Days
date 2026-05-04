import { Stage } from "../Stage"

export default class extends Stage {
    protected *G(): Generator<void, void, unknown> {
        yield* this.wait(30)

        yield* this.text("「お父さん。合成人って何なの。」", { name: "レイ" })
        yield* this.text("「合成人ってのはな。歴史で習わなかったか。人は分かり合えるって、人間の可能性を信じた奴らの、過ちだよ。」")
        yield* this.text("「過ち。」", { name: "レイ" })
        yield* this.text("「実際分かり合えなかっただろ? レイのとこにも居たろう。」")
        yield* this.text("「それは、私たちが……分かろうとしなかったから……。」", { name: "レイ" })
        yield* this.text("「そりゃ、分かり合おうとすることは一緒に生きるのに必要だ。」")
        yield* this.text('「でもな、人は決して分かり合えない。それは、私たちが"違う"からだよ。」')
        yield* this.text("「……。」", { name: "レイ" })
        yield* this.text("「レイ。誰にだって触れられたくない部分はある。だからこそ、SILOは人類の知恵なんだよ。」")
    }
}
