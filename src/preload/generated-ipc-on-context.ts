import { ipcRenderer } from 'electron';

import { ElectronController } from '@main/modules/electron/electron.controller';
import { LeagueController } from '@main/modules/league/league.controller';
import { UpdateController } from '@main/modules/update/update.controller';

type Unsubscribe = () => void

export const generatedIpcOnContext = {
  // ElectronController
  onNeedUpdateLater: (callback: (data: ReturnType<typeof ElectronController.prototype.onNeedUpdateLater>) => void): Unsubscribe => {
    const handler = (_, data) => callback(data)
    ipcRenderer.on('onNeedUpdateLater', handler)
    return () => ipcRenderer.off('onNeedUpdateLater', handler)
  },
  onChangeConfigValue: (callback: (data: ReturnType<typeof ElectronController.prototype.onChangeConfigValue>) => void): Unsubscribe => {
    const handler = (_, data) => callback(data)
    ipcRenderer.on('onChangeConfigValue', handler)
    return () => ipcRenderer.off('onChangeConfigValue', handler)
  },
  onChangeLanguage: (callback: (data: ReturnType<typeof ElectronController.prototype.onChangeLanguage>) => void): Unsubscribe => {
    const handler = (_, data) => callback(data)
    ipcRenderer.on('onChangeLanguage', handler)
    return () => ipcRenderer.off('onChangeLanguage', handler)
  },

  // LeagueController
  onChangeLeagueClientConnection: (callback: (data: ReturnType<typeof LeagueController.prototype.onChangeLeagueClientConnection>) => void): Unsubscribe => {
    const handler = (_, data) => callback(data)
    ipcRenderer.on('onChangeLeagueClientConnection', handler)
    return () => ipcRenderer.off('onChangeLeagueClientConnection', handler)
  },
  onChangeIsInGame: (callback: (data: ReturnType<typeof LeagueController.prototype.onChangeIsInGame>) => void): Unsubscribe => {
    const handler = (_, data) => callback(data)
    ipcRenderer.on('onChangeIsInGame', handler)
    return () => ipcRenderer.off('onChangeIsInGame', handler)
  },
  onAutoAccept: (callback: (data: ReturnType<typeof LeagueController.prototype.onAutoAccept>) => void): Unsubscribe => {
    const handler = (_, data) => callback(data)
    ipcRenderer.on('onAutoAccept', handler)
    return () => ipcRenderer.off('onAutoAccept', handler)
  },
  onChangeChampionSelectSession: (callback: (data: ReturnType<typeof LeagueController.prototype.onChangeChampionSelectSession>) => void): Unsubscribe => {
    const handler = (_, data) => callback(data)
    ipcRenderer.on('onChangeChampionSelectSession', handler)
    return () => ipcRenderer.off('onChangeChampionSelectSession', handler)
  },
  onChangeCurrentSummoner: (callback: (data: ReturnType<typeof LeagueController.prototype.onChangeCurrentSummoner>) => void): Unsubscribe => {
    const handler = (_, data) => callback(data)
    ipcRenderer.on('onChangeCurrentSummoner', handler)
    return () => ipcRenderer.off('onChangeCurrentSummoner', handler)
  },
  onChangeLobby: (callback: (data: ReturnType<typeof LeagueController.prototype.onChangeLobby>) => void): Unsubscribe => {
    const handler = (_, data) => callback(data)
    ipcRenderer.on('onChangeLobby', handler)
    return () => ipcRenderer.off('onChangeLobby', handler)
  },

  // UpdateController
  onChangeUpdateStatus: (callback: (data: ReturnType<typeof UpdateController.prototype.onChangeUpdateStatus>) => void): Unsubscribe => {
    const handler = (_, data) => callback(data)
    ipcRenderer.on('onChangeUpdateStatus', handler)
    return () => ipcRenderer.off('onChangeUpdateStatus', handler)
  },
};
