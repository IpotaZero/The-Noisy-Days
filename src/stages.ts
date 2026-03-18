const KariStages = [
    {
        "stage-name": "Tutorial",
        "description": "チュートリアル",
    },
]

const ch0Acts = [
    {
        "act-name": "Kari",
        "description": "後で書きます",
        "stages": KariStages,
    },
    {
        "act-name": "Kari2",
        "description": "後で書きます",
        "stages": KariStages,
    },
    {
        "act-name": "Kari3",
        "description": "後で書きます",
        "stages": KariStages,
    },
    {
        "act-name": "Kari4",
        "description": "後で書きます",
        "stages": KariStages,
    },
]

export default [
    {
        "chapter-name": "ch0.",
        "chapter-description": "aaaa",
        "acts": ch0Acts,
    },
] as const
