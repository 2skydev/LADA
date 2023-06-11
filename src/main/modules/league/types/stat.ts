import { Division, Rank, Tier } from '@main/modules/league/types/rank'

export interface AdApRatio {
  ad: number
  ap: number
  true: number
}

export interface SeasonStat {
  winRate: number
  gameCount: number
}

export interface ChampionStat {
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

export interface InGamePlayer {
  summonerName: string
  tier: Tier
  division: Division
  lp: number
  laneId: number
  championId: number
  championStat: ChampionStat
  seasonStat: SeasonStat
  spellIds: [number, number]
  runes: InGameRunes
}
