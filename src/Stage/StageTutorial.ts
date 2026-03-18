import { Stage } from "./Stage"

export default class extends Stage {
    protected *G(): Generator<void, void, unknown> {
        while (true) {
            console.log("Tutorial stage tick")
            yield
        }
    }
}
