export const LEAGUE_CLIENT_OVERLAY_WINDOW_KEY = 'league_client_overlay_window'

export const LADA_RUNE_PAGE_NAME_PREFIX = 'LADA '

export const LANE_IDS = [0, 1, 2, 3, 4] as const

export const FLASH_SUMMONER_SPELL_ID = 4

export const LANE_EN_TO_LANE_ID_MAP = {
  TOP: 0,
  JUNGLE: 1,
  MIDDLE: 2,
  BOTTOM: 3,
  UTILITY: 4,
} as const

export const TIERS = [
  'UNRANKED',
  'IRON',
  'BRONZE',
  'SILVER',
  'GOLD',
  'PLATINUM',
  'EMERALD',
  'DIAMOND',
  'MASTER',
  'GRANDMASTER',
  'CHALLENGER',
] as const

export const NO_DIVISION_TIERS = ['MASTER', 'GRANDMASTER', 'CHALLENGER']

export const DIVISION_ROMAN_TO_NUMBER_MAP = {
  I: 1,
  II: 2,
  III: 3,
  IV: 4,
} as const

export const SHARD_RUNES = [
  {
    id: 5001,
    icon: 'perk-images/StatMods/StatModsHealthScalingIcon.png',
    name: 'league.rune.HealthScaling',
    key: 'HealthScaling',
  },
  {
    id: 5002,
    icon: 'perk-images/StatMods/StatModsArmorIcon.png',
    name: 'league.rune.Armor',
    key: 'Armor',
  },
  {
    id: 5003,
    icon: 'perk-images/StatMods/StatModsMagicResIcon.MagicResist_Fix.png',
    name: 'league.rune.MagicRes',
    key: 'MagicRes',
  },
  {
    id: 5005,
    icon: 'perk-images/StatMods/StatModsAttackSpeedIcon.png',
    name: 'league.rune.AttackSpeed',
    key: 'AttackSpeed',
  },
  {
    id: 5007,
    icon: 'perk-images/StatMods/StatModsCDRScalingIcon.png',
    name: 'league.rune.CDRScaling',
    key: 'CDRScaling',
  },
  {
    id: 5008,
    icon: 'perk-images/StatMods/StatModsAdaptiveForceIcon.png',
    name: 'league.rune.AdaptiveForce',
    key: 'AdaptiveForce',
  },
] as const

export const STATS_PROVIDERS = ['LOL.PS', 'OP.GG', 'LoLalytics'] as const
