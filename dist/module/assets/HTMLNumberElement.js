var e=class extends HTMLElement{static observedAttributes=[`value`,`max`,`min`,`step`,`digits`];_valueSpan=null;constructor(){super()}get value(){return Number(this.getAttribute(`value`))||0}set value(e){this.setAttribute(`value`,String(this.clamp(e)))}get min(){return Number(this.getAttribute(`min`))||0}set min(e){this.setAttribute(`min`,String(e))}get max(){return Number(this.getAttribute(`max`))||100}set max(e){this.setAttribute(`max`,String(e))}get stepValue(){return Number(this.getAttribute(`step`))||1}set stepValue(e){this.setAttribute(`step`,String(e))}get digits(){let e=this.getAttribute(`digits`);return e===null?(this.stepValue.toString().split(`.`)[1]||``).length:Number(e)}set digits(e){this.setAttribute(`digits`,String(e))}set oninput(e){this.onventUpdate(`input`,e)}onventUpdate(e,t){this.removeEventListener(e,t),t&&this.addEventListener(e,t)}connectedCallback(){this.render(),this.updateDisplay()}attributeChangedCallback(e,t,n){this.updateDisplay()}clamp(e){return Math.max(this.min,Math.min(this.max,e))}step(e){let t=this.value,n=this.stepValue,r=(n.toString().split(`.`)[1]||``).length,i=this.clamp(t+e*n);this.value=Number(i.toFixed(r)),t!==this.value&&this.dispatchEvent(new Event(`input`,{bubbles:!0}))}render(){this.innerHTML=`
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
        `,this.querySelector(`#dec`)?.addEventListener(`click`,()=>this.step(-1)),this.querySelector(`#inc`)?.addEventListener(`click`,()=>this.step(1)),this._valueSpan=this.querySelector(`#val`)}updateDisplay(){this._valueSpan&&(this._valueSpan.textContent=this.value.toFixed(this.digits))}};customElements.define(`x-number`,e);export{e as t};
//# sourceMappingURL=HTMLNumberElement.js.map