export class Sound {
    #audio: HTMLAudioElement
    #baseVolume: number

    constructor(path: string, volume: number = 0.5) {
        this.#audio = new Audio(path)
        this.#baseVolume = volume
        this.#audio.volume = volume
        this.#audio.preload = "auto"
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
    static graze = new Sound("asset/se/graze.wav", 0.1)
    static u = new Sound("asset/se/u.mp3")
    static hit = new Sound("asset/se/player_hit.mp3")
    static crush = new Sound("asset/se/crush.mp3")
    static dash = new Sound("asset/se/dash.mp3")

    static setVolume(volume: number) {
        console.log(volume)
        Object.values(this).forEach((se) => {
            se.setVolume(volume)
        })
    }
}
