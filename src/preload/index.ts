import { contextBridge, ipcRenderer } from 'electron'

import { AppControlAction } from '@main/modules/app/app.module'
import { ConfigStoreValues } from '@main/modules/config/stores/config.store'
import { Log } from '@main/modules/developer/developer.module'
import { UpdateEvent, UpdateStatus } from '@main/modules/update/stores/update.store'

const electronContext = {
  /**
   * =================================
   * AppModule IPCs
   * =================================
   */

  /**
   * 앱 창 컨트롤 (최소화, 최대화, 닫기)
   */
  appControl: (action: AppControlAction) => ipcRenderer.send('appControl', action),

  /**
   * 외부 링크 열기
   */
  openExternal: (link: string) => ipcRenderer.send('openExternal', link),

  /**
   * =================================
   * ConfigModule IPCs
   * =================================
   */

  /**
   * 설정 가져오기
   */
  getConfig: (): Promise<ConfigStoreValues> => ipcRenderer.invoke('getConfig'),

  /**
   * 설정 저장
   */
  setConfig: (config: ConfigStoreValues): Promise<ConfigStoreValues> =>
    ipcRenderer.invoke('setConfig', config),

  /**
   * 설정 변경 이벤트 리스너
   */
  onChangeConfig: (callback: (newValue: ConfigStoreValues) => void) =>
    ipcRenderer.on('configChanged', (_, newValue) => callback(newValue)),

  /**
   * =================================
   * UpdateModule IPCs
   * =================================
   */

  /**
   * 앱 버전 가져오기
   */
  getVersion: (): Promise<string> => ipcRenderer.invoke('getVersion'),

  /**
   * 업데이트 상태 가져오기
   */
  getUpdaterStatus: (): Promise<UpdateStatus> => ipcRenderer.invoke('getUpdaterStatus'),

  /**
   * 업데이트 이벤트 리스너
   */
  onUpdate: (callback: (event: UpdateEvent, data: any) => void) =>
    ipcRenderer.on('update', (_, event, data) => callback(event, data)),

  /**
   * 이후 업데이트 필요 여부 리스너
   */
  onUpdateLater: (callback: () => void) => ipcRenderer.on('needUpdateLater', () => callback()),

  /**
   * 업데이트 확인
   */
  checkForUpdate: () => ipcRenderer.send('checkForUpdate'),

  /**
   * 앱 종료 후 업데이트 설치
   */
  quitAndInstall: () => ipcRenderer.send('quitAndInstall'),

  /**
   * =================================
   * DeveloperModule IPCs
   * =================================
   */

  /**
   * 저장소 경로 가져오기
   */
  getStorePath: (): Promise<string> => ipcRenderer.invoke('getStorePath'),

  /**
   * 로그 내용 가져오기
   */
  getLogs: (): Promise<Log[]> => ipcRenderer.invoke('getLogs'),

  /**
   * 로그 비우기
   */
  clearLogs: (): Promise<boolean> => ipcRenderer.invoke('clearLogs'),

  /**
   * =================================
   * [LeagueModule, PSModule] IPCs
   * =================================
   */

  /**
   * API 요청 (LeagueModule, PSModule)
   */
  apis: (category: 'ps' | 'league', url: string, payload?: any) =>
    ipcRenderer.invoke(`apis/${category}`, url, payload),

  /**
   * =================================
   * LeagueModule IPCs
   * =================================
   */

  /**
   * League of Legends 클라이언트 WS 구독
   */
  subscribeLeague: (path: string, callback: (data: any) => void) =>
    ipcRenderer.on(`league/${path}`, (_, data) => callback(data)),

  /**
   * League of Legends 클라이언트 WS 구독해제
   */
  unsubscribeLeague: (path: string) => ipcRenderer.removeAllListeners(`league/${path}`),

  /**
   * League of Legends 최신 패치 버전 가져오기
   */
  getLeagueVersion: (): Promise<string> => ipcRenderer.invoke('getLeagueVersion'),
}

export type ElectronContext = typeof electronContext

contextBridge.exposeInMainWorld('electron', electronContext)
