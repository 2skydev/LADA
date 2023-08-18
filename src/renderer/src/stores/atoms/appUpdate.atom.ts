import { atom } from 'jotai'

import { UpdateStatus } from '@main/modules/update/types/update-status.type'

export interface AppUpdateAtomValue {
  version: string
  status: UpdateStatus
}

export const appUpdateAtom = atom(
  (async () => {
    return {
      version: await window.electron.getVersion(),
      status: await window.electron.getUpdateStatus(),
    }
  })(),
  (_, set, value: AppUpdateAtomValue) => {
    set(appUpdateAtom, value)
  },
)
