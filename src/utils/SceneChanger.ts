import { Awaits } from "./Functions/Awaits"
import { Transition } from "./Functions/Transition"
import { Scene } from "../Scene/Scene.js"

type FadeFunction = (container: HTMLElement, ms: number) => Promise<void>

export class SceneChanger {
    private static currentScene: Scene

    private static container: HTMLElement

    static onTransitionStart = () => {}
    static onTransitionEnd = () => {}

    static init(container: HTMLElement, firstScene: Scene) {
        this.container = container
        this.currentScene = firstScene
        return this.currentScene.start()
    }

    static async goto(
        newScene: () => Promise<Scene>,
        {
            showLoading = this.showLoading,
            hideLoading = this.hideLoading,
            fadeOut = Transition.fadeOut,
            fadeIn = Transition.fadeIn,
            msIn = 200,
            msOut = 200,
            afterLoad = () => {},
        }: {
            showLoading?: () => void
            hideLoading?: () => void
            fadeOut?: FadeFunction
            fadeIn?: FadeFunction
            msIn?: number
            msOut?: number
            afterLoad?: () => void
        } = {},
    ) {
        this.onTransitionStart()

        const container = this.container

        await Promise.all([this.currentScene.end(), fadeOut(container, msIn)])

        // newScene()をawaitせずに先に起動しておく
        const loadAll = (async () => {
            this.currentScene = await newScene()
            await this.currentScene.start()
        })()

        // newScene()を含めた全体を計測対象にする
        const { over } = await Awaits.loading(250, loadAll, () => {
            showLoading()
        })

        if (over) hideLoading()

        afterLoad()

        this.onTransitionEnd()
        await fadeIn(container, msOut)
    }

    private static showLoading() {
        const p = document.createElement("p")
        p.textContent = "Loading..."
        p.classList.add("loading")
        document.body.appendChild(p)
    }

    private static hideLoading() {
        document.querySelectorAll(".loading").forEach((e) => e.remove())
    }
}
