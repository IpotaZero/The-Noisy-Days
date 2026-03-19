import { g } from "../global"
import { Bullet } from "./Bullet"

export const remodel = (bullets: Bullet[]) =>
    new Proxy(new Remodel(bullets), {
        get(target, key) {
            if (key in target) return (target as any)[key]

            return function (this: Mod, value: any) {
                return this.set(key as any, value)
            }
        },
    }) as Mod

type Mod = Remodel & {
    [key in keyof Bullet]: (value: Bullet[key]) => Mod
}

class Remodel {
    constructor(private bullets: Bullet[]) {}

    fire() {
        this.bullets.forEach((b) => {
            b.init()
            return b
        })

        g.bullets.push(...this.bullets)
    }

    nway(num: number, angle: number) {
        this.bullets = this.bullets.flatMap((b) =>
            Array.from({ length: num }, (_, i) => {
                const clone = b.clone()
                clone.radian = b.radian + angle * (i - (num - 1) / 2)
                return clone
            }),
        )

        return this
    }

    ex(num: number) {
        this.bullets = this.bullets.flatMap((b) =>
            Array.from({ length: num }, (_, i) => {
                const clone = b.clone()
                clone.radian = b.radian + Math.PI * 2 * (i / num)
                return clone
            }),
        )

        return this
    }

    forEach(handler: (b: Bullet) => void) {
        this.bullets.forEach(handler)
        return this
    }

    set<K extends keyof Bullet, V extends Bullet[K]>(key: K, value: V) {
        this.bullets.forEach((b) => {
            b[key] = value
        })

        return this
    }
}
