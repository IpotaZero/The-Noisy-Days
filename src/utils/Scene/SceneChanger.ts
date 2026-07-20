import { Transition } from "@ipota/functions"
import { Scene } from "./Scene"

export class SceneChanger {
    constructor(private readonly container: HTMLElement) {}

    private currentScene: Scene | undefined = undefined

    private isTransitioning = false

    onTransitionStart = () => {}
    onTransitionEnd = () => {}

    update() {
        if (this.currentScene && !this.isTransitioning) {
            this.currentScene.update()
        }
    }

    async goto(
        newScene: () => Promise<Scene>,
        config: Partial<{
            msIn: number
            msOut: number
        }> = {},
    ): Promise<void> {
        if (this.isTransitioning) return
        this.isTransitioning = true
        this.onTransitionStart()
        await Transition.fadeOut(this.container, config.msOut)

        if (this.currentScene) {
            await this.currentScene.end()
        }

        this.currentScene = await newScene()
        await this.currentScene.start()
        this.onTransitionEnd()
        this.isTransitioning = false

        await Transition.fadeIn(this.container, config.msIn)
    }
}
