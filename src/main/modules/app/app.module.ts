import { app, BrowserWindow, ipcMain, Menu, nativeImage, shell, Tray } from 'electron'

import { join } from 'path'
import { injectable } from 'tsyringe'

const { productName, protocols } = require(app.isPackaged
  ? './app.json'
  : '../../electron-builder.json')

export type AppControlAction = 'devtools' | 'minimize' | 'maximize' | 'close'

@injectable()
export class AppModule {
  readonly APP_PATH = app.getAppPath()
  readonly PROTOCOL = protocols.name
  readonly IS_MAC = process.platform === 'darwin'
  readonly DEV_URL = `http://localhost:3000/#`
  readonly PROD_LOAD_FILE_PATH = join(this.APP_PATH, 'out/renderer/index.html')
  readonly PROD_LOAD_FILE_HASH = '#'
  readonly PRELOAD_PATH = join(this.APP_PATH, 'out/preload/index.js')
  readonly RESOURCES_PATH = app.isPackaged
    ? join(process.resourcesPath, 'resources')
    : join(this.APP_PATH, 'resources')
  readonly ICON = nativeImage.createFromPath(
    `${this.RESOURCES_PATH}/icons/${this.IS_MAC ? 'logo@512.png' : 'logo@256.ico'}`,
  )

  window: BrowserWindow | null = null

  constructor() {
    app.commandLine.appendSwitch(`--enable-smooth-scrolling`)
    this.bootstrap()
  }

  async bootstrap() {
    await this.initialize()
    await this.createWindow()
  }

  async initialize() {
    const gotTheLock = app.requestSingleInstanceLock()

    if (!gotTheLock) {
      app.quit()
      process.exit(0)
    }

    app.setAsDefaultProtocolClient(this.PROTOCOL)

    app.on('activate', () => {
      this.createWindow()
    })

    app.on('window-all-closed', () => {
      this.window = null
    })

    ipcMain.on('appControl', async (_, action: AppControlAction) => {
      if (!this.window) return

      switch (action) {
        case 'devtools': {
          this.window.webContents.toggleDevTools()
          break
        }

        case 'minimize': {
          this.window.minimize()
          break
        }

        case 'maximize': {
          this.window.isMaximized() ? this.window.unmaximize() : this.window.maximize()
          break
        }

        case 'close': {
          this.window.close()
          break
        }
      }
    })

    await app.whenReady()
    await this.createTray()
  }

  async createWindow() {
    if (this.window) {
      if (this.window.isMinimized()) this.window.restore()
      this.window.focus()
      return
    }

    this.window = new BrowserWindow({
      width: 1800,
      height: 1000,
      backgroundColor: '#36393F',
      darkTheme: true,
      show: false,
      autoHideMenuBar: true,
      frame: false,
      icon: this.ICON,
      webPreferences: {
        preload: this.PRELOAD_PATH,
      },
    })

    if (app.isPackaged) {
      this.window.loadFile(this.PROD_LOAD_FILE_PATH, {
        hash: this.PROD_LOAD_FILE_HASH,
      })
    } else {
      await this.window.loadURL(this.DEV_URL)
      this.window.webContents.openDevTools()
    }

    this.window.on('ready-to-show', () => {
      this.window?.show()
    })

    this.window.webContents.setWindowOpenHandler(({ url }) => {
      if (url.startsWith('https:')) {
        shell.openExternal(url)
      }

      return { action: 'deny' }
    })
  }

  async createTray() {
    let tray = new Tray(this.ICON.resize({ width: 20, height: 20 }))

    const contextMenu = Menu.buildFromTemplate([
      { label: 'LADA 홈 화면 보기', type: 'normal', click: () => this.createWindow() },
      { type: 'separator' },
      { label: '앱 끄기', role: 'quit', type: 'normal' },
    ])

    tray.on('double-click', () => this.createWindow())
    tray.setToolTip(productName)
    tray.setContextMenu(contextMenu)
  }
}
