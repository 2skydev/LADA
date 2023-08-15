import { contextBridge, ipcRenderer } from 'electron'

import type { ConfigStoreValues } from '@main/modules/config/config.store'
import type { UpdateStatus } from '@main/modules/update/types/update-status.type'

import { generatedIpcInvokeContext } from './generated-ipc-invoke-context'

const electronContext = {
  ...generatedIpcInvokeContext,

  onChangeConfig: (callback: (newValue: ConfigStoreValues) => void) =>
    ipcRenderer.on('configChanged', (_, newValue) => callback(newValue)),

  onUpdate: (callback: (status: UpdateStatus) => void) =>
    ipcRenderer.on('update', (_, status) => callback(status)),

  onUpdateLater: (callback: () => void) => ipcRenderer.on('needUpdateLater', () => callback()),

  subscribeLeague: (path: string, callback: (data: any) => void) =>
    ipcRenderer.on(`league/${path}`, (_, data) => callback(data)),

  unsubscribeLeague: (path: string) => ipcRenderer.removeAllListeners(`league/${path}`),
}

export type ElectronContext = typeof electronContext

contextBridge.exposeInMainWorld('electron', electronContext)
