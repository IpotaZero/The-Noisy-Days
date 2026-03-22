import { Dom } from "./Dom"
import { HTMLNumberElement } from "./utils/HTMLNumberElement"
import { HTMLRadioElement } from "./utils/HTMLRadioElement"
import { Focuses } from "./utils/Focuses/Focuses"
import { isSmartPhone } from "./utils/isSmartPhone"
import { Pages } from "./utils/Pages/Pages"
import { SceneChanger } from "./utils/SceneChanger"
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

    SceneChanger.init(Dom.container, await import("./Scene/SceneTitle").then((module) => new module.default()))
})

window.addEventListener("contextmenu", (e) => {
    e.preventDefault()
})
