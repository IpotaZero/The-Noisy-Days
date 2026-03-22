import { Dom } from "../Dom"
import { g } from "../global"

export abstract class Stage {
    private generator!: Generator<void, void, unknown>

    constructor() {
        this.reset()
    }

    reset() {
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

    protected changeBackground(path: string | undefined) {
        if (path) {
            const img = new Image()
            img.src = path
            img.classList.add("stage-background")

            img.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 1000 })

            Dom.container.appendChild(img)
        } else {
            Dom.container.querySelectorAll(".stage-background").forEach((i) => {
                i.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 1000 }).finished.then(() => {
                    i.remove()
                })
            })
        }
    }
}
