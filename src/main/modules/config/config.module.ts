import { singleton } from '@launchtray/tsyringe-async'

import { IPCHandle } from '@main/core/decorators/ipcHandle'
import type { ConfigStoreValues } from '@main/modules/config/stores/config.store'
import { configStore } from '@main/modules/config/stores/config.store'

@singleton()
export class ConfigModule {
  @IPCHandle()
  async getConfig() {
    return configStore.store
  }

  @IPCHandle()
  async setConfig(config: ConfigStoreValues) {
    return (configStore.store = config)
  }
}
