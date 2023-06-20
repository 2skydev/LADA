import { Rank } from '@main/modules/league/types/rank'

export interface Summoner extends Rank {
  summonerId: string
  summonerName: string
  summonerLevel: number
  summonerProfileIconId: number
  wins: number
  losses: number
  count: number
}
