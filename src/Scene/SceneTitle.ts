import { Scene } from "./Scene"
import { Pages } from "../utils/Pages/Pages"
import { Dom } from "../Dom"

import stages from "../stages"
import { Selector } from "../utils/Selector"
import { SceneChanger } from "../utils/SceneChanger"
import { SE } from "../SE"
import { HTMLNumberElement } from "../utils/HTMLNumberElement"
import { LocalStorage } from "../LocalStorage"
import { g } from "../global"

export default class implements Scene {
    private readonly pages = new Pages()
    private readonly selector

    constructor(private readonly config: { history?: readonly string[] } = {}) {
        this.selector = new Selector({
            "[data-stage]": { alias: "stage-button", expectedCount: 64 },
            "#swipe-ratio": { alias: "swipe-ratio" },
            "#volume-bgm": { alias: "volume-bgm" },
            "#volume-se": { alias: "volume-se" },
        })
    }

    async start(): Promise<void> {
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

        this.selector.load(Dom.container)

        this.selector.onClick("stage-button", ({ element }) => {
            const stageName = element.dataset.stage
            if (!stageName) throw new Error("Stage name is missing")

            this.gotoStage(stageName)
        })

        this.setupSetting()
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
    }

    async end(): Promise<void> {}

    private gotoStage(stageName: string) {
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
                        new module.default(stage, this.pages.getHistory()),
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
        <button class="button" data-link="chapter-${chapter["chapter-name"]}">
            <img class="icon" src="asset/image/icon.ico" />
            <section>
                <h2>${chapter["chapter-name"]}</h2>
                <p class="description">${chapter["description"]}</p>
            </section>
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
        <button class="button" data-link="act-${act["act-name"]}">
            <img class="icon" src="asset/image/icon.ico" />
            <section>
                <h3>${act["act-name"]}</h3>
                <p class="description">${act["description"]}</p>
            </section>
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
            <img class="icon" src="asset/image/icon.ico" />
            <section>
                <h4>${stage["stage-name"]}</h4>
                <p class="description">${stage["description"]}</p>
            </section>
        </button>
    `
}
