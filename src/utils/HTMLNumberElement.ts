export class HTMLNumberElement extends HTMLElement {
    static observedAttributes = ["value", "max", "min", "step", "digits"]

    private _valueSpan: HTMLSpanElement | null = null

    constructor() {
        super()
    }

    // プロパティと属性の同期
    get value(): number {
        return Number(this.getAttribute("value")) || 0
    }
    set value(v: number) {
        this.setAttribute("value", String(this.clamp(v)))
    }

    get min(): number {
        return Number(this.getAttribute("min")) || 0
    }
    set min(v: number) {
        this.setAttribute("min", String(v))
    }

    get max(): number {
        return Number(this.getAttribute("max")) || 100
    }
    set max(v: number) {
        this.setAttribute("max", String(v))
    }

    // 2. step プロパティの追加（デフォルトは 1）
    get stepValue(): number {
        return Number(this.getAttribute("step")) || 1
    }
    set stepValue(v: number) {
        this.setAttribute("step", String(v))
    }

    // 表示する小数点以下の桁数。指定がない場合は step の精度に合わせる
    get digits(): number {
        const d = this.getAttribute("digits")
        if (d !== null) return Number(d)
        // digits の指定がない場合は、step 属性の小数点以下の桁数をデフォルトにする
        const s = this.stepValue.toString()
        return (s.split(".")[1] || "").length
    }
    set digits(v: number) {
        this.setAttribute("digits", String(v))
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

    private clamp(v: number): number {
        return Math.max(this.min, Math.min(this.max, v))
    }

    // 3. 計算ロジックの修正
    private step(direction: number) {
        const prevValue = this.value
        const s = this.stepValue

        // 浮動小数点数の誤差を考慮した計算
        // stepが 0.1 の場合などに備え、精度の桁数を取得して丸める
        const precision = (s.toString().split(".")[1] || "").length
        const newValue = this.clamp(prevValue + direction * s)
        this.value = Number(newValue.toFixed(precision))

        if (prevValue !== this.value) {
            this.dispatchEvent(new Event("input", { bubbles: true }))
        }
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

        <button class="btn" id="dec">-</button>
        <div class="value" id="val"></div>
        <button class="btn" id="inc">+</button>
        `

        this.querySelector("#dec")?.addEventListener("click", () => this.step(-1))
        this.querySelector("#inc")?.addEventListener("click", () => this.step(1))
        this._valueSpan = this.querySelector("#val")
    }

    private updateDisplay() {
        if (this._valueSpan) {
            // 指定された桁数で固定表示する
            this._valueSpan.textContent = this.value.toFixed(this.digits)
        }
    }
}

customElements.define("x-number", HTMLNumberElement)
