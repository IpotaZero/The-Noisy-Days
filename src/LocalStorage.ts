export class LocalStorage {
    private static readonly KEY = "The Noisy Days!"

    private static get(): Data {
        const data = localStorage.getItem(this.KEY)

        if (!data) {
            return {
                cleared: 0,
                swipeRatio: 1,
                volumeBGM: 9,
                volumeSE: 9,
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

    static getSwipeRatio() {
        return this.get().swipeRatio
    }

    static setSwipeRatio(num: number) {
        const data = this.get()
        data.swipeRatio = num
        this.set(data)
    }

    static getVolumeBGM() {
        return this.get().volumeBGM
    }

    static setVolumeBGM(num: number) {
        const data = this.get()
        data.volumeBGM = num
        this.set(data)
    }

    static getVolumeSE() {
        return this.get().volumeSE
    }

    static setVolumeSE(num: number) {
        const data = this.get()
        data.volumeSE = num
        this.set(data)
    }
}

type Data = {
    cleared: number
    swipeRatio: number
    volumeBGM: number
    volumeSE: number
}
