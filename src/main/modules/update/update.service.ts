import { BrowserWindow, app } from 'electron'
import log from 'electron-log'
import { autoUpdater } from 'electron-updater'

import { Injectable, OnModuleInit } from '@nestjs/common'

import { ExecuteLog } from '@main/decorators/execute-log.decorator'
import { ElectronService } from '@main/modules/electron/electron.service'
import { LeagueService } from '@main/modules/league/league.service'
import { UpdateStatus, UpdateStatusEvent } from '@main/modules/update/types/update-status.type'

@Injectable()
export class UpdateService implements OnModuleInit {
  private listenEvents = [
    'checking-for-update',
    'update-available',
    'update-not-available',
    'download-progress',
    'update-downloaded',
    'error',
  ] as const

  public status: UpdateStatus = {
    event: 'checking-for-update',
    data: null,
    time: new Date().getTime(),
  }

  public updateLoadingWindow: BrowserWindow | null = null

  constructor(private electronService: ElectronService, private leagueService: LeagueService) {
    autoUpdater.logger = log
    autoUpdater.autoInstallOnAppQuit = true
    autoUpdater.disableWebInstaller = true

    this.listenEvents.forEach(event => {
      autoUpdater.on(event, this.handleUpdateEvent(event))
    })
  }

  @ExecuteLog()
  async onModuleInit() {
    await this.autoUpdate()
  }

  // 자동 업데이트 (앱 처음 켰을 때 실행)
  async autoUpdate() {
    return new Promise<boolean>(async resolve => {
      let isLeagueChampSelectingPromise: Promise<boolean> | null = null

      if (!this.electronService.IS_HIDDEN_LAUNCH) {
        isLeagueChampSelectingPromise = this.leagueService.isLeagueChampSelecting()
      }

      const stopAutoUpdate = () => {
        autoUpdater.off('update-available', handleUpdateAvailable)
        autoUpdater.off('update-not-available', handleUpdateNotAvailable)
        autoUpdater.off('update-downloaded', handleUpdateDownloaded)
        resolve(false)
      }

      const handleUpdateAvailable = async () => {
        if (!this.electronService.IS_HIDDEN_LAUNCH) {
          const isLeagueChampSelecting = await isLeagueChampSelectingPromise

          if (isLeagueChampSelecting) {
            // 챔피언 선택 중이면 업데이트 안함
            this.electronService.isNeedUpdateLater = true
            stopAutoUpdate()
          } else {
            this.electronService.isNeedUpdate = true
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
      icon: this.electronService.ICON,
      resizable: false,
      webPreferences: {
        preload: this.electronService.PRELOAD_PATH,
      },
    })

    if (app.isPackaged) {
      await this.updateLoadingWindow.loadFile(this.electronService.PROD_LOAD_FILE_PATH, {
        hash: '#/windows/update-loading',
      })
    } else {
      await this.updateLoadingWindow.loadURL(
        this.electronService.DEV_URL + '#/windows/update-loading',
      )
    }

    this.updateLoadingWindow.on('ready-to-show', () => {
      this.updateLoadingWindow?.show()
    })
  }

  private handleUpdateEvent(event: UpdateStatusEvent) {
    return (data: any) => {
      this.status = {
        event,
        data,
        time: new Date().getTime(),
      }

      if (this.electronService.window) {
        this.electronService.window.webContents.send('updateStatus', this.status)
      }

      if (this.updateLoadingWindow) {
        this.updateLoadingWindow.webContents.send('updateStatus', this.status)
      }
    }
  }

  public async checkForUpdates() {
    return autoUpdater.checkForUpdates()
  }

  public quitAndInstall() {
    autoUpdater.quitAndInstall()
  }
}
