import { atom } from 'recoil'

import { LaneId } from '@main/modules/league/types/lane'

export interface ChampionSelectSessionStoreValues {
  gameId: string
  laneId: LaneId | null
  championId: number | null
  tempChampionId: number | null
}

export const championSelectSessionStore = atom<ChampionSelectSessionStoreValues | null>({
  key: 'champion-select-session',
  default: null,
})
