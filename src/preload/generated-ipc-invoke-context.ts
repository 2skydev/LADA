import { ipcRenderer } from 'electron';

import { ConfigController } from '@main/modules/config/config.controller';
import { DeveloperController } from '@main/modules/developer/developer.controller';
import { ElectronController } from '@main/modules/electron/electron.controller';
import { LeagueController } from '@main/modules/league/league.controller';
import { StatsProviderIntegrationController } from '@main/modules/stats-provider-integration/stats-provider-integration.controller';
import { UpdateController } from '@main/modules/update/update.controller';


export const generatedIpcInvokeContext = {
  // ConfigController
  getConfig: async (...args: Parameters<typeof ConfigController.prototype.getConfig>): Promise<ReturnType<typeof ConfigController.prototype.getConfig>> => ipcRenderer.invoke('getConfig', ...args),
  setConfig: async (...args: Parameters<typeof ConfigController.prototype.setConfig>): Promise<ReturnType<typeof ConfigController.prototype.setConfig>> => ipcRenderer.invoke('setConfig', ...args),

  // DeveloperController
  getStorePath: async (...args: Parameters<typeof DeveloperController.prototype.getStorePath>): Promise<ReturnType<typeof DeveloperController.prototype.getStorePath>> => ipcRenderer.invoke('getStorePath', ...args),
  getLogs: async (...args: Parameters<typeof DeveloperController.prototype.getLogs>): Promise<ReturnType<typeof DeveloperController.prototype.getLogs>> => ipcRenderer.invoke('getLogs', ...args),
  clearLogs: async (...args: Parameters<typeof DeveloperController.prototype.clearLogs>): Promise<ReturnType<typeof DeveloperController.prototype.clearLogs>> => ipcRenderer.invoke('clearLogs', ...args),

  // ElectronController
  appControl: (...args: Parameters<typeof ElectronController.prototype.appControl>): void => ipcRenderer.send('appControl', ...args),

  // LeagueController
  isReady: async (...args: Parameters<typeof LeagueController.prototype.isReady>): Promise<ReturnType<typeof LeagueController.prototype.isReady>> => ipcRenderer.invoke('league.isReady', ...args),
  getCurrentSummoner: async (...args: Parameters<typeof LeagueController.prototype.getCurrentSummoner>): Promise<ReturnType<typeof LeagueController.prototype.getCurrentSummoner>> => ipcRenderer.invoke('league.getCurrentSummoner', ...args),
  getLobby: async (...args: Parameters<typeof LeagueController.prototype.getLobby>): Promise<ReturnType<typeof LeagueController.prototype.getLobby>> => ipcRenderer.invoke('league.getLobby', ...args),
  getChampionNames: async (...args: Parameters<typeof LeagueController.prototype.getChampionNames>): Promise<ReturnType<typeof LeagueController.prototype.getChampionNames>> => ipcRenderer.invoke('league.getChampionNames', ...args),
  getRuneData: async (...args: Parameters<typeof LeagueController.prototype.getRuneData>): Promise<ReturnType<typeof LeagueController.prototype.getRuneData>> => ipcRenderer.invoke('league.getRuneData', ...args),

  // StatsProviderIntegrationController
  getChampionStats: async (...args: Parameters<typeof StatsProviderIntegrationController.prototype.getChampionStats>): Promise<ReturnType<typeof StatsProviderIntegrationController.prototype.getChampionStats>> => ipcRenderer.invoke('integration.getChampionStats', ...args),
  getChampionTierList: async (...args: Parameters<typeof StatsProviderIntegrationController.prototype.getChampionTierList>): Promise<ReturnType<typeof StatsProviderIntegrationController.prototype.getChampionTierList>> => ipcRenderer.invoke('integration.getChampionTierList', ...args),
  getDuoSynergyList: async (...args: Parameters<typeof StatsProviderIntegrationController.prototype.getDuoSynergyList>): Promise<ReturnType<typeof StatsProviderIntegrationController.prototype.getDuoSynergyList>> => ipcRenderer.invoke('integration.getDuoSynergyList', ...args),
  getInGame: async (...args: Parameters<typeof StatsProviderIntegrationController.prototype.getInGame>): Promise<ReturnType<typeof StatsProviderIntegrationController.prototype.getInGame>> => ipcRenderer.invoke('integration.getInGame', ...args),
  getSummonerStatsByName: async (...args: Parameters<typeof StatsProviderIntegrationController.prototype.getSummonerStatsByName>): Promise<ReturnType<typeof StatsProviderIntegrationController.prototype.getSummonerStatsByName>> => ipcRenderer.invoke('integration.getSummonerStatsByName', ...args),
  getSummonerStatsListByNames: async (...args: Parameters<typeof StatsProviderIntegrationController.prototype.getSummonerStatsListByNames>): Promise<ReturnType<typeof StatsProviderIntegrationController.prototype.getSummonerStatsListByNames>> => ipcRenderer.invoke('integration.getSummonerStatsListByNames', ...args),

  // UpdateController
  getVersion: async (...args: Parameters<typeof UpdateController.prototype.getVersion>): Promise<ReturnType<typeof UpdateController.prototype.getVersion>> => ipcRenderer.invoke('getVersion', ...args),
  getUpdateStatus: async (...args: Parameters<typeof UpdateController.prototype.getUpdateStatus>): Promise<ReturnType<typeof UpdateController.prototype.getUpdateStatus>> => ipcRenderer.invoke('getUpdateStatus', ...args),
  checkForUpdate: async (...args: Parameters<typeof UpdateController.prototype.checkForUpdate>): Promise<ReturnType<typeof UpdateController.prototype.checkForUpdate>> => ipcRenderer.invoke('checkForUpdate', ...args),
  quitAndInstall: (...args: Parameters<typeof UpdateController.prototype.quitAndInstall>): void => ipcRenderer.send('quitAndInstall', ...args),

};
