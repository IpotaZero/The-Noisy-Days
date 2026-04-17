import { vec } from "./Vec"

export class GamepadTracker {
    // スティックの傾き (-1.0 ~ 1.0)
    axisLeft = vec(0, 0)
    axisRight = vec(0, 0)
    // 特定のアクション用のフラグ
    isSlow = false
    isDashPushed = false

    private lastDashState = false
    private readonly DEAD_ZONE = 0.1

    constructor(private readonly index: number) {}

    tick() {
        const pad = navigator.getGamepads()[this.index]
        if (!pad) {
            this.axisLeft = vec(0, 0)
            this.axisRight = vec(0, 0)
            return
        }

        // スティック取得（デッドゾーン処理）
        const xLeft = Math.abs(pad.axes[0]) > this.DEAD_ZONE ? pad.axes[0] : 0
        const yLeft = Math.abs(pad.axes[1]) > this.DEAD_ZONE ? pad.axes[1] : 0
        this.axisLeft = vec(xLeft, yLeft)

        // スティック取得（デッドゾーン処理）
        const xRight = Math.abs(pad.axes[2]) > this.DEAD_ZONE ? pad.axes[2] : 0
        const yRight = Math.abs(pad.axes[3]) > this.DEAD_ZONE ? pad.axes[3] : 0
        this.axisRight = vec(xRight, yRight)

        // 低速移動 (L1/R1/L2/R2)
        this.isSlow = [4, 5, 6, 7].some((i) => pad.buttons[i]?.pressed)

        // ダッシュ (A/B/X/Y) の立ち上がり判定
        const dashPressed = [0, 1, 2, 3].some((i) => pad.buttons[i]?.pressed)
        this.isDashPushed = dashPressed && !this.lastDashState
        this.lastDashState = dashPressed
    }

    getAxis() {
        return this.axisLeft.plus(this.axisRight)
    }
}
