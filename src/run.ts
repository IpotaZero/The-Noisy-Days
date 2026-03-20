import { Dom } from "./Dom"
import { Focuses } from "./utils/Focuses/Focuses"
import { Pages } from "./utils/Pages/Pages"
import { SceneChanger } from "./utils/SceneChanger"

window.addEventListener("DOMContentLoaded", async () => {
    Dom.init()
    Focuses.init()

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
        Focuses.update(pages.getCurrentPage())
        Focuses.resume("page-change")
    }

    SceneChanger.init(Dom.container, await import("./Scene/SceneTitle").then((module) => new module.default()))
})

window.addEventListener("contextmenu", (e) => {
    e.preventDefault()
})
