import { atom } from 'jotai'

export interface CurrentSummonerAtomValues {
  id: string
  name: string
  profileIconId: string
  psId: string
}

export interface GetCurrentSummonerOptions {
  checkIsReady?: boolean
  preparedData?: any
}

export const getCurrentSummoner = async (
  options: GetCurrentSummonerOptions = {},
): Promise<CurrentSummonerAtomValues | null> => {
  let data = options.preparedData

  if (options.checkIsReady) {
    const isReady = await window.electron.apis('league', '/is-ready')
    if (!isReady) return null
  }

  if (!data) {
    data = await window.electron.apis('league', '/summoner/current')
  }

  if (!data) return null

  const psId = await window.electron.apis('ps', `/summoner-ps-id/${data.displayName}`)

  return {
    id: data.summonerId,
    name: data.displayName,
    profileIconId: data.profileIconId,
    psId,
  }
}

export const currentSummonerAtom = atom(
  getCurrentSummoner({ checkIsReady: true }),
  (_, set, value) => {
    set(currentSummonerAtom, value)
  },
)
