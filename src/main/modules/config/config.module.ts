import { FieldPath, FieldPathValue } from 'react-hook-form'

import { singleton } from '@launchtray/tsyringe-async'

import { IPCHandle } from '@main/core/decorators/ipcHandle'
import type { ConfigStoreValues } from '@main/modules/config/stores/config.store'
import { configStore } from '@main/modules/config/stores/config.store'

@singleton()
export class ConfigModule {
  readonly store = configStore

  onChange<Key extends FieldPath<ConfigStoreValues> = FieldPath<ConfigStoreValues>>(
    key: Key,
    callback: (
      newValue: FieldPathValue<ConfigStoreValues, Key>,
      oldValue: FieldPathValue<ConfigStoreValues, Key>,
    ) => void,
  ) {
    // @ts-ignore
    return this.store.onDidChange(key, callback)
  }

  @IPCHandle()
  async getConfig() {
    return configStore.store
  }

  @IPCHandle()
  async setConfig(config: ConfigStoreValues) {
    return (configStore.store = config)
  }
}
