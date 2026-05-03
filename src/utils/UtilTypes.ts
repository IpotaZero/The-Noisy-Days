export type NumberKeys<O> = TypedKeys<number, O>

export type TypedKeys<T, O> = {
    [K in keyof O]: O[K] extends T ? K : never
}[keyof O]

type A = {
    a: number
    b: string
    c: boolean
    d: number
}

type B = TypedKeys<number, A>
