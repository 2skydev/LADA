import { app, ipcMain } from 'electron'
import log from 'electron-log'
import { autoUpdater } from 'electron-updater'

import { injectable } from 'tsyringe'

import { AppModule } from '@main/modules/app/app.module'
import { UpdateEvent, updateStore } from '@main/modules/update/stores/update.store'

@injectable()
export class UpdateModule {
  constructor(private appModule: AppModule) {
    console.log('UpdateModule')

    ipcMain.handle('getVersion', async () => {
      return app.getVersion()
    })

    ipcMain.handle('getUpdaterStatus', async () => {
      return updateStore.get('status')
    })

    ipcMain.on('checkForUpdate', async () => {
      autoUpdater.checkForUpdates()
    })

    ipcMain.on('quitAndInstall', async () => {
      autoUpdater.quitAndInstall()
    })

    ipcMain.once('initializeUpdater', async () => {
      autoUpdater.logger = log
      autoUpdater.autoInstallOnAppQuit = true
      autoUpdater.fullChangelog = true

      autoUpdater.on('checking-for-update', this.handleUpdateEvent('checking-for-update'))
      autoUpdater.on('update-available', this.handleUpdateEvent('update-available'))
      autoUpdater.on('update-not-available', this.handleUpdateEvent('update-not-available'))
      autoUpdater.on('download-progress', this.handleUpdateEvent('download-progress'))
      autoUpdater.on('update-downloaded', this.handleUpdateEvent('update-downloaded'))
      autoUpdater.on('error', this.handleUpdateEvent('error'))

      autoUpdater.checkForUpdates()
    })
  }

  handleUpdateEvent(event: UpdateEvent) {
    return (data?: any) => {
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
}
