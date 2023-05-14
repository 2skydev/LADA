import { contextBridge, ipcRenderer } from 'electron'

import { AppControlAction } from '@main/modules/app/app.module'
import { ConfigStoreValues } from '@main/modules/config/stores/config.store'
import { Log } from '@main/modules/developer/developer.module'
import { UpdateEvent, UpdateStatus } from '@main/modules/update/stores/update.store'

const electronContext = {
  appControl: (action: AppControlAction) => ipcRenderer.send('appControl', action),
  openExternal: (link: string) => ipcRenderer.send('openExternal', link),

  getConfig: (): Promise<ConfigStoreValues> => ipcRenderer.invoke('getConfig'),
  setConfig: (config: ConfigStoreValues): Promise<ConfigStoreValues> =>
    ipcRenderer.invoke('setConfig', config),

  getVersion: (): Promise<string> => ipcRenderer.invoke('getVersion'),
  getUpdaterStatus: (): Promise<UpdateStatus> => ipcRenderer.invoke('getUpdaterStatus'),
  onUpdate: (callback: (event: UpdateEvent, data: any) => void) =>
    ipcRenderer.on('update', (_, event, data) => callback(event, data)),
  checkForUpdate: () => ipcRenderer.send('checkForUpdate'),
  quitAndInstall: () => ipcRenderer.send('quitAndInstall'),
  initializeUpdater: () => ipcRenderer.send('initializeUpdater'),

  getStorePath: (): Promise<string> => ipcRenderer.invoke('getStorePath'),
  getLogs: (): Promise<Log[]> => ipcRenderer.invoke('getLogs'),
  clearLogs: (): Promise<boolean> => ipcRenderer.invoke('clearLogs'),

  apis: (category: 'ps' | 'league', url: string, payload?: any) =>
    ipcRenderer.invoke(`apis/${category}`, url, payload),

  subscribeLeague: (path: string, callback: (data: any) => void) =>
    ipcRenderer.on(`league/${path}`, (_, data) => callback(data)),
  unsubscribeLeague: (path: string) => ipcRenderer.removeAllListeners(`league/${path}`),
}

export type ElectronContext = typeof electronContext

contextBridge.exposeInMainWorld('electron', electronContext)
