import log from 'electron-log'

import { singleton } from '@launchtray/tsyringe-async'

import { IPCHandle } from '@main/core/decorators/ipcHandle'
import { configStore } from '@main/modules/config/stores/config.store'

export interface Log {
  size: number
  path: string
  lines: string[]
}

@singleton()
export class DeveloperModule {
  @IPCHandle()
  async getStorePath() {
    return configStore.path
  }

  @IPCHandle()
  async getLogs() {
    const logs = log.transports.file.readAllLogs()

    return logs.map(item => ({
      size: log.transports.file.getFile().size,
      path: item.path,
      lines: item.lines.filter(Boolean),
    }))
  }

  @IPCHandle()
  async clearLogs() {
    return log.transports.file.getFile().clear()
  }
}
