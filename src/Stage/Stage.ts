import { Dom } from "../Dom"
import { g } from "../global"

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

    protected *text(text: string, option: { name?: string } = {}): Generator<void, void, unknown> {
        const div = document.createElement("div")

        const name = option.name ? `<div class="stage-text-name">${option.name}</div>` : ""

        div.innerHTML = `
            ${name}
            <p class="stage-text">${text}</p>
        `
        div.classList.add("stage-text-container")
        Dom.container.appendChild(div)

        yield* this.ok()

        div.remove()
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

    protected *waitDefeatEnemy() {
        while (g.enemies.length > 0) yield
    }
}
