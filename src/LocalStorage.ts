export class LocalStorage {
    private static readonly KEY = "The Noisy Days!"

    private static get(): Data {
        const data = localStorage.getItem(this.KEY)

        if (!data) {
            return {
                cleared: 0,
            }
        }

        return JSON.parse(data)
    }

    private static set(data: Data) {
        localStorage.setItem(this.KEY, JSON.stringify(data))
    }

    static getClearedStage(): number {
        return this.get().cleared
    }

    static setClearedStage(num: number): void {
        const data = this.get()
        data.cleared = num
        this.set(data)
    }
}

type Data = {
    cleared: number
}
