import stages from "../stages"

export function createPage(): string {
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

            const actPages = chapter["acts"].map((act) => createActPage(chapter["chapter-name"], act)).join("")

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
