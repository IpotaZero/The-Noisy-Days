import { Scene } from "./Scene"
import { Pages } from "../utils/Pages/Pages"
import { Dom } from "../Dom"

import stages from "../stages"

export default class implements Scene {
    async start(): Promise<void> {
        const html = createPage()
        Dom.container.insertAdjacentHTML("beforeend", html)

        const pages = new Pages()
        await pages.loadFromFile(Dom.container, "./asset/page/title/title.html", {
            history: ["title"],
            override: false,
        })
    }

    async end(): Promise<void> {}
}

function createPage(): string {
    return stages
        .map((chapter) => {
            const chapterPage = `
                <div class="page" id="chapter-${chapter["chapter-name"]}">
                    <section class="chapter-description">
                        <h2>${chapter["chapter-name"]}</h2>
                        <p>${chapter["chapter-description"]}</p>
                    </section>

                    <div class="options" data-direction="column">
                        ${chapter["acts"].map((act) => `<button data-link="act-${act["act-name"]}">${act["act-name"]}</button>`).join("")}
                    </div>

                    <button data-back>Back</button>
                </div>
            `

            const actPages = chapter["acts"].map(createActPage).join("")

            return chapterPage + actPages
        })
        .join("")
}

type Act = {
    "act-name": string
    "description": string
    "stages": Stage[]
}

function createActPage(act: Act): string {
    return `
        <div class="page" id="act-${act["act-name"]}">
            <section class="act-description">
                <h3>${act["act-name"]}</h3>
                <p>${act["description"]}</p>
            </section>

            <div class="options" data-direction="column">
                ${act["stages"].map(createStageButton).join("")}
            </div>

            <button data-back>Back</button>
        </div>
    `
}

type Stage = {
    "stage-name": string
    "description": string
}

function createStageButton(stage: Stage): string {
    return `
        <button class="stage-button">
            <img class="stage-icon" />
            <section>
                <h4>${stage["stage-name"]}</h4>
                <p class="stage-description">${stage["description"]}</p>
            </section>
        </button>
    `
}
