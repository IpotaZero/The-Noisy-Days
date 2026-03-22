import { g, T } from "../global"
import { Bullet } from "./Bullet"
import { Vec, vec } from "../utils/Vec"

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

    colorful(seed: number) {
        return this.set("color", `hsl(${seed % 360} 100% 50%)`)
    }

    aim(target: Vec) {
        return this.forEach((b) => {
            b.radian = target.minus(b.p).arg()
        })
    }

    nway(num: number, angle: number) {
        return this.duplicate(num, (bullet, i) => {
            const clone = bullet.clone()
            clone.radian = bullet.radian + angle * (i - (num - 1) / 2)
            return clone
        })
    }

    shift(num: number, shift: number) {
        return this.duplicate(num, (bullet, i) => {
            const clone = bullet.clone()
            clone.p = clone.p.plus(vec.arg(bullet.radian + T / 4).scaled(shift * (i - (num - 1) / 2)))
            return clone
        })
    }

    duplicate(num: number, map: (bullet: Bullet, index: number) => Bullet) {
        this.bullets = this.bullets.flatMap((bullet) =>
            Array.from({ length: num }, (_, i) => {
                return map(bullet, i)
            }),
        )

        return this
    }

    ex(num: number) {
        return this.duplicate(num, (b, i) => {
            const clone = b.clone()
            clone.radian = b.radian + Math.PI * 2 * (i / num)
            return clone
        })
    }

    g(g: (me: Bullet) => Generator) {
        this.bullets.forEach((b) => {
            b.G(g)
        })

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
