import { BrowserWindow, app } from 'electron'
import log from 'electron-log'
import { autoUpdater } from 'electron-updater'

import { singleton } from '@launchtray/tsyringe-async'

import { IPCHandle } from '@main/core/decorators/ipcHandle'
import { AppModule } from '@main/modules/app/app.module'
import { LeagueModule } from '@main/modules/league/league.module'
import { UpdateEvent, updateStore } from '@main/modules/update/stores/update.store'

@singleton()
export class UpdateModule {
  private listenEvents = [
    'checking-for-update',
    'update-available',
    'update-not-available',
    'download-progress',
    'update-downloaded',
    'error',
  ] as const

  public updateLoadingWindow: BrowserWindow | null = null

  constructor(private appModule: AppModule, private leagueModule: LeagueModule) {
    autoUpdater.logger = log
    autoUpdater.autoInstallOnAppQuit = true
    autoUpdater.disableWebInstaller = true

    this.listenEvents.forEach(event => {
      autoUpdater.on(event, this.handleUpdateEvent(event))
    })
  }

  // 자동 업데이트 (앱 처음 켰을 때 실행)
  async autoUpdate() {
    return new Promise<boolean>(async resolve => {
      let isLeagueChampSelectingPromise: Promise<boolean> | null = null

      if (!this.appModule.IS_HIDDEN_LAUNCH) {
        isLeagueChampSelectingPromise = this.leagueModule.isLeagueChampSelecting()
      }

      const stopAutoUpdate = () => {
        autoUpdater.off('update-available', handleUpdateAvailable)
        autoUpdater.off('update-not-available', handleUpdateNotAvailable)
        autoUpdater.off('update-downloaded', handleUpdateDownloaded)
        resolve(false)
      }

      const handleUpdateAvailable = async () => {
        if (!this.appModule.IS_HIDDEN_LAUNCH) {
          const isLeagueChampSelecting = await isLeagueChampSelectingPromise

          if (isLeagueChampSelecting) {
            // 챔피언 선택 중이면 업데이트 안함
            this.appModule.isNeedUpdateLater = true
            stopAutoUpdate()
          } else {
            this.appModule.isNeedUpdate = true
            await this.openUpdateLoadingWindow()
          }
        }
      }

      const handleUpdateNotAvailable = () => {
        stopAutoUpdate()
      }

      const handleUpdateDownloaded = () => {
        autoUpdater.quitAndInstall(true, true)
        resolve(true)
      }

      autoUpdater.on('update-available', handleUpdateAvailable)
      autoUpdater.on('update-not-available', handleUpdateNotAvailable)
      autoUpdater.on('update-downloaded', handleUpdateDownloaded)

      const result = await autoUpdater.checkForUpdates()
      if (!result) stopAutoUpdate()
    })
  }

  async openUpdateLoadingWindow() {
    this.updateLoadingWindow = new BrowserWindow({
      width: 300,
      height: 300,
      backgroundColor: '#36393F',
      darkTheme: true,
      show: false,
      autoHideMenuBar: true,
      frame: false,
      icon: this.appModule.ICON,
      resizable: false,
      webPreferences: {
        preload: this.appModule.PRELOAD_PATH,
      },
    })

    if (app.isPackaged) {
      this.updateLoadingWindow.loadFile(this.appModule.PROD_LOAD_FILE_PATH, {
        hash: '#/windows/update-loading',
      })
    } else {
      await this.updateLoadingWindow.loadURL(this.appModule.DEV_URL + '#/windows/update-loading')
    }

    this.updateLoadingWindow.on('ready-to-show', () => {
      this.updateLoadingWindow?.show()
    })
  }

  handleUpdateEvent(event: UpdateEvent) {
    return (data: any) => {
      if (event !== 'download-progress') {
        updateStore.set('status', {
          event,
          data,
          time: new Date().getTime(),
        })
      }

      if (this.appModule.window) {
        this.appModule.window.webContents.send('update', event, data)
      }

      if (this.updateLoadingWindow) {
        this.updateLoadingWindow.webContents.send('update', event, data)
      }
    }
  }

  @IPCHandle()
  async getVersion() {
    return app.getVersion()
  }

  @IPCHandle()
  async getUpdaterStatus() {
    return updateStore.get('status')
  }

  @IPCHandle({ type: 'on' })
  async checkForUpdate() {
    autoUpdater.checkForUpdates()
  }

  @IPCHandle({ type: 'on' })
  async quitAndInstall() {
    autoUpdater.quitAndInstall()
  }
}
