import { app } from 'electron'
import Store from 'electron-store'

import AutoLaunch from 'auto-launch'

const IS_DEV = process.env.NODE_ENV === 'development'

export interface ConfigStoreValues {
  general: {
    autoLaunch: boolean
    developerMode: boolean
    openWindowWhenLeagueClientLaunch: boolean
  }
  game: {
    autoAccept: boolean
    autoAcceptDelaySeconds: number
    useCurrentPositionChampionData: boolean
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
    },
    game: {
      autoAccept: false,
      autoAcceptDelaySeconds: 0,
      useCurrentPositionChampionData: true,
    },
  },
})

configStore.onDidChange('general', async (newValue, oldValue) => {
  if (newValue?.autoLaunch === oldValue?.autoLaunch) return
  if (newValue?.autoLaunch === undefined) return

  const ladaAutoLauncher = new AutoLaunch({
    name: 'LADA',
    path: app.getPath('exe'),
    isHidden: true,
  })

  const isEnabled = await ladaAutoLauncher.isEnabled()

  if (isEnabled === newValue.autoLaunch || (!isEnabled && !newValue.autoLaunch)) return

  ladaAutoLauncher[newValue.autoLaunch ? 'enable' : 'disable']()
})
