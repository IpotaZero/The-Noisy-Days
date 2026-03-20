export class Sound {
    #audio: HTMLAudioElement
    #baseVolume: number

    constructor(path: string, volume: number = 0.5) {
        this.#audio = new Audio(path)
        this.#baseVolume = volume
        this.#audio.volume = volume
        this.#audio.preload = "auto"
    }

    get duration() {
        return this.#audio.duration
    }

    play() {
        this.#audio.currentTime = 0
        this.#audio.play()
    }

    setVolume(ratio: number) {
        this.#audio.volume = ratio * this.#baseVolume
    }
}

export class SE {
    static start = new Sound("asset/se/mushi.mp3", 1)

    static setVolume(volume: number) {
        Object.values(this).forEach((se) => {
            se.setVolume(volume)
        })
    }
}
