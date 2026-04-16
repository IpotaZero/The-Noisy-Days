import { vec } from "./Vec"

export class GamepadTracker {
    // スティックの傾き (-1.0 ~ 1.0)
    axis = vec(0, 0)
    // 特定のアクション用のフラグ
    isSlow = false
    isDashPushed = false

    private lastDashState = false
    private readonly DEAD_ZONE = 0.1

    tick() {
        const pad = navigator.getGamepads()[0]
        if (!pad) {
            this.axis = vec(0, 0)
            return
        }

        // スティック取得（デッドゾーン処理）
        const x = Math.abs(pad.axes[0]) > this.DEAD_ZONE ? pad.axes[0] : 0
        const y = Math.abs(pad.axes[1]) > this.DEAD_ZONE ? pad.axes[1] : 0
        this.axis = vec(x, y)

        // 低速移動 (L1/R1/L2/R2)
        this.isSlow = [4, 5, 6, 7].some((i) => pad.buttons[i]?.pressed)

        // ダッシュ (A/B) の立ち上がり判定
        const dashPressed = pad.buttons[0]?.pressed || pad.buttons[1]?.pressed
        this.isDashPushed = dashPressed && !this.lastDashState
        this.lastDashState = dashPressed
    }
}
