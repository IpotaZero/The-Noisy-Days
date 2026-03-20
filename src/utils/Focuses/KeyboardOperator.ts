import { Operation } from "./Focuses"

export class KeyboardOperator {
    private readonly ac = new AbortController()

    constructor(private readonly operate: (o: Operation) => void) {
        window.addEventListener("keydown", this.onKeyDown.bind(this), { signal: this.ac.signal })
    }

    remove() {
        this.ac.abort()
    }

    private onKeyDown(e: KeyboardEvent): void {
        switch (e.code) {
            case "ArrowUp":
                this.operate("up")
                break

            case "ArrowDown":
                this.operate("down")
                break

            case "ArrowLeft":
                this.operate("left")
                break

            case "ArrowRight":
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
