import { BrowserWindow, app } from 'electron'
import log from 'electron-log'
import { autoUpdater } from 'electron-updater'

import { Injectable, OnModuleInit } from '@nestjs/common'
import { ModuleRef } from '@nestjs/core'

import { ExecuteLog } from '@main/decorators/execute-log.decorator'
import { AppWindow } from '@main/modules/electron/decorators/app-window.decorator'
import { ElectronService } from '@main/modules/electron/electron.service'
import { LeagueService } from '@main/modules/league/league.service'
import { UpdateStatus, UpdateStatusEvent } from '@main/modules/update/types/update-status.type'
import { UPDATE_LOADING_WINDOW_KEY } from '@main/modules/update/update.constants'
import { UpdateController } from '@main/modules/update/update.controller'

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

  @AppWindow(UPDATE_LOADING_WINDOW_KEY)
  public updateLoadingWindow: BrowserWindow | null = null

  private controller: UpdateController

  constructor(
    private readonly electronService: ElectronService,
    private readonly leagueService: LeagueService,
    private readonly moduleRef: ModuleRef,
  ) {
    autoUpdater.logger = log
    autoUpdater.autoInstallOnAppQuit = true
    autoUpdater.disableWebInstaller = true

    this.listenEvents.forEach(event => {
      autoUpdater.on(event, this.handleUpdateEvent(event))
    })
  }

  onModuleInit() {
    this.controller = this.moduleRef.get(UpdateController)
  }

  // 자동 업데이트 (src/main/index.ts에서 실행)
  @ExecuteLog()
  async autoUpdate() {
    return new Promise<boolean>(async resolve => {
      let isChampionSelectingPromise: Promise<boolean> | null = null

      if (!this.electronService.IS_HIDDEN_LAUNCH) {
        isChampionSelectingPromise = this.leagueService.isChampionSelecting()
      }

      const stopAutoUpdate = () => {
        autoUpdater.off('update-available', handleUpdateAvailable)
        autoUpdater.off('update-not-available', handleUpdateNotAvailable)
        autoUpdater.off('update-downloaded', handleUpdateDownloaded)
        resolve(false)
      }

      const handleUpdateAvailable = async () => {
        if (!this.electronService.IS_HIDDEN_LAUNCH) {
          const isChampionSelecting = await isChampionSelectingPromise

          if (isChampionSelecting) {
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

      this.controller.onChangeUpdateStatus(this.status)
    }
  }

  public async checkForUpdates() {
    return autoUpdater.checkForUpdates()
  }

  public quitAndInstall() {
    autoUpdater.quitAndInstall()
  }
}
