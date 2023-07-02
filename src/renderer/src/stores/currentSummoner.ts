import { atom } from 'recoil'

export interface CurrentSummonerStoreValues {
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
): Promise<CurrentSummonerStoreValues | null> => {
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

export const currentSummonerStore = atom<CurrentSummonerStoreValues | null>({
  key: 'current-summoner',
  default: getCurrentSummoner({ checkIsReady: true }),
})
