const context = new AudioContext()
const gain = context.createGain()
gain.connect(context.destination)

export class Sound {
    private buffer: AudioBuffer | null = null

    private readonly localGain: GainNode = context.createGain()

    private lastPlayedTime = -1

    private constructor(baseVolume: number = 0.5) {
        this.localGain.gain.value = baseVolume
        this.localGain.connect(gain)
    }

    static async new(path: string, baseVolume: number = 0.5) {
        const sound = new Sound(baseVolume)
        await sound.load(path)
        return sound
    }

    private async load(path: string) {
        const res = await fetch(path)
        const array = await res.arrayBuffer()
        this.buffer = await context.decodeAudioData(array)
    }

    play() {
        if (!this.buffer) return

        const now = performance.now()
        if (now - this.lastPlayedTime < (1000 / 60) * 3) return // 33ms ~ 1フレーム
        this.lastPlayedTime = now

        const source = context.createBufferSource()
        source.buffer = this.buffer
        source.connect(this.localGain)
        source.start()
    }

    setVolume(ratio: number) {
        this.localGain.gain.value = ratio
    }
}

export class SE {
    static start: Sound
    static graze: Sound
    static u: Sound
    static hit: Sound
    static crush: Sound
    static dash: Sound
    static charge: Sound
    static unlock: Sound

    static async init() {
        ;[
            this.start,
            this.graze,
            this.u,
            this.hit,
            this.crush,
            this.dash,
            this.charge,
            this.unlock,
        ] = await Promise.all([
            Sound.new("asset/se/mushi.mp3", 0.5),
            Sound.new("asset/se/graze.wav", 0.1),
            Sound.new("asset/se/u.mp3"),
            Sound.new("asset/se/player_hit.mp3"),
            Sound.new("asset/se/crush.mp3"),
            Sound.new("asset/se/dash.mp3"),
            Sound.new("asset/se/se_charge.mp3"),
            Sound.new("asset/se/ドアを開ける2.mp3"),
        ])
    }

    static setVolume(volume: number) {
        gain.gain.value = volume
    }
}
