import { Dom } from "./Dom"
import { HTMLNumberElement } from "./utils/HTMLNumberElement"
import { HTMLRadioElement } from "./utils/HTMLRadioElement"
import { Focuses } from "./utils/Focuses/Focuses"
import { isSmartPhone } from "./utils/Functions/isSmartPhone"
import { Pages } from "./utils/Pages/Pages"
import { SceneChanger } from "./utils/SceneChanger"
import { SE } from "./SE"
import { LocalStorage } from "./LocalStorage"
HTMLNumberElement
HTMLRadioElement

window.addEventListener("DOMContentLoaded", async () => {
    Dom.init()
    Focuses.init()

    const smaho = isSmartPhone()

    if (smaho) {
        Focuses.pause("all")
    }

    SceneChanger.onTransitionStart = () => {
        Focuses.pause("scene-change")
    }

    SceneChanger.onTransitionEnd = () => {
        Focuses.resume("scene-change")
    }

    Pages.onTransitionStart = () => {
        Focuses.pause("page-change")
    }

    Pages.onTransitionEnd = (pages) => {
        if (!smaho) {
            Focuses.update(pages.getCurrentPage())
        }
        Focuses.resume("page-change")
    }

    SceneChanger.init(
        Dom.container,
        await import("./Scene/SceneTitle").then(
            (module) => new module.default(),
        ),
    )

    SE.setVolume(LocalStorage.getVolumeSE() / 9)
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
            "Tab",
        ].includes(e.code)
    )
        e.preventDefault()
})

window.addEventListener("contextmenu", (e) => {
    e.preventDefault()
})
