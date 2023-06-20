import { atom } from 'recoil'

export interface AppStateStoreValues {
  leagueIsReady: boolean
  leagueIsInGame: boolean
}

export const appStateStore = atom<AppStateStoreValues>({
  key: 'appState',
  default: {
    leagueIsReady: false,
    leagueIsInGame: false,
  },
})
