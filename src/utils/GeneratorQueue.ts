/**
 * Bullet/Enemy/Playerで共通していた「ジェネレータの配列を毎フレーム前進させ、
 * 終わったものだけ取り除く」処理をまとめたもの。
 *
 * 継承(is-a)ではなくコンポジション(has-a)にしているのは、Bullet/Enemy/Playerが
 * それぞれ全く違うコンストラクタ・tickのタイミングを持っていて、
 * 共通の基底クラスに無理に揃えるとかえって窮屈になるため。
 */
export class GeneratorQueue {
    private list: Generator[] = []

    get length() {
        return this.list.length
    }

    push(gen: Generator) {
        this.list.push(gen)
    }

    /** 現在の中身を丸ごと置き換える(Bullet.init()のような「毎回作り直す」用途向け) */
    reset(gens: Generator[]) {
        this.list = gens
    }

    /** cloneしたい場合に中身を取り出す用 */
    toArray(): Generator[] {
        return this.list
    }

    clone(): GeneratorQueue {
        const q = new GeneratorQueue()
        q.list = [...this.list]
        return q
    }

    /**
     * 実行順序を保ったまま全ジェネレータを1ステップ進め、終了したものだけ取り除く。
     * filter()/map()は毎回新しい配列を確保するのでGC負荷になる。
     * 同じ配列をその場で詰め直すことでアロケーションを避けている。
     */
    advance(): void {
        let writeIndex = 0
        for (let readIndex = 0; readIndex < this.list.length; readIndex++) {
            const gen = this.list[readIndex]
            if (!gen.next().done) {
                this.list[writeIndex++] = gen
            }
        }
        this.list.length = writeIndex
    }
}
