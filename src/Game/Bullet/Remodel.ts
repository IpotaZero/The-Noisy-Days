import { g, T } from "../../global"
import { Bullet } from "./Bullet"
import { Vec, vec } from "../../utils/Vec"
import { Ease } from "../../utils/Functions/Ease"
import { Enemy } from "../Enemy/Enemy"

export const remodel = () =>
    new Proxy(new Remodel([new Bullet()]), {
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

export class Remodel {
    constructor(private bullets: Bullet[]) {}

    fire() {
        this.bullets.forEach((b) => {
            b.init()
            return b
        })

        g.bullets.push(...this.bullets)
    }

    static *appear(me: Bullet, frame: number = 30) {
        const r = me.r

        for (let i = 1; i < frame + 1; i++) {
            me.r = r * Ease.Out(i / frame)
            yield
        }
    }

    static *reaccel(me: Bullet, stopFrame: number, waitFrame: number, accelFrame: number, finalSpeed?: number) {
        const initialSpeed = me.speed
        yield* this.stop(me, stopFrame)
        yield* Array(waitFrame)
        yield* this.accel(me, accelFrame, finalSpeed ?? initialSpeed)
    }

    static *stop(me: Bullet, stopFrame: number) {
        yield* this.accel(me, stopFrame, 0)
    }

    static *accel(me: Bullet, frame: number, finalSpeed: number) {
        const start = me.speed

        for (let i = 1; i < frame + 1; i++) {
            me.speed = (finalSpeed - start) * (i / frame) + start
            yield
        }
    }

    static *fadeout(me: Bullet, frame: number) {
        const alpha = me.alpha

        me.type = Bullet.Type.Neutral

        for (let i = 1; i < frame + 1; i++) {
            me.alpha = alpha * (1 - i / frame)
            yield
        }

        me.life = 0
    }

    delayByIndex(scalar = 1) {
        return this.forEach((me, index) => {
            me.alpha = 0
            me.type = Bullet.Type.Neutral
            me.delay += index * scalar
        }).g(function* (me) {
            me.alpha = 1
            me.type = Bullet.Type.Enemy
        })
    }

    colorful(seed: number) {
        return this.set("color", `hsl(${seed % 360} 100% 50%)`)
    }

    aim(target: Vec) {
        return this.forEach((b) => {
            b.radian = target.minus(b.p).arg()
        })
    }

    sim(num: number, min: number, max: number) {
        return this.duplicate(num, (b, i) => {
            b.speed = (max - min) * (i / (num - 1)) + min
            return b
        })
    }

    nway(num: number, angle: number) {
        return this.duplicate(num, (b, i) => {
            b.radian += angle * (i - (num - 1) / 2)
            return b
        })
    }

    shift(num: number, shift: number) {
        return this.duplicate(num, (b, i) => {
            const shiftVec = vec.arg(b.radian + T / 4).scaled(shift * (i - (num - 1) / 2))
            b.p = b.p.plus(shiftVec)
            return b
        })
    }

    duplicate(num: number, map: (me: Bullet, index: number) => Bullet) {
        this.bullets = this.bullets.flatMap((bullet) =>
            Array.from({ length: num }, (_, i) => {
                return map(bullet.clone(), i)
            }),
        )

        return this
    }

    circle(distance: number, radius: number) {
        const num = Math.ceil((T * radius) / distance)
        return this.duplicate(num, (b, i) => {
            const angle = (T / num) * i
            b.p = b.p.plus(vec.arg(angle).scaled(radius))
            return b
        })
    }

    ex(num: number) {
        return this.duplicate(num, (b, i) => {
            const clone = b
            clone.radian = b.radian + Math.PI * 2 * (i / num)
            return clone
        })
    }

    bounce(count: number) {
        return this.g(function* (b) {
            while (count > 0) {
                yield

                if (b.p.x < -g.width / 2 || b.p.x > g.width / 2) {
                    b.radian = Math.PI - b.radian
                    count--
                }
            }
        })
    }

    delete(frame: number = 0) {
        return this.g(function* (b) {
            for (let i = 0; i < frame; i++) yield
            b.life = 0
        })
    }

    g(g: (this: Enemy, me: Bullet, index: number) => Generator) {
        this.bullets.forEach((b, index) => {
            b.G({ g, index })
        })

        return this
    }

    forEach(handler: (me: Bullet, index: number) => void) {
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
