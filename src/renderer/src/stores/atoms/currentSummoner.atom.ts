import { atom } from 'jotai'

import { Summoner } from '@main/modules/league/types/summoner.types'

export interface GetCurrentSummonerOptions {
  checkIsReady?: boolean
}

export const getCurrentSummoner = async (
  options: GetCurrentSummonerOptions = {},
): Promise<Summoner | null> => {
  if (options.checkIsReady) {
    const isReady = await window.electron.isReady()
    if (!isReady) return null
  }

  return await window.electron.getCurrentSummoner()
}

export const currentSummonerAtom = atom(
  getCurrentSummoner({ checkIsReady: true }),
  (_, set, value) => {
    set(currentSummonerAtom, value)
  },
)
