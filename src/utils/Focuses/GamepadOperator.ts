type Operation = "right" | "left" | "up" | "down" | "ok" | "cancel"

export class GamepadOperator {
    private readonly pressed = new Set<Operation>()
    private removed = false

    constructor(private readonly operate: (o: Operation) => void) {}

    start() {
        requestAnimationFrame(this.update)
    }

    remove() {
        this.removed = true
    }

    update = () => {
        navigator.getGamepads().forEach((gp) => {
            if (!gp) return

            this.add("ok", gp.buttons[0].pressed)
            this.add("cancel", gp.buttons[1].pressed)

            this.add("down", gp.axes[1] > 0.5)
            this.add("up", gp.axes[1] < -0.5)

            this.add("right", gp.axes[0] > 0.5)
            this.add("left", gp.axes[0] < -0.5)
        })

        if (!this.removed) return

        requestAnimationFrame(this.update)
    }

    private add(operation: Operation, tf: boolean) {
        if (tf) {
            if (!this.pressed.has(operation)) {
                this.operate(operation)
            }

            this.pressed.add(operation)
        } else {
            this.pressed.delete(operation)
        }
    }
}
