import {
  GAME_MODE_TO_LABEL_MAP,
  PICK_TYPE_TO_LABEL_MAP,
} from '@main/modules/league/league.constants'
import { LaneId } from '@main/modules/league/types/lane.types'
import { Summoner } from '@main/modules/league/types/summoner.types'

export type GameMode = keyof typeof GAME_MODE_TO_LABEL_MAP
export type PickType = keyof typeof PICK_TYPE_TO_LABEL_MAP

export interface Lobby {
  title: string
  gameMode: GameMode
  pickType: PickType | null
  summoners: LobbySummoner[]
  spectators: Summoner[]
  teams: [Summoner[], Summoner[]]
  isCustom: boolean
}

export interface LobbySummoner extends Summoner {
  firstLaneId: LaneId | null
  secondLaneId: LaneId | null
}
