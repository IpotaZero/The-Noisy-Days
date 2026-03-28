import { Scene } from "./Scene"
import { Pages } from "../utils/Pages/Pages"
import { Dom } from "../Dom"

import stages from "../stages"
import { Selector } from "../utils/Selector"
import { SceneChanger } from "../utils/SceneChanger"
import { SE } from "../SE"

export default class implements Scene {
    private readonly pages = new Pages()
    private readonly selector

    constructor(private readonly config: { history?: readonly string[] } = {}) {
        this.selector = new Selector({
            "[data-stage]": { alias: "stage-button", expectedCount: 80 },
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
                <p>aaaaaaaa</p>
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
                        <h2>${chapter["chapter-name"]}</h2>
                        <p>${chapter["description"]}</p>
                    </section>

                    <div class="options" data-direction="column">
                        ${chapter["acts"].map(createActButton).join("")}
                    </div>

                    <div class="options" data-direction="row"><button data-back>Back</button></div>
                </div>
            `

            const actPages = chapter["acts"].map(createActPage).join("")

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
            <img class="icon" />
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
            <img class="icon" />
            <section>
                <h3>${act["act-name"]}</h3>
                <p class="description">${act["description"]}</p>
            </section>
        </button>
    `
}

function createActPage(act: Act): string {
    return `
        <div class="page" id="act-${act["act-name"]}">
            <section class="page-description">
                <h3>${act["act-name"]}</h3>
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
            <img class="icon" />
            <section>
                <h4>${stage["stage-name"]}</h4>
                <p class="description">${stage["description"]}</p>
            </section>
        </button>
    `
}
