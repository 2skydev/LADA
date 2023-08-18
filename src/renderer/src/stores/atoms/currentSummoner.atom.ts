import { atom } from 'jotai'

import { Summoner } from '@main/modules/league/types/summoner.types'

export const currentSummonerAtom = atom(
  window.electron.getCurrentSummoner(),
  (_, set, value: Summoner | null) => {
    set(currentSummonerAtom, value)
  },
)
