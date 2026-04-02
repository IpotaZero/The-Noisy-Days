// Chapter 0: Hue
const WarmStages = [
    { "stage-name": "Tutorial", "description": "チュートリアル" },
    { "stage-name": "Yellow", "description": "拡大する弾を撃つ衛星を持つ" },
    { "stage-name": "Orange", "description": "速射する衛星を持つ" },
    {
        "stage-name": "Crimson",
        "description": "弾速の大きい弾を撃つ衛星を持つ",
    },
]

const CoolStages = [
    { "stage-name": "シオン", "description": "背景、及びシオン・シマについて" },
    { "stage-name": "Cyan", "description": "扇状に弾を撃つ衛星を持つ" },
    { "stage-name": "Blue", "description": "" },
    { "stage-name": "Navy", "description": "" },
]

const NeutralStages = [
    { "stage-name": "SILO", "description": "逆説的措置" },
    { "stage-name": "Green", "description": "" },
    { "stage-name": "Purple", "description": "" },
    { "stage-name": "Violet", "description": "" },
]

const AchromaticStages = [
    { "stage-name": "一か月前その1", "description": "レイ・コウダ" },
    { "stage-name": "White", "description": "" },
    { "stage-name": "Gray", "description": "全方位弾と自機狙いの衛星を持つ" },
    {
        "stage-name": "Black",
        "description": "",
    },
]

const HueActs = [
    {
        "act-name": "Warm",
        "description": "自機外しのコアと一つの衛星を持つドローン",
        "stages": WarmStages,
    },
    {
        "act-name": "Cool",
        "description": "自機狙いのコアと二つの衛星を持つドローン",
        "stages": CoolStages,
    },
    {
        "act-name": "Neutral",
        "description": "",
        "stages": NeutralStages,
    },
    {
        "act-name": "Achromatic",
        "description": "",
        "stages": AchromaticStages,
    },
]

// Chapter 1: Saturation
const VividStages = [
    { "stage-name": "合成人", "description": "" },
    { "stage-name": "Scarlet", "description": "" },
    { "stage-name": "Cobalt", "description": "" },
    { "stage-name": "Gold", "description": "" },
]

const MutedStages = [
    { "stage-name": "アオ", "description": "" },
    { "stage-name": "Rust", "description": "" },
    { "stage-name": "Khaki", "description": "" },
    { "stage-name": "Olive", "description": "" },
]

const PaleStages = [
    { "stage-name": "犠牲", "description": "シュンスケ・ヤナガワの演説" },
    { "stage-name": "Blush", "description": "" },
    { "stage-name": "Sage", "description": "" },
    { "stage-name": "Lavender", "description": "" },
]

const DullStages = [
    { "stage-name": "一か月前その2", "description": "レイ・コウダ" },
    { "stage-name": "Mud", "description": "" },
    { "stage-name": "Moss", "description": "" },
    { "stage-name": "Soot", "description": "" },
]

const SaturationActs = [
    { "act-name": "Vivid", "description": "", "stages": VividStages },
    { "act-name": "Muted", "description": "", "stages": MutedStages },
    { "act-name": "Pale", "description": "", "stages": PaleStages },
    { "act-name": "Dull", "description": "", "stages": DullStages },
]

// Chapter 2: Brightness
const LightStages = [
    { "stage-name": "隣", "description": "" },
    { "stage-name": "Pearl", "description": "" },
    { "stage-name": "Ivory", "description": "" },
    { "stage-name": "Snow", "description": "" },
]

const DarkStages = [
    { "stage-name": "ヤナガワ", "description": "シュンスケ・ヤナガワについて" },
    { "stage-name": "Obsidian", "description": "" },
    { "stage-name": "Noir", "description": "" },
    { "stage-name": "Pitch", "description": "" },
]

const HighStages = [
    { "stage-name": "機械大戦", "description": "" },
    { "stage-name": "Amber", "description": "" },
    { "stage-name": "Vermilion", "description": "" },
    { "stage-name": "Lime", "description": "" },
]

const LowStages = [
    { "stage-name": "一か月前その3", "description": "レイ・コウダ" },
    { "stage-name": "Fog", "description": "" },
    { "stage-name": "Stone", "description": "" },
    { "stage-name": "Dust", "description": "" },
]

const BrightnessActs = [
    { "act-name": "Light", "description": "", "stages": LightStages },
    { "act-name": "Dark", "description": "", "stages": DarkStages },
    { "act-name": "High", "description": "", "stages": HighStages },
    { "act-name": "Low", "description": "", "stages": LowStages },
]

// Chapter 3: Alpha
const ClearStages = [
    { "stage-name": "レイ", "description": "" },
    { "stage-name": "Glass", "description": "" },
    { "stage-name": "Ice", "description": "" },
    { "stage-name": "Haze", "description": "" },
]

const TranslucentStages = [
    { "stage-name": "人", "description": "" },
    { "stage-name": "Veil", "description": "" },
    { "stage-name": "Frost", "description": "" },
    { "stage-name": "Dusk", "description": "" },
]

const OpaqueStages = [
    { "stage-name": "心", "description": "" },
    { "stage-name": "Lead", "description": "" },
    { "stage-name": "Clay", "description": "" },
    { "stage-name": "Tar", "description": "" },
]

const LuminousStages = [
    { "stage-name": "信じましたが", "description": "" },
    { "stage-name": "Phosphor", "description": "" },
    { "stage-name": "Glow", "description": "" },
    { "stage-name": "Dawn", "description": "" },
]

const AlphaActs = [
    { "act-name": "Clear", "description": "", "stages": ClearStages },
    {
        "act-name": "Translucent",
        "description": "",
        "stages": TranslucentStages,
    },
    { "act-name": "Opaque", "description": "", "stages": OpaqueStages },
    { "act-name": "Luminous", "description": "", "stages": LuminousStages },
]

const chapters = [
    { "chapter-name": "Hue", "description": "", "acts": HueActs },
    { "chapter-name": "Saturation", "description": "", "acts": SaturationActs },
    { "chapter-name": "Brightness", "description": "", "acts": BrightnessActs },
    { "chapter-name": "Alpha", "description": "", "acts": AlphaActs },
] as const

export default chapters

export const stageList = chapters.flatMap((chapter) =>
    chapter.acts.flatMap((act) =>
        act.stages.flatMap((stage) => stage["stage-name"]),
    ),
)
