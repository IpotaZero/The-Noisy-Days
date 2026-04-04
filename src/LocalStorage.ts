export class LocalStorage {
    private static readonly KEY = "The Noisy Days!"

    private static get(): Data {
        const data = localStorage.getItem(this.KEY)

        if (!data) {
            return {
                stages: Array(64).fill(0) as (0 | 1 | 2)[],
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

    static getStages() {
        return this.get().stages
    }

    static getFirstUncleared() {
        const data = this.get()
        return data.stages.findIndex((rank) => rank === 0)
    }

    static updateClearedStage(stageIndex: number, rank: 0 | 1 | 2) {
        const data = this.get()
        const currentRank = data.stages[stageIndex]
        if (currentRank < rank) {
            data.stages[stageIndex] = rank
            this.set(data)
        }
    }

    static setClearedStage(stageIndex: number, rank: 0 | 1 | 2) {
        const data = this.get()
        data.stages[stageIndex] = rank
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

    static clear() {
        localStorage.removeItem(this.KEY)
    }
}

type Data = {
    stages: (0 | 1 | 2)[]
    swipeRatio: number
    volumeBGM: number
    volumeSE: number
}
;(window as any).LocalStorage = LocalStorage
