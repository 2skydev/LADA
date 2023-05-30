import { atom } from 'recoil'

import { Lane } from '@renderer/types/league'

export interface ChampSelectSessionStoreValues {
  gameId: string
  lane: Lane | null
}

export const champSelectSessionStore = atom<ChampSelectSessionStoreValues | null>({
  key: 'champ-select-session',
  default: null,
})
