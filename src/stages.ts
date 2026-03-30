// Chapter 1: Hue
const WarmStages = [
    { "stage-name": "Tutorial", "description": "チュートリアル" },
    { "stage-name": "Yellow", "description": "" },
    { "stage-name": "Orange", "description": "" },
    { "stage-name": "Red", "description": "" },
    { "stage-name": "Crimson", "description": "" },
]

const CoolStages = [
    { "stage-name": "シオン", "description": "背景、及びシオン・シマについて" },
    { "stage-name": "Cyan", "description": "" },
    { "stage-name": "Blue", "description": "" },
    { "stage-name": "Indigo", "description": "" },
    { "stage-name": "Navy", "description": "" },
]

const NeutralStages = [
    { "stage-name": "SILO", "description": "逆説的措置" },
    { "stage-name": "Green", "description": "" },
    { "stage-name": "Purple", "description": "" },
    { "stage-name": "Violet", "description": "" },
    { "stage-name": "Chartreuse", "description": "" },
]

const AchromaticStages = [
    { "stage-name": "一年前その1", "description": "レイ・コウダ" },
    { "stage-name": "White", "description": "" },
    { "stage-name": "Gray", "description": "" },
    { "stage-name": "Silver", "description": "" },
    { "stage-name": "Black", "description": "" },
]

const HueActs = [
    { "act-name": "Warm", "description": "", "stages": WarmStages },
    { "act-name": "Cool", "description": "", "stages": CoolStages },
    { "act-name": "Neutral", "description": "", "stages": NeutralStages },
    { "act-name": "Achromatic", "description": "", "stages": AchromaticStages },
]

// Chapter 2: Saturation
const VividStages = [
    { "stage-name": "合成人", "description": "" },
    { "stage-name": "Scarlet", "description": "" },
    { "stage-name": "Cobalt", "description": "" },
    { "stage-name": "Gold", "description": "" },
    { "stage-name": "Emerald", "description": "" },
]

const MutedStages = [
    { "stage-name": "アオ", "description": "" },
    { "stage-name": "Rust", "description": "" },
    { "stage-name": "Slate", "description": "" },
    { "stage-name": "Khaki", "description": "" },
    { "stage-name": "Olive", "description": "" },
]

const PaleStages = [
    { "stage-name": "犠牲", "description": "シュンスケ・ヤナガワの演説" },
    { "stage-name": "Blush", "description": "" },
    { "stage-name": "Mist", "description": "" },
    { "stage-name": "Sage", "description": "" },
    { "stage-name": "Lavender", "description": "" },
]

const DullStages = [
    { "stage-name": "一年前その2", "description": "レイ・コウダ" },
    { "stage-name": "Mud", "description": "" },
    { "stage-name": "Ash", "description": "" },
    { "stage-name": "Moss", "description": "" },
    { "stage-name": "Soot", "description": "" },
]

const SaturationActs = [
    { "act-name": "Vivid", "description": "", "stages": VividStages },
    { "act-name": "Muted", "description": "", "stages": MutedStages },
    { "act-name": "Pale", "description": "", "stages": PaleStages },
    { "act-name": "Dull", "description": "", "stages": DullStages },
]

// Chapter 3: Brightness
const LightStages = [
    { "stage-name": "ヤナガワ", "description": "シュンスケ・ヤナガワについて" },
    { "stage-name": "Pearl", "description": "" },
    { "stage-name": "Ivory", "description": "" },
    { "stage-name": "Cream", "description": "" },
    { "stage-name": "Snow", "description": "" },
]

const DarkStages = [
    { "stage-name": "Kari", "description": "" },
    { "stage-name": "Obsidian", "description": "" },
    { "stage-name": "Noir", "description": "" },
    { "stage-name": "Void", "description": "" },
    { "stage-name": "Pitch", "description": "" },
]

const HighStages = [
    { "stage-name": "Kari", "description": "" },
    { "stage-name": "Amber", "description": "" },
    { "stage-name": "Vermilion", "description": "" },
    { "stage-name": "Lime", "description": "" },
    { "stage-name": "Azure", "description": "" },
]

const LowStages = [
    { "stage-name": "一年前その3", "description": "レイ・コウダ" },
    { "stage-name": "Fog", "description": "" },
    { "stage-name": "Sand", "description": "" },
    { "stage-name": "Stone", "description": "" },
    { "stage-name": "Dust", "description": "" },
]

const BrightnessActs = [
    { "act-name": "Light", "description": "", "stages": LightStages },
    { "act-name": "Dark", "description": "", "stages": DarkStages },
    { "act-name": "High", "description": "", "stages": HighStages },
    { "act-name": "Low", "description": "", "stages": LowStages },
]

// Chapter 4: Alpha
const ClearStages = [
    { "stage-name": "Kari", "description": "" },
    { "stage-name": "Water", "description": "" },
    { "stage-name": "Glass", "description": "" },
    { "stage-name": "Ice", "description": "" },
    { "stage-name": "Haze", "description": "" },
]

const TranslucentStages = [
    { "stage-name": "Kari", "description": "" },
    { "stage-name": "Smoke", "description": "" },
    { "stage-name": "Veil", "description": "" },
    { "stage-name": "Frost", "description": "" },
    { "stage-name": "Dusk", "description": "" },
]

const OpaqueStages = [
    { "stage-name": "Kari", "description": "" },
    { "stage-name": "Iron", "description": "" },
    { "stage-name": "Lead", "description": "" },
    { "stage-name": "Clay", "description": "" },
    { "stage-name": "Tar", "description": "" },
]

const LuminousStages = [
    { "stage-name": "信じましたが", "description": "" },
    { "stage-name": "Ember", "description": "" },
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

export default [
    { "chapter-name": "Hue", "description": "", "acts": HueActs },
    { "chapter-name": "Saturation", "description": "", "acts": SaturationActs },
    { "chapter-name": "Brightness", "description": "", "acts": BrightnessActs },
    { "chapter-name": "Alpha", "description": "", "acts": AlphaActs },
] as const
