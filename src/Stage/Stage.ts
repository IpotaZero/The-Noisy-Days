import { Dom } from "../Dom"

export abstract class Stage {
    private readonly generator: Generator<void, void, unknown>

    constructor() {
        this.generator = this.G()
    }

    tick() {
        const result = this.generator.next()

        return !!result.done
    }

    protected abstract G(): Generator<void, void, unknown>

    protected *text(text: string): Generator<void, void, unknown> {
        const p = document.createElement("p")
        p.classList.add("stage-text")
        p.innerHTML = text
        Dom.container.appendChild(p)

        yield* this.ok()

        p.remove()
    }

    protected *wait(frame: number): Generator<void, void, unknown> {
        yield* Array(frame)
    }

    protected *ok(): Generator<void, void, unknown> {
        const abort = new AbortController()

        let clicked = false
        Dom.container.addEventListener(
            "click",
            () => {
                clicked = true
            },
            { signal: abort.signal },
        )

        window.addEventListener(
            "keydown",
            (e) => {
                if (e.code === "Enter" || e.code === "Space" || e.code === "KeyZ") {
                    clicked = true
                }
            },
            { signal: abort.signal },
        )

        while (!clicked) {
            yield
        }

        abort.abort()
    }
}
