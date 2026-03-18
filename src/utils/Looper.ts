export class Looper {
    private lastRunTime = 0
    private interval: number

    constructor(
        fps: number,
        private readonly handler: () => void,
        private readonly finishCondition: () => boolean,
    ) {
        this.interval = 1000 / fps
    }

    onFinished = () => {}

    setFPS(fps: number) {
        this.interval = 1000 / fps
    }

    start() {
        this.lastRunTime = performance.now()
        requestAnimationFrame(() => this.loop())
    }

    private loop() {
        const currentTime = performance.now()

        while (this.lastRunTime <= currentTime - this.interval) {
            this.handler()
            // lastRunTimeを正確な間隔分だけ進める（誤差の蓄積を防ぐ）
            this.lastRunTime += this.interval

            if (this.finishCondition()) {
                this.onFinished()
                return
            }
        }

        // 次のフレームを予約
        requestAnimationFrame(() => this.loop())
    }
}
