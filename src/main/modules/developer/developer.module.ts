import { ipcMain } from 'electron'
import log from 'electron-log'

import { injectable } from 'tsyringe'

import { configStore } from '@main/modules/config/stores/config.store'

export interface Log {
  size: number
  path: string
  lines: string[]
}

@injectable()
export class DeveloperModule {
  constructor() {
    ipcMain.handle('getStorePath', async () => {
      return configStore.path
    })

    ipcMain.handle('getLogs', async () => {
      const logs = log.transports.file.readAllLogs()

      return logs.map(item => ({
        size: log.transports.file.getFile().size,
        path: item.path,
        lines: item.lines.filter(Boolean),
      }))
    })

    ipcMain.handle('clearLogs', async () => {
      return log.transports.file.getFile().clear()
    })
  }
}
