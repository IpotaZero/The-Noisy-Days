import { Dom } from "../Dom"
import { g } from "../global"

export abstract class Stage {
    private generator!: Generator<void, void, unknown>

    private skip = false

    private skipButton: HTMLButtonElement | null = null

    constructor() {
        this.reset()
    }

    reset() {
        this.generator = this.G()
        this.skip = false
    }

    stopSkip() {
        this.skip = false
    }

    private showSkipButton() {
        if (this.skipButton) return

        const button = document.createElement("button")
        button.textContent = "SKIP"
        button.classList.add("stage-skip-button")
        button.addEventListener("click", () => {
            this.skip = true
            this.hideSkipButton()
        })
        Dom.container.appendChild(button)
        this.skipButton = button
    }

    private hideSkipButton() {
        this.skipButton?.remove()
        this.skipButton = null
    }

    tick() {
        const result = this.generator.next()

        return !!result.done
    }

    protected abstract G(): Generator<void, void, unknown>

    protected *text(
        text: string,
        option: { name?: string } = {},
    ): Generator<void, void, unknown> {
        if (this.skip) return

        const div = document.createElement("div")

        const name = option.name
            ? `<div class="stage-text-name">${option.name}</div>`
            : ""

        div.innerHTML = `
            ${name}
            <p class="stage-text">${text}</p>
        `
        div.classList.add("stage-text-container")
        Dom.container.appendChild(div)

        this.showSkipButton()
        yield* this.ok()
        this.hideSkipButton()

        div.remove()
    }

    protected *wait(frame: number): Generator<void, void, unknown> {
        if (this.skip) return
        yield* Array(frame)
    }

    protected *ok(): Generator<void, void, unknown> {
        if (this.skip) return

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
                if (
                    e.code === "Enter" ||
                    e.code === "Space" ||
                    e.code === "KeyZ"
                ) {
                    clicked = true
                }
            },
            { signal: abort.signal },
        )

        while (!clicked && !this.skip) {
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
                i.animate([{ opacity: 1 }, { opacity: 0 }], {
                    duration: 1000,
                }).finished.then(() => {
                    i.remove()
                })
            })
        }
    }
}
