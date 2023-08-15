import { GameItem } from '@main/modules/league/types/item.types'
import type { LaneId } from '@main/modules/league/types/lane.types'
import type { SkillLv15List, SkillMasterList, Skills } from '@main/modules/league/types/skill.types'
import { CounterChampions, ItemBuildGroup, RuneBuild } from '@main/modules/league/types/stat.types'
import type { SummonerSpell } from '@main/modules/league/types/summoner-spell.types'
import type { RankRangeId } from '@main/modules/ps/types/rank.types'

export interface ChampionName {
  en: string
  ko: string
}

/**
 * 챔피언 이름 목록
 *
 * @description Key 값은 챔피언의 ID 값입니다.
 */
export type ChampionNames = Record<string, ChampionName>

export interface Champion {
  id: number
  name: string
  imageFormats: ChampionImageFormats
  skills: Skills
}

/**
 * 챔피언 목록
 *
 * @description Key 값은 챔피언의 ID 값입니다.
 */
export type Champions = Record<number, Champion>

export interface ChampionImageFormats {
  small: string
  loading: string
  splash: string
}

export interface GetChampionStatsOptions {
  laneId?: LaneId
  rankRangeId?: RankRangeId
}

export interface ChampionStats {
  champion: Champion
  summary: ChampionStatsSummary
  counterChampions: CounterChampions
  runeBuilds: RuneBuild[]
  itemBuildGroups: ItemBuildGroup[]
}

export interface ChampionStatsSummary {
  skillMasterList: SkillMasterList
  skillLv15List: SkillLv15List
  spells: [SummonerSpell, SummonerSpell]
  isOp: boolean
  isHoney: boolean
  winRate: number
  count: number
  laneId: LaneId
  tier: number
  runeBuild: Pick<RuneBuild, 'mainRuneIds' | 'subRuneIds' | 'shardRuneIds'>
  startingItemList: GameItem[]
  shoesItemList: GameItem[]
  coreItemList: GameItem[]
}
