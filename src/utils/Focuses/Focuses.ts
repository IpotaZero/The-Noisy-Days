import { FocusesGridHandler } from "./FocusesGridHandler"
import { GamepadOperator } from "./GamepadOperator"
import { KeyboardOperator } from "./KeyboardOperator"
import { buildGrid, hidePointerTemporarily } from "./util"

export type Operation = "right" | "left" | "up" | "down" | "ok" | "cancel"
export type Grid = HTMLElement[][]
export type FocusKey = [number, number]

export class Focuses {
    private static readonly FOCUS_CLASS = "nav-focus"

    private static readonly gamepadOperator = new GamepadOperator(this.operate.bind(this))
    private static readonly keyboardOperator = new KeyboardOperator(this.operate.bind(this))

    private static readonly gridHandler = new FocusesGridHandler()

    private static readonly disabledReasons = new Set<string>()

    static remove() {
        this.gamepadOperator.remove()
        this.keyboardOperator.remove()
    }

    static pause(reason: string) {
        this.disabledReasons.add(reason)
    }

    static resume(reason: string) {
        this.disabledReasons.delete(reason)
    }

    static init(): void {
        window.addEventListener("pointerdown", this.onPointerDown.bind(this))
        window.addEventListener("pointerover", this.onPointerOver.bind(this))
        window.addEventListener("gamepadconnected", () => this.gamepadOperator.start(), { once: true })
    }

    static update(page: HTMLElement) {
        this.blur()
        this.gridHandler.setGrid(buildGrid(page))
        this.focus()
    }

    private static focus() {
        this.gridHandler.focusFirstButton()
        this.highlightButton()
    }

    private static operate(operation: Operation) {
        if (this.disabledReasons.size > 0) {
            console.log(`Operation denied. Reasons: ${Array.from(this.disabledReasons)}`)
            return
        }

        if (!this.gridHandler.hasFocus()) {
            this.gridHandler.focusFirstButton()
            this.highlightButton()
            return
        }

        if (operation === "up") this.gridHandler.moveRow(-1)
        else if (operation === "down") this.gridHandler.moveRow(1)
        else if (operation === "left") this.gridHandler.moveCol(-1)
        else if (operation === "right") this.gridHandler.moveCol(1)

        const element = this.gridHandler.getFocusedElement()

        if (element instanceof HTMLButtonElement) {
            if (operation === "ok") this.gridHandler.getFocusedElement()?.click()
            else if (operation === "cancel") this.gridHandler.getCancelButton()?.click()
        } else if (element instanceof HTMLSelectElement) {
            if (operation === "ok") element.showPicker()
        }

        hidePointerTemporarily()
        this.highlightButton()
    }

    private static onPointerDown(e: PointerEvent): void {
        const target = e.target
        if (target instanceof HTMLButtonElement) return

        this.gridHandler.blur()
        this.blur()
    }

    private static onPointerOver(e: PointerEvent): void {
        const target = e.target
        if (!(target instanceof HTMLButtonElement)) return
        if (target.disabled) return
        if (!target.closest(".options")) return

        this.gridHandler.focusByButton(target)
        this.highlightButton({ noScroll: true })
    }

    private static blur() {
        this.gridHandler.getAllButtons().forEach((b) => b.classList.remove(this.FOCUS_CLASS))
    }

    private static highlightButton({ noScroll }: { noScroll?: boolean } = {}): void {
        this.blur()

        const current = this.gridHandler.getFocusedElement()
        if (!current) return

        current.focus({ preventScroll: true })
        current.classList.add(this.FOCUS_CLASS)

        if (!noScroll) {
            current.scrollIntoView({ "behavior": "smooth", "block": "center" })
        }
    }
}
