// Chapter 0: 世界観
// Chapter 1: 人物
// Chapter 2: 過去
// Chapter 3: 思想

// Chapter 0: Hue
const WarmStages = [
    { "stage-name": "Tutorial", "description": "チュートリアル" },
    { "stage-name": "Yellow", "description": "やや拡大する弾を撃つ衛星を持つ" },
    { "stage-name": "Orange", "description": "速射する衛星を持つ" },
    {
        "stage-name": "Crimson",
        "description": "弾速の大きい弾を撃つ衛星を持つ",
    },
]

const CoolStages = [
    { "stage-name": "シオン", "description": "シオン・シマについて" },
    { "stage-name": "Cyan", "description": "扇状に弾を撃つ衛星を持つ" },
    { "stage-name": "Blue", "description": "針を飛ばす衛星を持つ" },
    { "stage-name": "Navy", "description": "波状隘路攻撃" },
]

const NeutralStages = [
    { "stage-name": "SILO", "description": "逆説的措置" },
    { "stage-name": "Green", "description": "単純な自機狙い" },
    { "stage-name": "Purple", "description": "画面端で跳ね返る自機狙い" },
    { "stage-name": "Violet", "description": "弾幕" },
]

const AchromaticStages = [
    { "stage-name": "機械大戦", "description": "歴史" },
    { "stage-name": "White", "description": "" },
    { "stage-name": "Gray", "description": "" },
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
        "description": "移動を妨げるコアと二つの衛星を持つドローン",
        "stages": NeutralStages,
    },
    {
        "act-name": "Achromatic",
        "description": "激しく動くコアと二つの衛星を持つドローン",
        "stages": AchromaticStages,
    },
]

// Chapter 1: Saturation
const VividStages = [
    { "stage-name": "アオ", "description": "" },
    { "stage-name": "Scarlet", "description": "" },
    { "stage-name": "Cobalt", "description": "" },
    { "stage-name": "Gold", "description": "" },
]

const MutedStages = [
    { "stage-name": "ヤナガワ", "description": "" },
    { "stage-name": "Rust", "description": "" },
    { "stage-name": "Khaki", "description": "" },
    { "stage-name": "Olive", "description": "" },
]

const PaleStages = [
    { "stage-name": "レイ", "description": "" },
    { "stage-name": "Blush", "description": "" },
    { "stage-name": "Sage", "description": "" },
    { "stage-name": "Lavender", "description": "" },
]

const DullStages = [
    { "stage-name": "合成人", "description": "" },
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
    { "stage-name": "犠牲", "description": "" },
    { "stage-name": "Pearl", "description": "" },
    { "stage-name": "Ivory", "description": "" },
    { "stage-name": "Snow", "description": "" },
]

const DarkStages = [
    { "stage-name": "", "description": "" },
    { "stage-name": "Obsidian", "description": "" },
    { "stage-name": "Noir", "description": "" },
    { "stage-name": "Pitch", "description": "" },
]

const HighStages = [
    { "stage-name": "", "description": "" },
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
    { "stage-name": "隣", "description": "" },
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
    {
        "chapter-name": "Hue",
        "description": "小さめの飛行兵器",
        "acts": HueActs,
    },
    { "chapter-name": "Saturation", "description": "", "acts": SaturationActs },
    { "chapter-name": "Brightness", "description": "", "acts": BrightnessActs },
    { "chapter-name": "Alpha", "description": "", "acts": AlphaActs },
] as const

export default chapters

export const chapterList = chapters.map((chapter) => chapter["chapter-name"])

export const actList = chapters.flatMap((chapter) => chapter.acts.map((act) => act["act-name"]))

export const stageList = chapters.flatMap((chapter) =>
    chapter.acts.flatMap((act) => act.stages.flatMap((stage) => stage["stage-name"])),
)
