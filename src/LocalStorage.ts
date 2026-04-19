import * as lzstring from "lz-string"
import { DEFAULT_CONFIG, MyActionId } from "./utils/UnifiedInput/DefaultConfig"
import { Binding } from "./utils/UnifiedInput/Binding"

export class LocalStorage {
    private static readonly KEY = "The Noisy Days!"

    private static readonly DEFAULT: Data = {
        stages: Array(64).fill(0) as (0 | 1 | 2)[],
        swipeRatio: 1,
        volumeBGM: 9,
        volumeSE: 9,

        config: DEFAULT_CONFIG,
    }

    private static get(): Data {
        try {
            const compressed = localStorage.getItem(this.KEY)
            if (!compressed) return structuredClone(this.DEFAULT)

            const json = lzstring.decompressFromUTF16(compressed)
            if (!json) throw new Error("Decompression failed")

            return JSON.parse(json)
        } catch {
            return structuredClone(this.DEFAULT)
        }
    }

    private static set(data: Data) {
        const compressed = lzstring.compressToUTF16(JSON.stringify(data))
        localStorage.setItem(this.KEY, compressed)
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

    static getConfig() {
        return this.get().config ?? DEFAULT_CONFIG
    }

    static setConfig(value: Record<MyActionId, readonly Binding[]>) {
        const data = this.get()
        data.config = value
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

    config: Record<MyActionId, readonly Binding[]>
}
;(window as any).LocalStorage = LocalStorage
