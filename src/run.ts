import { Dom } from "./Dom"
import { SceneChanger } from "./utils/SceneChanger"

window.addEventListener("DOMContentLoaded", async () => {
    Dom.init()

    SceneChanger.init(Dom.container, await import("./Scene/SceneTitle").then((module) => new module.default()))
})

window.addEventListener("contextmenu", (e) => {
    e.preventDefault()
})
