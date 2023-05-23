import { app, BrowserWindow, Menu, nativeImage, shell, Tray } from 'electron'

import { initializer, singleton } from '@launchtray/tsyringe-async'
import { join } from 'path'
import { match } from 'path-to-regexp'

import { productName, protocols } from '@main/../../electron-builder.json'
import { IPCHandle } from '@main/core/decorators/ipcHandle'

export type AppControlAction = 'devtools' | 'minimize' | 'maximize' | 'close'

@singleton()
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
  readonly IS_HIDDEN_LAUNCH = process.argv.includes('--hidden')

  // main window
  window: BrowserWindow | null = null

  // deep link handlers
  deepLinkHandlers: Record<string, (params: object) => void> = {}

  constructor() {
    app.commandLine.appendSwitch(`--enable-smooth-scrolling`)
    app.setAsDefaultProtocolClient(this.PROTOCOL)
  }

  @initializer()
  async init() {
    await app.whenReady()

    const gotTheLock = app.requestSingleInstanceLock()

    if (!gotTheLock) {
      app.quit()
      process.exit(0)
    }

    this.registerEvents()
    this.createTray()
  }

  async start() {
    if (!this.IS_HIDDEN_LAUNCH) {
      await this.createWindow()
    }
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
      resizable: false,
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

  registerEvents() {
    app.on('activate', () => {
      this.createWindow()
    })

    app.on('window-all-closed', () => {
      this.window = null
    })

    app.on('second-instance', (_, argv) => {
      if (!this.IS_MAC) {
        const url = argv.find(arg => arg.startsWith(`${this.PROTOCOL}://`))
        if (url) this.resolveDeepLink(url)
      }
    })

    app.on('open-url', (_, url) => {
      this.resolveDeepLink(url)
    })
  }

  createTray() {
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

  resolveDeepLink(url: string) {
    const pathname = url.replace(`${this.PROTOCOL}://`, '/')

    for (const path in this.deepLinkHandlers) {
      const data = match(path)(pathname)

      if (data) {
        this.deepLinkHandlers[path](data.params)
        break
      }
    }
  }

  @IPCHandle({ type: 'on' })
  appControl(action: AppControlAction) {
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
  }
}
