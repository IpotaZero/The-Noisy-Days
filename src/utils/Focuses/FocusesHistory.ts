import { FocusKey } from "./Focuses"
import { isCancelButton } from "./util"

export class FocusesHistory {
    private stack: FocusKey[] = []
    private isCancelState = false

    /**
     * 操作内容を記録する。
     * キャンセルボタンならフラグを立て、そうでなければ位置を記録する。
     */
    record(button: HTMLButtonElement, key: FocusKey | null) {
        if (!key) return

        if (isCancelButton(button)) {
            this.isCancelState = true
        } else {
            this.isCancelState = false
            this.stack.push(key)
        }
    }

    /**
     * 復元すべき座標があるか確認し、あれば取得してフラグをリセットする。
     */
    popRestoreKey(): FocusKey | null {
        if (!this.isCancelState) return null

        this.isCancelState = false // 消費したのでリセット
        return this.stack.pop() ?? null
    }

    // 外部から強制リセットしたい場合（トップ画面に戻る時など）
    clear() {
        this.stack = []
        this.isCancelState = false
    }
}
