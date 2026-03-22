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

        this.currentScene = await newScene()

        const { over } = await Awaits.loading(1000, this.currentScene.start(), () => {
            showLoading() // ローディング画面表示
        })

        if (over) {
            hideLoading()
        }

        afterLoad() // 読み込み後処理

        this.onTransitionEnd()
        await fadeIn(container, msOut)
    }

    private static showLoading() {
        const p = document.createElement("p")
        p.textContent = "Loading"
        p.classList.add("loading")
        document.body.appendChild(p)
    }

    private static hideLoading() {
        document.querySelectorAll(".loading").forEach((e) => e.remove())
    }
}
