import type { Champion } from '@main/modules/league/types/champion.types'
import type { GameItem } from '@main/modules/league/types/item.types'
import type { Rank } from '@main/modules/league/types/rank.types'
import type { RuneIdsGroupByType } from '@main/modules/league/types/rune.types'
import type { SummonerSpell } from '@main/modules/league/types/summoner-spell.types'
import type { Summoner } from '@main/modules/league/types/summoner.types'

export interface CounterChampionsItem {
  champion: Champion
  winRate: number
}

export interface CounterChampions {
  up: CounterChampionsItem[]
  down: CounterChampionsItem[]
}

export interface RuneBuild extends RuneIdsGroupByType {
  winRate: number
  pickRate: number
  count: number
}

export interface ItemBuildGroup {
  mainItem: GameItem
  pickRate: number
  winRate: number
  count: number
  length: number
  isMythicalLevel: boolean
  children: ItemBuild[]
}

export interface ItemBuild {
  pickRate: number
  winRate: number
  count: number
  items: GameItem[]
}

export interface AdApRatio {
  ad: number
  ap: number
  true: number
}

export interface InGamePlayerSeasonStats {
  winRate: number
  gameCount: number
}

export interface InGamePlayerChampionStats {
  winRate: number
  gameCount: number
  kda: number
}

export interface InGameRunes {
  main: [number, number, number, number]
  sub: [number, number]
  shard: [number, number, number]
}

export interface InGame {
  blue: InGameTeam
  red: InGameTeam
  myTeam: 'blue' | 'red'
  enemyTeam: 'blue' | 'red'
  gameStartTime: number
  avgRankInfo: Rank
}

export interface InGameTeam {
  adApRatio: AdApRatio
  players: InGamePlayer[]
}

export interface InGameRecentMatch {
  champion: Champion
  isWin: boolean
}

export interface InGamePlayer extends Rank {
  summonerName: string
  laneId: number
  champion: Champion
  championStats: InGamePlayerChampionStats
  seasonStats: InGamePlayerSeasonStats
  spells: [SummonerSpell, SummonerSpell]
  runes: InGameRunes
  recentMatches: InGameRecentMatch[]
  tags?: InGamePlayerTag[]
}

export interface InGamePlayerTag {
  color: string
  label: string
  tooltip?: string
}

export interface SummonerStats extends Summoner, Rank {
  wins: number
  losses: number
  count: number
}
