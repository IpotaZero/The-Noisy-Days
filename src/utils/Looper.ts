export class Looper {
    private lastRunTime = 0
    private interval: number

    private isFinished = false

    constructor(
        fps: number,
        private readonly handler: () => void,
        private readonly drawer?: () => void,
        private readonly afterDraw?: () => void,
    ) {
        this.interval = 1000 / fps
    }

    setFPS(fps: number) {
        this.interval = 1000 / fps
    }

    start() {
        this.lastRunTime = performance.now()
        requestAnimationFrame(() => this.loop())
    }

    stop() {
        this.isFinished = true
    }

    private loop() {
        if (this.isFinished) {
            return
        }

        const currentTime = performance.now()

        if (currentTime - this.lastRunTime > 1000) {
            this.lastRunTime = currentTime
            requestAnimationFrame(() => this.loop())
            return
        }

        let count = 0

        while (this.lastRunTime <= currentTime - this.interval) {
            this.handler()
            // lastRunTimeを正確な間隔分だけ進める（誤差の蓄積を防ぐ）
            this.lastRunTime += this.interval

            if (this.isFinished) {
                return
            }

            count++
        }

        this.drawer?.()

        for (let i = 0; i < count; i++) {
            this.afterDraw?.()
        }

        // 次のフレームを予約
        requestAnimationFrame(() => this.loop())
    }
}
