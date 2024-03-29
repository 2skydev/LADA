import Store from 'electron-store'

import { StatsProvider } from '@main/modules/stats-provider-integration/types/provider.types'

const IS_DEV = process.env.NODE_ENV === 'development'

export interface ConfigStoreValues {
  general: {
    autoLaunch: boolean
    developerMode: boolean
    openWindowWhenLeagueClientLaunch: boolean
    language: string | null
    zoom: number
    restoreWindowPosition: boolean
  }
  game: {
    statsProvider: StatsProvider
    autoAccept: boolean
    autoAcceptDelaySeconds: number
    useCurrentPositionChampionData: boolean
    autoRuneSetting: boolean
    autoSummonerSpellSetting: boolean
    flashKey: 'D' | 'F'
  }
}

export const configStore = new Store<ConfigStoreValues>({
  name: 'config',
  accessPropertiesByDotNotation: true,
  defaults: {
    general: {
      autoLaunch: false,
      developerMode: IS_DEV,
      openWindowWhenLeagueClientLaunch: true,
      language: null,
      zoom: 1.0,
      restoreWindowPosition: true,
    },
    game: {
      statsProvider: 'LOL.PS',
      autoAccept: false,
      autoAcceptDelaySeconds: 0,
      useCurrentPositionChampionData: true,
      autoRuneSetting: true,
      autoSummonerSpellSetting: true,
      flashKey: 'F',
    },
  },
})
