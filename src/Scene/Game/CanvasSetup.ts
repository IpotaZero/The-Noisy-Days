import { Dom } from "../../Dom"
import { g } from "../../global"

export class CanvasSetup {
    readonly ctx: CanvasRenderingContext2D
    readonly initialRect = Dom.container.getClientRects()[0]
    private readonly resizeObserver: ResizeObserver

    constructor(canvas: HTMLCanvasElement) {
        this.ctx = canvas.getContext("2d", { alpha: false })!

        const applySize = (rect: { width: number; height: number }) => {
            g.height = g.width * (rect.height / rect.width)
            canvas.width = g.width
            canvas.height = g.height
        }

        applySize(this.initialRect)

        this.resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                applySize(entry.contentRect)
            }
        })
        this.resizeObserver.observe(Dom.container)
    }

    disconnect() {
        this.resizeObserver.disconnect()
    }
}
