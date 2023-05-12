import { app } from 'electron'
import log from 'electron-log'
import { autoUpdater } from 'electron-updater'

import { singleton } from '@launchtray/tsyringe-async'

import { IPCHandle } from '@main/core/decorators/ipcHandle'
import { AppModule } from '@main/modules/app/app.module'
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

  constructor(private appModule: AppModule) {
    autoUpdater.logger = log
    autoUpdater.autoInstallOnAppQuit = true
    autoUpdater.fullChangelog = true

    this.listenEvents.forEach(event => {
      autoUpdater.on(event, this.handleUpdateEvent(event))
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

  @IPCHandle({ type: 'once' })
  async initializeUpdater() {
    autoUpdater.checkForUpdates()
  }
}
