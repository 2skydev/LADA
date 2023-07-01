import { atom } from 'recoil'

import { Lane } from '@renderer/types/league'

export interface ChampionSelectSessionStoreValues {
  gameId: string
  lane: Lane | null
  championId: number | null
  tempChampionId: number | null
}

export const championSelectSessionStore = atom<ChampionSelectSessionStoreValues | null>({
  key: 'champion-select-session',
  default: null,
})
