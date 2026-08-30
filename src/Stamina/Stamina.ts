import { LocalStorage } from "../LocalStorage"
import { StaminaConfig } from "./StaminaConfig"

/**
 * ソシャゲ的なスタミナ（体力）システム。
 *
 * ステージへの挑戦には一定量のスタミナを消費し、時間経過で自動的に回復する。
 * 経過時間から回復量を都度計算するため、アプリを閉じている間も裏側で回復が進む。
 */
export class Stamina {
    private constructor(
        private _current: number,
        private lastUpdatedAt: number,
    ) {}

    /** 保存されている状態を読み込み、経過時間分の回復を反映してから返す。 */
    static load(): Stamina {
        const data = LocalStorage.getStamina()
        const stamina = new Stamina(data.current, data.lastUpdatedAt)
        stamina.recover()
        return stamina
    }

    get current(): number {
        return this._current
    }

    get max(): number {
        return StaminaConfig.MAX
    }

    get isFull(): boolean {
        return this._current >= StaminaConfig.MAX
    }

    canConsume(cost: number = StaminaConfig.COST): boolean {
        return this._current >= cost
    }

    /** 消費を試みる。足りなければ何もせずfalseを返す。成功したら状態を保存してtrueを返す。 */
    consume(cost: number = StaminaConfig.COST): boolean {
        if (!this.canConsume(cost)) return false

        this._current -= cost
        this.save()
        return true
    }

    /** 次の1回復までの残り時間(ms)。満タンなら0。 */
    msUntilNextRecover(): number {
        if (this.isFull) return 0
        return Math.max(0, StaminaConfig.RECOVER_INTERVAL_MS - (Date.now() - this.lastUpdatedAt))
    }

    private recover(): void {
        if (this.isFull) {
            this.lastUpdatedAt = Date.now()
            return
        }

        const elapsed = Date.now() - this.lastUpdatedAt
        const recoveredAmount = Math.floor(elapsed / StaminaConfig.RECOVER_INTERVAL_MS)
        if (recoveredAmount <= 0) return

        this._current = Math.min(StaminaConfig.MAX, this._current + recoveredAmount)

        // 満タンでなければ端数の経過時間を次回に持ち越す
        this.lastUpdatedAt = this.isFull ? Date.now() : this.lastUpdatedAt + recoveredAmount * StaminaConfig.RECOVER_INTERVAL_MS

        this.save()
    }

    private save(): void {
        LocalStorage.setStamina({ current: this._current, lastUpdatedAt: this.lastUpdatedAt })
    }
}
