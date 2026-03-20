import { Vec, vec } from "./Vec"

type CurveParameter = {
    curve: Curve
    length: (steps: number, interval: [number, number]) => number
}

type Curve = (t: number) => { point: Vec; velocity: Vec }

export class Curves {
    static lengthOf(curve: Curve, steps: number, interval: [number, number] = [0, 1]) {
        let len = 0
        let prev = curve(interval[0]).velocity

        for (let i = 1; i <= steps; i++) {
            const t = i / steps
            const current = curve(interval[0] + (interval[1] - interval[0]) * t).velocity
            const speedPrev = Math.hypot(prev.x, prev.y)
            const speedCurr = Math.hypot(current.x, current.y)

            len += 0.5 * (speedPrev + speedCurr) * (1 / steps)

            prev = current
        }

        return len
    }

    static join(curves: CurveParameter[]): CurveParameter {
        const joinedCurve = (t: number) => {
            const m = curves.length

            const n = Math.floor(t * m)

            return curves[n].curve((t - n / m) * m)
        }

        const length = (steps: number, interval: [number, number]) => {
            return curves.reduce((sum, c) => sum + c.length(steps, interval), 0)
        }

        return { curve: joinedCurve, length }
    }

    static Bezier(start: Vec, control: Vec, end: Vec): CurveParameter {
        const curve = (t: number) => {
            const oneMinusT = 1 - t
            const x = oneMinusT ** 2 * start.x + 2 * oneMinusT * t * control.x + t ** 2 * end.x
            const y = oneMinusT ** 2 * start.y + 2 * oneMinusT * t * control.y + t ** 2 * end.y

            const dx = 2 * oneMinusT * (control.x - start.x) + 2 * t * (end.x - control.x)
            const dy = 2 * oneMinusT * (control.y - start.y) + 2 * t * (end.y - control.y)

            return { point: vec(x, y), velocity: vec(dx, dy) }
        }

        return {
            curve,
            length: (steps, interval) => Curves.lengthOf(curve, steps, interval),
        }
    }

    static Line(start: Vec, end: Vec): CurveParameter {
        const dx = end.x - start.x
        const dy = end.y - start.y

        const curve = (t: number) => {
            const x = (1 - t) * start.x + t * end.x
            const y = (1 - t) * start.y + t * end.y

            return { point: vec(x, y), velocity: vec(dx, dy) }
        }

        return { curve, length: (steps, interval) => Math.hypot(dx, dy) * (interval[1] - interval[0]) }
    }

    static #CatmullRom(p0: Vec, p1: Vec, p2: Vec, p3: Vec): CurveParameter {
        const curve = (t: number) => {
            const t2 = t * t
            const t3 = t2 * t

            const x =
                0.5 *
                (2 * p1.x +
                    (-p0.x + p2.x) * t +
                    (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
                    (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3)

            const y =
                0.5 *
                (2 * p1.y +
                    (-p0.y + p2.y) * t +
                    (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
                    (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3)

            const dx =
                0.5 *
                (-p0.x +
                    p2.x +
                    2 * (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t +
                    3 * (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t2)

            const dy =
                0.5 *
                (-p0.y +
                    p2.y +
                    2 * (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t +
                    3 * (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t2)

            return { point: vec(x, y), velocity: vec(dx, dy) }
        }

        return { curve, length: (steps: number, interval) => Curves.lengthOf(curve, steps, interval) }
    }

    static CatmullRom(points: Vec[], loop: boolean = false): CurveParameter {
        if (points.length < 4) {
            throw new Error("At least 4 points are required.")
        }

        const curves = []

        for (let i = 0; i < points.length - 3; i++) {
            curves.push(this.#CatmullRom(...(points.slice(i, i + 4) as [Vec, Vec, Vec, Vec])))
        }

        return Curves.join(curves)
    }

    static Lissajous(width: number, height: number, fx: number, fy: number): CurveParameter {
        const curve = (t: number) => ({
            point: vec((width / 2) * Math.sin(fx * t), (height / 2) * Math.sin(fy * t)),
            velocity: vec((width / 2) * fx * Math.cos(fx * t), -(height / 2) * fy * Math.cos(fy * t)),
        })

        return {
            curve,
            length: (steps: number, interval) => Curves.lengthOf(curve, steps, interval),
        }
    }

    static EpiTrochoid(centerR: number, moveR: number, deltaR: number): CurveParameter {
        const curve = (t: number) => ({
            point: vec(
                (centerR + moveR) * Math.cos(t) - deltaR * Math.cos(((centerR + moveR) / moveR) * t),
                (centerR + moveR) * Math.sin(t) - deltaR * Math.sin(((centerR + moveR) / moveR) * t),
            ),
            velocity: vec(
                -(centerR + moveR) * Math.sin(t) +
                    deltaR * ((centerR + moveR) / moveR) * Math.sin(((centerR + moveR) / moveR) * t),
                (centerR + moveR) * Math.cos(t) -
                    deltaR * ((centerR + moveR) / moveR) * Math.cos(((centerR + moveR) / moveR) * t),
            ),
        })

        return {
            curve,
            length: (steps: number, interval) => Curves.lengthOf(curve, steps, interval),
        }
    }

    static HypoTrochoid(centerR: number, moveR: number, deltaR: number): CurveParameter {
        const curve = (t: number) => ({
            point: vec(
                (centerR - moveR) * Math.cos(t) - deltaR * Math.cos(((centerR - moveR) / moveR) * t),
                (centerR - moveR) * Math.sin(t) - deltaR * Math.sin(((centerR - moveR) / moveR) * t),
            ),
            velocity: vec(
                -(centerR + moveR) * Math.sin(t) +
                    deltaR * ((centerR - moveR) / moveR) * Math.sin(((centerR - moveR) / moveR) * t),
                (centerR + moveR) * Math.cos(t) -
                    deltaR * ((centerR - moveR) / moveR) * Math.cos(((centerR - moveR) / moveR) * t),
            ),
        })

        return {
            curve,
            length: (steps: number, interval) => Curves.lengthOf(curve, steps, interval),
        }
    }

    static isosceles(curve: CurveParameter, errorCap: number = 1): CurveParameter {
        const L = curve.length(100, [0, 1])

        return {
            curve: (s: number) => {
                // length(t) = l * length となるtを探す

                let ts = 0
                let te = 1

                let t = 0

                let lt = 0

                let safety = 0

                // errorCapに収まるまで二分探索する
                do {
                    if (s * L < lt) {
                        te = t
                        t = (ts + t) / 2
                    } else {
                        ts = t
                        t = (t + te) / 2
                    }

                    lt = curve.length(100, [0, t])

                    console.log(ts, t, te, lt, L, s * L, s, Math.abs(lt - s * L))
                } while (Math.abs(lt - s * L) > errorCap && safety++ < 10)

                return curve.curve(t)
            },
            length: curve.length,
        }
    }
}
