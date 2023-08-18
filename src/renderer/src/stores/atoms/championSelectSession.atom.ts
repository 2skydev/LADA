import { atom } from 'jotai'

import { ChampionSelectSession } from '@main/modules/league/types/champion-select-session.types'

export const championSelectSessionAtom = atom(
  window.electron.getChampionSelectSession(),
  (_, set, update: ChampionSelectSession | null) => {
    set(championSelectSessionAtom, update)
  },
)
