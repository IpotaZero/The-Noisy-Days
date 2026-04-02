export class MathEx {
    static sum(values: readonly number[]) {
        return values.reduce((a, b) => a + b, 0)
    }
}
