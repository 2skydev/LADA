import { atom } from 'jotai'

import { ConfigStoreValues } from '@main/modules/config/stores/config.store'

export const configAtom = atom(window.electron.getConfig(), (_, set, update: ConfigStoreValues) => {
  window.electron.setConfig(update)
  set(configAtom, update)
})
