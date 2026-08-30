export const StaminaConfig = {
    /** スタミナの最大値 */
    MAX: 5,

    /** ステージ挑戦1回あたりの消費量 */
    COST: 1,

    /** スタミナが1回復するのにかかる時間(ms) */
    RECOVER_INTERVAL_MS: 3 * 60 * 1000,
} as const
