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

        // 1. ロジック更新（handler）を指定回数実行[cite: 8]
        while (this.lastRunTime <= currentTime - this.interval) {
            this.handler() // SceneStageのtickなど[cite: 3]
            this.lastRunTime += this.interval
            if (this.isFinished) return
            count++
        }

        // 修正ポイント: 更新（処理）が発生した時のみ描画を実行する
        if (count > 0) {
            // 2. 描画処理（画面クリアと基本描画）を1回だけ実行[cite: 5]
            this.drawer?.()

            // 3. ジェネレーターの進行とエフェクトの描画
            // count回分回すことで、ラグ発生時もアニメーション速度を維持します
            for (let i = 0; i < count; i++) {
                this.afterDraw?.()
            }
        }

        requestAnimationFrame(() => this.loop())
    }
}
