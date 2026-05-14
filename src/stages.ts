// Chapter 0: 世界観
// Chapter 1: 人物
// Chapter 2: 過去
// Chapter 3: 思想

// Chapter 0: Hue
const WarmStages = [
    { "stage-name": "Tokyo", "description": "チュートリアル" },
    { "stage-name": "Yellow", "description": "やや拡大する" },
    { "stage-name": "Orange", "description": "速射" },
    {
        "stage-name": "Crimson",
        "description": "弾速の大きい",
    },
]

const CoolStages = [
    { "stage-name": "シオン", "description": "シオン・シマについて" },
    { "stage-name": "Cyan", "description": "扇状" },
    { "stage-name": "Blue", "description": "針" },
    { "stage-name": "Navy", "description": "隘路" },
]

const NeutralStages = [
    { "stage-name": "SILO", "description": "逆説的措置" },
    { "stage-name": "Green", "description": "単純な自機狙い" },
    { "stage-name": "Purple", "description": "画面端で跳ね返る自機狙い" },
    { "stage-name": "Violet", "description": "区切られた領域に3-wayを打ち込む" },
]

const AchromaticStages = [
    { "stage-name": "機械大戦", "description": "歴史" },
    { "stage-name": "White", "description": "単純に数の多い自機狙い" },
    { "stage-name": "Gray", "description": "真下に小粒をばらまく" },
    {
        "stage-name": "Black",
        "description": "スナガワ",
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
    { "stage-name": "アオ", "description": "アオ・ササキに対するインタビュー" },
    { "stage-name": "Scarlet", "description": "円環と自機狙い" },
    { "stage-name": "Cobalt", "description": "絨毯爆撃と自機狙い" },
    { "stage-name": "Gold", "description": "薄く区切られた領域と自機狙い" },
]

const MutedStages = [
    { "stage-name": "ヤナガワ", "description": "シュンスケ・ヤナガワとの密談" },
    { "stage-name": "Rust", "description": "中心に寄せる" },
    { "stage-name": "Khaki", "description": "中心に寄せた" },
    { "stage-name": "Olive", "description": "中心" },
]

const PaleStages = [
    { "stage-name": "レイ", "description": "クラスメイト" },
    { "stage-name": "Blush", "description": "花と虫" },
    { "stage-name": "Sage", "description": "雨と花粉" },
    { "stage-name": "Lavender", "description": "怖くない" },
]

const DullStages = [
    { "stage-name": "合成人", "description": "初対面" },
    { "stage-name": "Mud", "description": "拳" },
    { "stage-name": "Moss", "description": "回る/回らない" },
    { "stage-name": "Soot", "description": "イシカワ" },
]

const SaturationActs = [
    { "act-name": "Vivid", "description": "矢印", "stages": VividStages },
    { "act-name": "Muted", "description": "中心に寄せましょう", "stages": MutedStages },
    { "act-name": "Pale", "description": "生きている", "stages": PaleStages },
    { "act-name": "Dull", "description": "痛み", "stages": DullStages },
]

// Chapter 2: Brightness
const LightStages = [
    { "stage-name": "犠牲", "description": "SILOの存在意義" },
    { "stage-name": "Pearl", "description": "乱視" },
    { "stage-name": "Ivory", "description": "二重" },
    { "stage-name": "Snow", "description": "泳ぐ" },
]

const DarkStages = [
    { "stage-name": "一ヶ月前その1", "description": "クラスメイト" },
    { "stage-name": "Obsidian", "description": "オーソドックス" },
    { "stage-name": "Noir", "description": "気にしない" },
    { "stage-name": "Pitch", "description": "焼野原" },
]

const HighStages = [
    { "stage-name": "一ヶ月前その2", "description": "TAMAMUSHI" },
    { "stage-name": "Amber", "description": "ねじ" },
    { "stage-name": "Vermilion", "description": "死なないと思っていた" },
    { "stage-name": "Lime", "description": "裏切る" },
]

const LowStages = [
    { "stage-name": "隣", "description": "レイ・コウダ" },
    { "stage-name": "Fog", "description": "だめ" },
    { "stage-name": "Stone", "description": "あわ" },
    { "stage-name": "Dust", "description": "サカイ" },
]

const BrightnessActs = [
    { "act-name": "Light", "description": "偏り", "stages": LightStages },
    { "act-name": "Dark", "description": "仲間", "stages": DarkStages },
    { "act-name": "High", "description": "金", "stages": HighStages },
    { "act-name": "Low", "description": "知りえない", "stages": LowStages },
]

// Chapter 3: Alpha
const ClearStages = [
    { "stage-name": "勇気", "description": "ではない" },
    { "stage-name": "Glass", "description": "動かない" },
    { "stage-name": "Ice", "description": "滑った" },
    { "stage-name": "Haze", "description": "逆二乗" },
]

const TranslucentStages = [
    { "stage-name": "人", "description": "とは" },
    { "stage-name": "Veil", "description": "焦点" },
    { "stage-name": "Frost", "description": "化身" },
    { "stage-name": "Dusk", "description": "巡る" },
]

const OpaqueStages = [
    { "stage-name": "心", "description": "色即是空" },
    { "stage-name": "Lead", "description": "ブレ" },
    { "stage-name": "Clay", "description": "虹彩" },
    { "stage-name": "Tar", "description": "協力" },
]

const LuminousStages = [
    { "stage-name": "信じましたが", "description": "戦争" },
    { "stage-name": "Phosphor", "description": "変わりゆく" },
    { "stage-name": "Glow", "description": "拒絶" },
    { "stage-name": "Dawn", "description": "言いたくなかったけれど" },
]

const AlphaActs = [
    { "act-name": "Clear", "description": "遊撃機と機雷の試験用の機体", "stages": ClearStages },
    {
        "act-name": "Translucent",
        "description": "曳航群体",
        "stages": TranslucentStages,
    },
    { "act-name": "Opaque", "description": "双子", "stages": OpaqueStages },
    { "act-name": "Luminous", "description": "弩級", "stages": LuminousStages },
]

const chapters = [
    {
        "chapter-name": "Hue",
        "description": "小さめの飛行兵器",
        "acts": HueActs,
    },
    { "chapter-name": "Saturation", "description": "砲塔数の多い飛行兵器", "acts": SaturationActs },
    { "chapter-name": "Brightness", "description": "充電機能と高出力レーザーを持つ艦隊", "acts": BrightnessActs },
    { "chapter-name": "Alpha", "description": "遊撃機と機雷を持ち得るほど巨大な艦隊", "acts": AlphaActs },
] as const

export default chapters

export const chapterList = chapters.map((chapter) => chapter["chapter-name"])

export const actList = chapters.flatMap((chapter) => chapter.acts.map((act) => act["act-name"]))

export const stageList = chapters.flatMap((chapter) =>
    chapter.acts.flatMap((act) => act.stages.flatMap((stage) => stage["stage-name"])),
)
