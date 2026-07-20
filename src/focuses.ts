import { Focuses } from "@ipota/focuses"
import { di } from "./input"
import { Pages } from "@ipota/pages"

export const focuses = new Focuses(di)

export function pageRefocus(pages: Pages) {
    pages.onTransitionEnd(() => {
        focuses.setPage(pages.getCurrentPage())
    })
}
