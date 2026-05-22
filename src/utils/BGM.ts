type BGMSource = string | AudioBuffer

export class BGM {
    static ctx: AudioContext
    static globalGain: GainNode

    private static activeSource: AudioBufferSourceNode | null = null
    private static activeGain: GainNode | null = null

    private static fadingSource: AudioBufferSourceNode | null = null
    private static fadingGain: GainNode | null = null

    private static pendingBuffer: AudioBuffer | null = null
    private static fadeTimer: ReturnType<typeof setTimeout> | null = null

    /** 進行中のfetch/decodeをキャンセルするためのコントローラー */
    private static fetchController: AbortController | null = null

    static readonly FADE_DURATION = 0.8 // seconds

    static init() {
        this.ctx = new AudioContext()
        this.globalGain = this.ctx.createGain()
        this.globalGain.connect(this.ctx.destination)
    }

    /** 即時再生（フェードなし）。URL文字列も受け取れる */
    static async play(source: BGMSource): Promise<void> {
        this._abortFetch()
        const buffer = await this._resolve(source)
        if (buffer === null) return // 後続のplay/switchToに抜かれた
        this._clearFade()
        this._stopActive()
        this._startSource(buffer)
    }

    /** フェードアウトして切り替え。fetch中・フェード中に呼ばれた場合も最新を優先 */
    static async switchTo(source: BGMSource): Promise<void> {
        this._abortFetch()
        const buffer = await this._resolve(source)
        if (buffer === null) return // 後続のplay/switchToに抜かれた
        this._applySwitch(buffer)
    }

    /** 停止 */
    static stop() {
        this._abortFetch()
        this._clearFade()
        this._stopActive()
    }

    /** マスターボリューム (0.0 〜 1.0) */
    static setVolume(value: number) {
        this.globalGain.gain.setValueAtTime(value, this.ctx.currentTime)
    }

    // ── private ──────────────────────────────────────────

    /**
     * URLならfetch+decodeして AudioBuffer を返す。
     * 自分より後のリクエストがAbortしていたら null を返す。
     */
    private static async _resolve(source: BGMSource): Promise<AudioBuffer | null> {
        if (source instanceof AudioBuffer) return source

        const controller = new AbortController()
        this.fetchController = controller

        try {
            const res = await fetch(source, { signal: controller.signal })
            const arrayBuffer = await res.arrayBuffer()
            // decodeAudioData はキャンセル不能なので、完了後に aborted を確認
            const audioBuffer = await this.ctx.decodeAudioData(arrayBuffer)
            return controller.signal.aborted ? null : audioBuffer
        } catch (e) {
            if ((e as Error).name === "AbortError") return null
            throw e
        } finally {
            if (this.fetchController === controller) this.fetchController = null
        }
    }

    /** 進行中のfetchをキャンセル */
    private static _abortFetch() {
        this.fetchController?.abort()
        this.fetchController = null
    }

    /** バッファが手に入った後の切り替えロジック（元のswitchToと同じ） */
    private static _applySwitch(buffer: AudioBuffer) {
        if (this.fadeTimer !== null) {
            // すでにフェード中 → 次に再生するバッファだけ更新
            this.pendingBuffer = buffer
            return
        }
        if (!this.activeSource) {
            this._startSource(buffer)
            return
        }
        this.pendingBuffer = buffer
        this._beginFade()
    }

    private static _beginFade() {
        this.fadingSource = this.activeSource
        this.fadingGain = this.activeGain
        this.activeSource = null
        this.activeGain = null

        const now = this.ctx.currentTime
        this.fadingGain!.gain.cancelScheduledValues(now)
        this.fadingGain!.gain.setValueAtTime(this.fadingGain!.gain.value, now)
        this.fadingGain!.gain.linearRampToValueAtTime(0, now + this.FADE_DURATION)

        this.fadeTimer = setTimeout(() => {
            this._stopFading()
            this.fadeTimer = null
            if (this.pendingBuffer) {
                this._startSource(this.pendingBuffer)
                this.pendingBuffer = null
            }
        }, this.FADE_DURATION * 1000)
    }

    private static _clearFade() {
        if (this.fadeTimer !== null) {
            clearTimeout(this.fadeTimer)
            this.fadeTimer = null
        }
        this._stopFading()
        this.pendingBuffer = null
    }

    private static _stopFading() {
        if (this.fadingSource) {
            try {
                this.fadingSource.stop()
            } catch {
                /* already stopped */
            }
            this.fadingSource.disconnect()
            this.fadingSource = null
        }
        this.fadingGain?.disconnect()
        this.fadingGain = null
    }

    private static _stopActive() {
        if (this.activeSource) {
            try {
                this.activeSource.stop()
            } catch {
                /* already stopped */
            }
            this.activeSource.disconnect()
            this.activeSource = null
        }
        this.activeGain?.disconnect()
        this.activeGain = null
    }

    private static _startSource(buffer: AudioBuffer) {
        const source = this.ctx.createBufferSource()
        source.buffer = buffer
        source.loop = true

        const gain = this.ctx.createGain()
        gain.gain.setValueAtTime(1, this.ctx.currentTime)

        source.connect(gain)
        gain.connect(this.globalGain)
        source.start()

        this.activeSource = source
        this.activeGain = gain
    }
}
