import { Scene } from "./Scene"
import { Pages } from "../utils/Pages/Pages"
import { Dom } from "../Dom"

import { actList, chapterList } from "../stages"
import { Selector } from "../utils/Selector"
import { SceneChanger } from "../utils/SceneChanger"
import { SE } from "../SE"
import { HTMLNumberElement } from "../utils/HTMLNumberElement"
import { LocalStorage } from "../LocalStorage"
import { g } from "../global"
import { MathEx } from "../utils/Functions/MathEx"
import { Awaits } from "../utils/Functions/Awaits"
import { createPage } from "./createPage"
import { downLoadString } from "../utils/Functions/downLoadString"
import typia from "typia"
import { ConfigMap } from "../utils/UnifiedInput/Binding"
import { MyActionId } from "../utils/UnifiedInput/DefaultConfig"

const FINISHED = 36

export default class implements Scene {
    private readonly pages = new Pages()
    private readonly selector

    constructor(
        private readonly config: {
            history?: readonly string[]
            clear?: number
        } = {},
    ) {
        this.selector = new Selector({
            "[data-stage]": { alias: "stage-button", expectedCount: 64 },
            ".act-button": { alias: "act-button", expectedCount: 16 },
            ".chapter-button": { alias: "chapter-button", expectedCount: 4 },

            "#swipe-ratio": { alias: "swipe-ratio" },
            "#volume-bgm": { alias: "volume-bgm" },
            "#volume-se": { alias: "volume-se" },
            "#delete-data": { alias: "delete-data" },
            "#download-template": { alias: "download-template" },
            "#load-template": { alias: "load-template" },

            ".fullscreen": { alias: "fullscreen" },
        })
    }

    async start(): Promise<void> {
        Dom.container.style.opacity = "0"
        Dom.container.innerHTML = ""

        const html = createPage()
        Dom.container.insertAdjacentHTML("beforeend", html)

        await this.pages.loadFromFile(Dom.container, "./asset/page/title/title.html", {
            history: this.config.history ?? ["title"],
            override: false,
        })

        Dom.container.style.opacity = "1"

        this.selector.load(Dom.container)

        this.selector.onClick("stage-button", ({ element, index }) => {
            const stageName = element.dataset.stage
            if (!stageName) throw new Error("Stage name is missing")

            this.gotoStage(index, stageName)
        })

        this.selector.onClick("fullscreen", () => {
            if (!document.fullscreenElement) {
                document.body.requestFullscreen()
            } else {
                document.exitFullscreen()
            }
        })

        this.setupSetting()
        this.lockButtons()
        this.evaluateStageCleared()
        this.setupUnlockAnimation()
        this.unlockStage()
        this.lock(this.selector.getAll("stage-button", HTMLButtonElement)[FINISHED], "unimplemented")
    }

    private setupUnlockAnimation() {
        this.pages.onEnter("act-.*", async () => {
            this.unlockStage()
        })

        this.pages.onEnter("chapter-.*", async () => {
            this.unlockAct()
        })

        this.pages.onEnter("chapters", async () => {
            this.unlockChapter()
        })
    }

    private async unlockChapter() {
        if (this.config.clear === undefined) return
        if (this.config.clear % 16 !== 15) return // Chapterは16ステージクリアごとにアンロックされるので、16で割った余りが15でない場合はアンロックされない
        const firstUncleared = LocalStorage.getFirstUncleared()
        if (this.config.clear + 1 < firstUncleared) return

        const targetChapterIndex = Math.floor(this.config.clear / 16) + 1
        const buttons = this.selector.getAll("chapter-button", HTMLButtonElement)
        const button = buttons[targetChapterIndex]
        if (!button) return
        await this.unlockButtonAnimation(button)
    }

    private async unlockAct() {
        if (this.config.clear === undefined) return
        if (this.config.clear % 4 !== 3) return // Actは4ステージクリアごとにアンロックされるので、4で割った余りが3でない場合はアンロックされない

        const firstUncleared = LocalStorage.getFirstUncleared()
        if (this.config.clear + 1 < firstUncleared) return

        const targetChapterPageId = chapterList[Math.floor((this.config.clear + 1) / 16)] // クリアしたステージのChapterページIDを計算
        const pageId = this.pages.getCurrentPageId()
        console.log(pageId, targetChapterPageId)
        if (pageId !== "chapter-" + targetChapterPageId) return

        const targetActIndex = Math.floor(this.config.clear / 4) + 1
        const buttons = this.selector.getAll("act-button", HTMLButtonElement)
        const button = buttons[targetActIndex]
        if (!button) return

        await this.unlockButtonAnimation(button)
    }

    private async unlockStage() {
        if (this.config.clear === FINISHED - 1) return
        if (this.config.clear === undefined) return

        const firstUncleared = LocalStorage.getFirstUncleared()
        if (this.config.clear + 1 < firstUncleared) return

        const nextStageIndex = this.config.clear + 1

        const targetActPageId = actList[Math.floor(nextStageIndex / 4)] // クリアしたステージのActページIDを計算
        const pageId = this.pages.getCurrentPageId()

        // 今開いたActページが、クリアしたステージが含まれるページかチェック
        if (pageId !== "act-" + targetActPageId) return

        // 次のステージのボタンを取得
        const buttons = this.selector.getAll("stage-button", HTMLButtonElement)
        const button = buttons[nextStageIndex]
        if (!button) return

        await this.unlockButtonAnimation(button)
    }

    private async unlockButtonAnimation(button: HTMLButtonElement) {
        this.lock(button) // いったんロック（アニメーションのため）
        button.disabled = false

        const lockLayer = button.querySelector(".lock.lock-normal")!
        // 1. アニメーションクラスを付与
        lockLayer.classList.add("unlocking")

        SE.unlock.play()

        await Awaits.sleep(1000) // アニメーションの長さに合わせて待機（CSSのanimation-duration + animation-delayの合計）

        lockLayer.remove()
    }

    private setupSetting() {
        const swipeRatio = this.selector.getFirst("swipe-ratio", HTMLNumberElement)

        swipeRatio.oninput = () => {
            LocalStorage.setSwipeRatio(swipeRatio.value)
        }

        const volumeBGM = this.selector.getFirst("volume-bgm", HTMLNumberElement)

        volumeBGM.oninput = () => {
            LocalStorage.setVolumeBGM(volumeBGM.value)
        }

        const volumeSE = this.selector.getFirst("volume-se", HTMLNumberElement)

        volumeSE.oninput = () => {
            LocalStorage.setVolumeSE(volumeSE.value)
            SE.setVolume(LocalStorage.getVolumeSE() / 9)
        }

        swipeRatio.value = LocalStorage.getSwipeRatio()
        volumeBGM.value = LocalStorage.getVolumeBGM()
        volumeSE.value = LocalStorage.getVolumeSE()

        this.selector.onClick("delete-data", () => {
            if (confirm("データを初期化する?")) {
                LocalStorage.clear()
                alert("データを初期化した")
                this.setupSetting()
                this.lockButtons()
                this.evaluateStageCleared()
            }
        })

        this.selector.onClick("download-template", () => {
            downLoadString(JSON.stringify(LocalStorage.getConfig(), null, 4), "key-config")
        })

        this.selector.onClick("load-template", async () => {
            const file = await Awaits.inputFile(".json")
            if (!file) return

            const text = await file.text()

            try {
                const obj = JSON.parse(text)
                const config = typia.assert<ConfigMap<MyActionId>>(obj)
                LocalStorage.setConfig(config)
                g.input.updateConfig(config)
            } catch (error) {
                alert("えらー！")
                console.error(error)
            }
        })
    }

    private lockButtons() {
        const firstUnclearedStage = LocalStorage.getFirstUncleared()
        const firstUnclearedAct = Math.floor(firstUnclearedStage / 4)
        const firstUnclearedChapter = Math.floor(firstUnclearedAct / 4)

        this.selector.getAll("stage-button", HTMLButtonElement).forEach((button, index) => {
            if (index > firstUnclearedStage) {
                this.lock(button)
            }
        })

        this.selector.getAll("act-button", HTMLButtonElement).forEach((button, index) => {
            if (index > firstUnclearedAct) {
                this.lock(button)
            }
        })

        this.selector.getAll("chapter-button", HTMLButtonElement).forEach((button, index) => {
            if (index > firstUnclearedChapter) {
                this.lock(button)
            }
        })
    }

    private lock(button: HTMLButtonElement, reason: "normal" | "unimplemented" = "normal") {
        const text = reason === "normal" ? "--:: 封 ::--" : "×=× 未 ×=×"
        const className = reason === "normal" ? "lock-normal" : "lock-unimplemented"

        button.insertAdjacentHTML("beforeend", `<div class="lock ${className}">${text}</div>`)
        button.disabled = true
    }

    private evaluateStageCleared() {
        const stages = LocalStorage.getStages()

        const gold = "var(--gold)"
        const silver = "var(--silver)"
        const bronze = "var(--bronze)"

        this.selector.getAll("stage-button").forEach((button, index) => {
            const rankEl = button.querySelector(".rank") as HTMLElement

            const rank = stages[index]

            if (rank === 0) {
                rankEl.textContent = ""
                return
            }

            rankEl.textContent = "★"
            rankEl.style.background = rank === 2 ? gold : silver
            rankEl.style.backgroundClip = "text"
            rankEl.style.webkitTextFillColor = "transparent"
        })

        this.selector.getAll("act-button").forEach((button, index) => {
            const actIndex = index
            const stageIndex = actIndex * 4
            const actStages = stages.slice(stageIndex, stageIndex + 4)

            const rankEl = button.querySelector(".rank") as HTMLElement
            rankEl.innerHTML = actStages
                .map((rank) => {
                    if (rank === 0) return "<span>☆</span>"
                    return `<span style="background: ${rank === 2 ? gold : silver}; background-clip: text;">★</span>`
                })
                .join("")
        })

        this.selector.getAll("chapter-button").forEach((button, index) => {
            const chapterIndex = index
            const actIndex = chapterIndex * 4
            const stageIndex = actIndex * 4
            const chapterStages: number[] = stages.slice(stageIndex, stageIndex + 16)

            const progress = Math.floor((MathEx.sum(chapterStages) / 32) * 100)

            // const medal = (() => {
            //     if (progress === 100)
            //         return `<span style="background-color: ${gold}">●</span>`
            //     if (progress > 66)
            //         return `<span style="background-color: ${silver}">●</span>`
            //     if (progress > 33)
            //         return `<span style="background-color: ${bronze}">●</span>`
            //     return ""
            // })()

            const rankEl = button.querySelector(".rank") as HTMLElement
            rankEl.innerHTML = `${progress}%`
        })
    }

    async end(): Promise<void> {}

    private gotoStage(stageIndex: number, stageName: string) {
        SE.start.play()

        document.querySelectorAll("button").forEach((b) => (b.disabled = true))

        const chapter = chapterList[Math.floor(stageIndex / 16)]

        SceneChanger.goto(
            async () => {
                // @ts-ignore
                const modules = import.meta.glob("../Stage/*/*")
                const url = `../Stage/${chapter}/Stage${stageName}.ts`
                const { default: Stage } = await modules[url]()

                const stage = new Stage()
                const scene = await import(`./SceneStage`).then(
                    (module) => new module.default(stageIndex, stage, this.pages.getHistory()),
                )
                return scene
            },
            {
                msIn: 1000,
                msOut: 1000,
            },
        )
    }
}
