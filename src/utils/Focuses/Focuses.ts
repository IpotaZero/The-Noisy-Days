import { FocusesGridHandler } from "./FocusesGridHandler"
import { buildGrid, hidePointerTemporarily } from "./util"
import { UIInputOperator } from "./UIInputOperator"
import { IUnifiedInput } from "../UnifiedInput/Input"

export type Operation = "right" | "left" | "up" | "down" | "confirm" | "cancel"
export type Grid = readonly (readonly HTMLElement[])[]
export type FocusKey = readonly [number, number]

export class Focuses {
    private static readonly FOCUS_CLASS = "nav-focus"

    // GamepadOperator + KeyboardOperator を UIInputOperator 1 本に統合
    private static inputOperator: UIInputOperator

    private static readonly gridHandler = new FocusesGridHandler()

    private static readonly disabledReasons = new Set<string>()

    static remove() {
        this.inputOperator.remove()
    }

    static pause(reason: string) {
        this.disabledReasons.add(reason)
    }

    static resume(reason: string) {
        this.disabledReasons.delete(reason)
    }

    static init(input: IUnifiedInput<Operation>): void {
        this.inputOperator = new UIInputOperator(input, this.operate.bind(this))

        window.addEventListener("pointerdown", this.onPointerDown.bind(this))
        window.addEventListener("pointerover", this.onPointerOver.bind(this))

        // ゲームパッドが接続されたタイミングで rAF ループを開始する
        window.addEventListener("gamepadconnected", () => this.inputOperator.start(), { once: true })

        // キーボードは UnifiedInput 内部のイベントリスナーで即時対応済みのため、
        // ここでは start() を呼ばなくてよい。
        // ただしキーボードのみの環境向けに start() しておく。
        this.inputOperator.start()
    }

    static update(page: HTMLElement) {
        this.blur()
        this.gridHandler.setGrid(buildGrid(page))
        this.focus()
    }

    static setUnitButton(button: HTMLElement | undefined) {
        this.blur()

        if (button) {
            this.gridHandler.setGrid([[button]])
            this.focus()
        } else {
            this.gridHandler.setGrid([[]])
        }
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
            if (operation === "confirm") this.gridHandler.getFocusedElement()?.click()
            else if (operation === "cancel") this.gridHandler.getCancelButton()?.click()
        } else if (element instanceof HTMLSelectElement) {
            if (operation === "confirm") element.showPicker()
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
            current.scrollIntoView({ behavior: "smooth", block: "center" })
        }
    }
}
