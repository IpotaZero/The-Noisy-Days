import { Grid } from "./Focuses"

export function buildGrid(page: HTMLElement): Grid {
    const containers = Array.from(page.querySelectorAll(".options")).filter((e) => e instanceof HTMLElement)

    return containers
        .map((options) => {
            if (options.dataset.direction === "column") {
                return Array.from(options.querySelectorAll<HTMLElement>("button,input,select")).map((button) => [
                    button,
                ])
            } else if (options.dataset.direction === "row") {
                return [Array.from(options.querySelectorAll<HTMLElement>("button,input,select"))]
            }

            return []
        })
        .flat(1)
}

export function hidePointerTemporarily() {
    document.body.style.cursor = "none"

    window.addEventListener(
        "pointermove",
        () => {
            document.body.style.cursor = ""
        },
        { once: true },
    )
}

export function isCancelButton(button: HTMLElement) {
    return button.hasAttribute("data-back")
}
