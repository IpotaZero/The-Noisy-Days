export class HTMLRadioElement extends HTMLElement {
    static observedAttributes = ["index", "options"]

    private _container: HTMLElement | null = null
    private _buttons: readonly HTMLButtonElement[] = []

    constructor() {
        super()
    }

    // プロパティと属性の同期
    get index(): number {
        return Number(this.getAttribute("index"))
    }
    set index(v: number) {
        this.setAttribute("index", String(v))
        this.dispatchEvent(new Event("input"))
    }

    get options(): readonly string[] {
        return this.getAttribute("options")!
            .split(",")
            .map((t) => t.trim())
    }
    set options(v: readonly string[]) {
        this.setAttribute("options", v.join(","))
        this.updateDisplay()
    }

    // oninput ハンドラの定義
    set oninput(handler: (ev: Event) => any) {
        this.onventUpdate("input", handler)
    }

    private onventUpdate(type: string, handler: any) {
        this.removeEventListener(type, handler)
        if (handler) this.addEventListener(type, handler)
    }

    connectedCallback() {
        this.render()
        this.updateDisplay()
    }

    attributeChangedCallback(name: string, _old: string, _new: string) {
        this.updateDisplay()
    }

    private render() {
        this.innerHTML = `
        <style>
            .value {
                min-width: 2em;
                text-align: center;
                font-size: 1.2em;
            }
        </style>

        <div class="value" id="val"></div>
        `

        this._container = this.querySelector("#val")
    }

    private updateDisplay() {
        if (this._container) {
            this._container.innerHTML = this.options.map((option) => `<button>${option}</button>`).join("")
            this._buttons = Array.from(this._container.querySelectorAll("button"))

            this._buttons[this.index].disabled = true

            this._buttons.forEach((b, index) => {
                b.onclick = () => {
                    this.index = index
                }
            })
        }
    }
}

customElements.define("x-radio", HTMLRadioElement)
