import { HTMLNumberElement } from "./utils/HTMLNumberElement"
import { HTMLRadioElement } from "./utils/HTMLRadioElement"
import { isSmartPhone } from "./utils/Functions/isSmartPhone"
import { SE } from "./SE"
import { LocalStorage } from "./LocalStorage"
import { Awaits } from "./utils/Functions/Awaits"
import { bm } from "./bgm"
import { ai, di, touch } from "./input"
import { focuses } from "./focuses"
import { sc } from "./sceneChanger"
import { looper } from "./looper"

HTMLNumberElement
HTMLRadioElement

window.addEventListener("DOMContentLoaded", async () => {
    if (isSmartPhone) {
        di.pause("all")
    }

    sc.onTransitionStart = () => {
        di.pause("scene-change")
    }

    sc.onTransitionEnd = () => {
        di.resume("scene-change")
        di.clear()
        focuses.clearMemory()
    }

    bm.setVolume(LocalStorage.getVolumeBGM() / 9)
    SE.setVolume(LocalStorage.getVolumeSE() / 9)

    const url = new URL(location.href)
    if (url.searchParams.has("cleared")) {
        const stageIndex = Number(url.searchParams.get("cleared"))

        for (let i = 0; i <= stageIndex; i++) {
            LocalStorage.updateClearedStage(i, 2)
        }
    }

    const loading = document.createElement("p")
    loading.textContent = "Loading..."
    loading.classList.add("loading")
    document.body.appendChild(loading)

    const resources = Promise.all([SE.init(), document.fonts.ready])

    const result = await Awaits.timeout(1000, resources)
    if (result === "timeout") {
        console.warn("フォントの読み込みに時間がかかりすぎ。スキップします。")
    }

    sc.goto(async () => await import("./Scene/SceneTitle").then((module) => new module.default()))

    loading.remove()

    looper.addHandler(() => {
        focuses.update()
        sc.update()
        di.update()
        ai.update()
    })

    looper.start()
})

window.addEventListener("keydown", (e) => {
    if (
        [
            "Enter",
            "Space",
            "ArrowUp",
            "ArrowDown",
            "ArrowRight",
            "ArrowLeft",
            "ControlLeft",
            "ControlRight",
            "ShiftLeft",
            "ShiftRight",
            "Tab",
        ].includes(e.code)
    )
        e.preventDefault()
})

window.addEventListener("contextmenu", (e) => {
    e.preventDefault()
})
