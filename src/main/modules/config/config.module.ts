import { ipcMain } from 'electron'

import { injectable } from 'tsyringe'

import { configStore } from '@main/modules/config/stores/config.store'

@injectable()
export class ConfigModule {
  public

  constructor() {
    ipcMain.handle('getConfig', async () => {
      return configStore.store
    })

    ipcMain.handle('setConfig', async (_, config) => {
      return (configStore.store = config)
    })
  }
}
