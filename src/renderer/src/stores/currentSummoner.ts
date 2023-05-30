import { atom } from 'recoil'

export interface CurrentSummonerStoreValues {
  id: string
  name: string
  profileIconId: string
}

export const currentSummonerStore = atom<CurrentSummonerStoreValues | null>({
  key: 'current-summoner',
  default: (async () => {
    const isReady = await window.electron.apis('league', '/is-ready')

    if (!isReady) return null

    const data = await window.electron.apis('league', '/summoner/current')

    if (!data) return null

    return {
      id: data.summonerId,
      name: data.displayName,
      profileIconId: data.profileIconId,
    }
  })(),
})
