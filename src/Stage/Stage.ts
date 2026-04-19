import { Dom } from "../Dom"
import { g } from "../global"
import { Action } from "../utils/UnifiedInput/DefaultConfig"

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

        if (g.input.isPushed(Action.Skip)) {
            this.skip = true
            this.hideSkipButton()
        }

        return !!result.done
    }

    protected abstract G(): Generator<void, void, unknown>

    protected *text(text: string, option: { name?: string } = {}): Generator<void, void, unknown> {
        if (this.skip) return

        const div = document.createElement("div")

        const name = option.name ? `<div class="stage-text-name">${option.name}</div>` : ""

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
                if (e.code === "Enter" || e.code === "Space" || e.code === "KeyZ") {
                    clicked = true
                }
            },
            { signal: abort.signal },
        )

        // --- 全Gamepads対応 ---
        // 各ゲームパッドの「前回の状態」を保存するMap
        const prevPadsButtons = new Map<number, boolean[]>()

        // 初回実行時の状態をキャプチャ（開始時の押しっぱなし防止）
        for (const pad of navigator.getGamepads()) {
            if (pad) {
                prevPadsButtons.set(
                    pad.index,
                    pad.buttons.map((b) => b.pressed),
                )
            }
        }

        while (!clicked && !this.skip) {
            // 常に最新のゲームパッドリストを取得
            const pads = navigator.getGamepads()

            for (const pad of pads) {
                if (!pad) continue

                const currentButtons = pad.buttons.map((b) => b.pressed)
                const prevButtons = prevPadsButtons.get(pad.index)

                if (prevButtons) {
                    // 前回の状態が存在する場合のみ、新規の「押し」判定を行う
                    for (let i = 0; i < currentButtons.length; i++) {
                        if (currentButtons[i] && !prevButtons[i]) {
                            clicked = true
                            break
                        }
                    }
                }

                // 状態を更新（新しいパッドだった場合もここで登録される）
                prevPadsButtons.set(pad.index, currentButtons)
                if (clicked) break
            }
            // ------------------

            yield
        }

        abort.abort() // イベントリスナーの解除
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
