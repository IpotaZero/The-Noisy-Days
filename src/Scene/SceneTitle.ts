import { Scene } from "./Scene"
import { Pages } from "../utils/Pages/Pages"
import { Dom } from "../Dom"

import stages, { actList, chapterList, stageList } from "../stages"
import { Selector } from "../utils/Selector"
import { SceneChanger } from "../utils/SceneChanger"
import { SE } from "../SE"
import { HTMLNumberElement } from "../utils/HTMLNumberElement"
import { LocalStorage } from "../LocalStorage"
import { g } from "../global"
import { MathEx } from "../utils/Functions/MathEx"
import { Awaits } from "../utils/Functions/Awaits"

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
        })
    }

    async start(): Promise<void> {
        Dom.container.style.opacity = "0"
        Dom.container.innerHTML = ""

        const html = createPage()
        Dom.container.insertAdjacentHTML("beforeend", html)

        await this.pages.loadFromFile(
            Dom.container,
            "./asset/page/title/title.html",
            {
                history: this.config.history ?? ["title"],
                override: false,
            },
        )

        Dom.container.style.opacity = "1"

        this.selector.load(Dom.container)

        this.selector.onClick("stage-button", ({ element, index }) => {
            const stageName = element.dataset.stage
            if (!stageName) throw new Error("Stage name is missing")

            this.gotoStage(index, stageName)
        })

        this.setupSetting()
        this.lockButtons()
        this.evaluateStageCleared()
        this.setupUnlockAnimation()
        this.unlockStage()
        this.lock(
            this.selector.getAll("stage-button")[18] as HTMLButtonElement,
            "unimplemented",
        )
    }

    private setupUnlockAnimation() {
        this.pages.onEnter("act-.*", async () => {
            this.unlockStage()
        })

        this.pages.onEnter("chapter-.*", async () => {
            this.unlockAct()
        })
    }

    private async unlockAct() {
        if (this.config.clear === undefined) return
        if (this.config.clear % 4 !== 3) return // Actは4ステージクリアごとにアンロックされるので、4で割った余りが3でない場合はアンロックされない

        const firstUncleared = LocalStorage.getFirstUncleared()
        if (this.config.clear + 1 < firstUncleared) return

        const targetChapterPageId =
            chapterList[Math.floor(this.config.clear / 16)] // クリアしたステージのChapterページIDを計算
        const pageId = this.pages.getCurrentPageId()
        if (pageId !== "chapter-" + targetChapterPageId) return

        const targetActIndex = Math.floor(this.config.clear / 4) + 1
        const buttons = this.selector.getAll("act-button")
        const button = buttons[targetActIndex] as HTMLButtonElement
        if (!button) return

        await this.unlockButtonAnimation(button)
    }

    private async unlockStage() {
        if (this.config.clear === 17) return
        if (this.config.clear === undefined) return

        const firstUncleared = LocalStorage.getFirstUncleared()
        if (this.config.clear + 1 < firstUncleared) return

        const nextStageIndex = this.config.clear + 1

        const targetActPageId = actList[Math.floor(nextStageIndex / 4)] // クリアしたステージのActページIDを計算
        const pageId = this.pages.getCurrentPageId()

        // 今開いたActページが、クリアしたステージが含まれるページかチェック
        if (pageId !== "act-" + targetActPageId) return

        // 次のステージのボタンを取得
        const buttons = this.selector.getAll("stage-button")
        const button = buttons[nextStageIndex] as HTMLButtonElement
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
        const swipeRatio = this.selector.getFirst(
            "swipe-ratio",
        ) as HTMLNumberElement

        swipeRatio.oninput = () => {
            LocalStorage.setSwipeRatio(swipeRatio.value)
        }

        const volumeBGM = this.selector.getFirst(
            "volume-bgm",
        ) as HTMLNumberElement

        volumeBGM.oninput = () => {}

        const volumeSE = this.selector.getFirst(
            "volume-se",
        ) as HTMLNumberElement

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
    }

    private lockButtons() {
        const firstUnclearedStage = LocalStorage.getFirstUncleared()
        const firstUnclearedAct = Math.floor(firstUnclearedStage / 4)
        const firstUnclearedChapter = Math.floor(firstUnclearedAct / 4)

        this.selector
            .getAll("stage-button")
            .filter(
                (button): button is HTMLButtonElement =>
                    button instanceof HTMLButtonElement,
            )
            .forEach((button, index) => {
                if (index > firstUnclearedStage) {
                    this.lock(button)
                }
            })

        this.selector
            .getAll("act-button")
            .filter(
                (button): button is HTMLButtonElement =>
                    button instanceof HTMLButtonElement,
            )
            .forEach((button, index) => {
                if (index > firstUnclearedAct) {
                    this.lock(button)
                }
            })

        this.selector
            .getAll("chapter-button")
            .filter(
                (button): button is HTMLButtonElement =>
                    button instanceof HTMLButtonElement,
            )
            .forEach((button, index) => {
                if (index > firstUnclearedChapter) {
                    this.lock(button)
                }
            })
    }

    private lock(
        button: HTMLButtonElement,
        reason: "normal" | "unimplemented" = "normal",
    ) {
        const text = reason === "normal" ? "--:: 封 ::--" : "×=× 未 ×=×"
        const className =
            reason === "normal" ? "lock-normal" : "lock-unimplemented"

        button.insertAdjacentHTML(
            "beforeend",
            `<div class="lock ${className}">${text}</div>`,
        )
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
            const chapterStages: number[] = stages.slice(
                stageIndex,
                stageIndex + 16,
            )

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

        SceneChanger.goto(
            async () => {
                // @ts-ignore
                const modules = import.meta.glob("../Stage/*")
                const url = `../Stage/Stage${stageName}.ts`
                const { default: Stage } = await modules[url]()

                const stage = new Stage()
                const scene = await import(`./SceneStage`).then(
                    (module) =>
                        new module.default(
                            stageIndex,
                            stage,
                            this.pages.getHistory(),
                        ),
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

function createPage(): string {
    const chaptersPage = `
        <div class="page" id="chapters">
            <section class="page-description">
                <h2>Chapters</h2>
                <p>西暦2XXX年 トウキョウ</p>
            </section>

            <div class="options" data-direction="column">${stages.map(createChapterButton).join("")}</div>

            <div class="options" data-direction="row"><button data-back>Back</button></div>
        </div>
    `

    const chapterPages = stages
        .map((chapter) => {
            const chapterPage = `
                <div class="page" id="chapter-${chapter["chapter-name"]}">
                    <section class="page-description">
                        <h2>Chapters > ${chapter["chapter-name"]}</h2>
                        <p>${chapter["description"]}</p>
                    </section>

                    <div class="options" data-direction="column">
                        ${chapter["acts"].map(createActButton).join("")}
                    </div>

                    <div class="options" data-direction="row"><button data-back>Back</button></div>
                </div>
            `

            const actPages = chapter["acts"]
                .map((act) => createActPage(chapter["chapter-name"], act))
                .join("")

            return chapterPage + actPages
        })
        .join("")

    return chaptersPage + chapterPages
}

type Chapter = {
    "chapter-name": string
    "description": string
    "acts": Act[]
}

function createChapterButton(chapter: Chapter) {
    return `
        <button class="button chapter-button" data-link="chapter-${chapter["chapter-name"]}">
            <img class="icon" src="asset/image/background.png" />
            <section>
                <div class="title">
                    <span class="name">${chapter["chapter-name"]}</span>
                    <span class="rank"></span>
                </div>
                <p class="description">${chapter["description"]}</p>
            </section>
            <span class="button-arrow">＼<br>／</span>
        </button>
    `
}

type Act = {
    "act-name": string
    "description": string
    "stages": Stage[]
}

function createActButton(act: Act): string {
    return `
        <button class="button act-button" data-link="act-${act["act-name"]}">
            <img class="icon" src="asset/image/background.png" />
            <section>
                <div class="title">
                    <span class="name">${act["act-name"]}</span>
                    <span class="rank"></span>
                </div>
                <p class="description">${act["description"]}</p>
            </section>
            <span class="button-arrow">＼<br>／</span>
        </button>
    `
}

function createActPage(chapterName: string, act: Act): string {
    return `
        <div class="page" id="act-${act["act-name"]}">
            <section class="page-description">
                <h3>Chapters > ${chapterName} > ${act["act-name"]}</h3>
                <p>${act["description"]}</p>
            </section>

            <div class="options" data-direction="column">
                ${act["stages"].map(createStageButton).join("")}
            </div>

            <div class="options" data-direction="row"><button data-back>Back</button></div>
        </div>
    `
}

type Stage = {
    "stage-name": string
    "description": string
}

function createStageButton(stage: Stage): string {
    return `
        <button class="button" data-stage="${stage["stage-name"]}">
            <img class="icon" src="asset/image/background.png" />
            <section>
                <div class="title">
                    <span class="name">${stage["stage-name"]}</span>
                    <span class="rank"></span>
                </div>
                <p class="description">${stage["description"]}</p>
            </section>
        </button>
    `
}
