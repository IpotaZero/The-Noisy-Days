import { Operation } from "./Focuses"

export class KeyboardOperator {
    private readonly ac = new AbortController()

    private readonly pushedKeys = new Set<string>()

    constructor(private readonly operate: (o: Operation) => void) {
        window.addEventListener("keydown", this.onKeyDown.bind(this), {
            signal: this.ac.signal,
        })
        window.addEventListener(
            "keyup",
            (e) => {
                this.pushedKeys.delete(e.code)
            },
            { signal: this.ac.signal },
        )
    }

    remove() {
        this.ac.abort()
    }

    private onKeyDown(e: KeyboardEvent): void {
        if (this.pushedKeys.has(e.code)) {
            return
        }

        this.pushedKeys.add(e.code)

        switch (e.code) {
            case "ArrowUp":
            case "KeyW":
                this.operate("up")
                break

            case "ArrowDown":
            case "KeyS":
                this.operate("down")
                break

            case "ArrowLeft":
            case "KeyA":
                this.operate("left")
                break

            case "ArrowRight":
            case "KeyD":
                this.operate("right")
                break

            case "Enter":
            case "Space":
            case "KeyZ":
                this.operate("ok")
                break

            case "Escape":
            case "Backspace":
            case "KeyX":
                this.operate("cancel")
                break
        }
    }
}
