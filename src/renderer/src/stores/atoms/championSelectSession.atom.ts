import { atom } from 'jotai'

import { LaneId } from '@main/modules/league/types/lane.types'

export interface ChampionSelectSessionAtomValues {
  gameId: string
  laneId: LaneId | null
  championId: number | null
  tempChampionId: number | null
}

export const championSelectSessionAtom = atom<ChampionSelectSessionAtomValues | null>(null)
