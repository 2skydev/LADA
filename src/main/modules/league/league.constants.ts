import type { Rune } from '@main/modules/league/types/rune.types'

export const LANE_IDS = [0, 1, 2, 3, 4] as const

export const LANE_EN_TO_LANE_ID_MAP = {
  TOP: 0,
  JUNGLE: 1,
  MIDDLE: 2,
  BOTTOM: 3,
  UTILITY: 4,
} as const

export const LANE_ID_TO_LABEL_MAP = {
  0: '탑',
  1: '정글',
  2: '미드',
  3: '원딜',
  4: '서폿',
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

export const FORCE_MYTHICAL_LEVEL_ITEM_NAME_WORDS = ['구인수']

export const SHARD_RUNES: Rune[] = [
  {
    id: 5001,
    icon: 'perk-images/StatMods/StatModsHealthScalingIcon.png',
    name: '체력 증가',
    key: 'HealthScaling',
  },
  {
    id: 5002,
    icon: 'perk-images/StatMods/StatModsArmorIcon.png',
    name: '방어력',
    key: 'Armor',
  },
  {
    id: 5003,
    icon: 'perk-images/StatMods/StatModsMagicResIcon.MagicResist_Fix.png',
    name: '마법 저항력',
    key: 'MagicRes',
  },
  {
    id: 5005,
    icon: 'perk-images/StatMods/StatModsAttackSpeedIcon.png',
    name: '공격 속도',
    key: 'AttackSpeed',
  },
  {
    id: 5007,
    icon: 'perk-images/StatMods/StatModsCDRScalingIcon.png',
    name: '스킬 가속',
    key: 'CDRScaling',
  },
  {
    id: 5008,
    icon: 'perk-images/StatMods/StatModsAdaptiveForceIcon.png',
    name: '적응형 능력치',
    key: 'AdaptiveForce',
  },
]

export const CHAMPION_NAME_ALIAS_MAP: Record<string, string[]> = {
  트리스타나: ['트타'],
  트위스티드페이트: ['트페'],
  트린다미어: ['트린', '트란'],
  블리츠크랭크: ['블츠', '깡통'],
  하이머딩거: ['하딩'],
  볼리베어: ['볼베'],
  마스터이: ['마이'],
  그레이브즈: ['그브'],
  아우렐리온솔: ['아솔', '아우솔'],
  케이틀린: ['케틀'],
  그라가스: ['글가'],
  유미: ['고양이', '라면'],
  미스포츈: ['미포'],
  드레이븐: ['드븐'],
  워윅: ['워웍'],
  말파이트: ['돌'],
  블라디미르: ['모기'],
  모르가나: ['몰가'],
  그웬: ['궨'],
  문도박사: ['문박'],
  뽀삐: ['삐뽀'],
}

export const STATS_PROVIDERS = ['LOL.PS', 'OP.GG', 'LoLalytics'] as const

export const GAME_MODE_TO_LABEL_MAP = {
  CLASSIC: '소환사의 협곡',
  ARAM: '칼바람 나락',
  URF: '우르프',
}

export const PICK_TYPE_TO_LABEL_MAP = {
  SimulPickStrategy: '비공개 선택',
  TournamentPickStrategy: '토너먼트 드래프트',
  DraftModeSinglePickStrategy: '교차 선택',
  AllRandomPickStrategy: '모두 무작위',
}
