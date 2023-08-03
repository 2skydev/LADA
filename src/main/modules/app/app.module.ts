import {
  app,
  BrowserWindow,
  Menu,
  MenuItemConstructorOptions,
  nativeImage,
  shell,
  Tray,
} from 'electron'

import { initializer, singleton } from '@launchtray/tsyringe-async'
import { join } from 'path'
import { match } from 'path-to-regexp'

import { productName, protocols } from '@main/../../electron-builder.json'
import { IPCHandle } from '@main/core/decorators/ipcHandle'
import { ZOOM_PERCENT_ARRAY } from '@main/modules/app/constants/size'
import { ConfigModule } from '@main/modules/config/config.module'

export type AppControlAction = 'devtools' | 'minimize' | 'maximize' | 'close'

@singleton()
export class AppModule {
  readonly APP_PATH = app.getAppPath()
  readonly PROTOCOL = protocols.name
  readonly IS_MAC = process.platform === 'darwin'
  readonly DEV_URL = `http://localhost:3000/`
  readonly PROD_LOAD_FILE_PATH = join(this.APP_PATH, 'out/renderer/index.html')
  readonly PRELOAD_PATH = join(this.APP_PATH, 'out/preload/index.js')
  readonly RESOURCES_PATH = app.isPackaged
    ? join(process.resourcesPath, 'resources')
    : join(this.APP_PATH, 'resources')
  readonly ICON = nativeImage.createFromPath(
    `${this.RESOURCES_PATH}/icons/${this.IS_MAC ? 'logo@512.png' : 'logo@256.ico'}`,
  )
  readonly IS_HIDDEN_LAUNCH = process.argv.includes('--hidden')

  readonly APP_WIDTH = 1800
  readonly APP_HEIGHT = 1000

  readonly ZOOM_PERCENT_ARRAY = ZOOM_PERCENT_ARRAY

  // main window
  window: BrowserWindow | null = null

  tray: Tray | null = null

  // deep link handlers
  deepLinkHandlers: Record<string, (params: object) => void> = {}

  // update.module.ts -> autoUpdate() 참고
  isNeedUpdate = false
  isNeedUpdateLater = false

  isStarted = false

  zoom: number

  contextMenu: MenuItemConstructorOptions[] = [
    { label: 'LADA 홈 화면 보기', type: 'normal', click: () => this.createWindow() },
    {
      label: '앱 비율 설정',
      type: 'submenu',
      submenu: [
        ...this.ZOOM_PERCENT_ARRAY.map(
          percent =>
            ({
              label: `${percent}%`,
              type: 'normal',
              click: () => this.setZoom(percent / 100),
            } as MenuItemConstructorOptions),
        ),
      ],
    },
    { type: 'separator' },
    { label: '앱 끄기', role: 'quit', type: 'normal' },
  ]

  constructor(private configModule: ConfigModule) {
    // smooth scrolling
    app.commandLine.appendSwitch(`--enable-smooth-scrolling`)

    // protocol
    app.setAsDefaultProtocolClient(this.PROTOCOL)

    // zoom
    this.zoom = this.configModule.store.get('general.zoom')
    const index = this.ZOOM_PERCENT_ARRAY.findIndex(percent => percent === this.zoom * 100)
    this.contextMenu[1].submenu![index].label = `${this.zoom * 100}% (현재값)`
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
    if (!this.IS_HIDDEN_LAUNCH && !this.isNeedUpdate) {
      await this.createWindow()

      if (this.isNeedUpdateLater) {
        setTimeout(() => {
          this.window?.webContents.send('needUpdateLater')
        }, 3000)
      }
    }

    this.isStarted = true
  }

  async createWindow() {
    return new Promise<void>(async resolve => {
      if (this.window) {
        if (this.window.isMinimized()) this.window.restore()
        this.window.focus()
        return
      }

      this.window = new BrowserWindow({
        width: this.APP_WIDTH,
        height: this.APP_HEIGHT,
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
        await this.window.loadFile(this.PROD_LOAD_FILE_PATH, {
          hash: '#',
        })
      } else {
        await this.window.loadURL(this.DEV_URL + '#')
        this.window.webContents.openDevTools()
      }

      this.window.on('ready-to-show', () => {
        this.applyZoom(this.zoom)
        this.window!.show()
        resolve()
      })

      this.window.on('close', () => {
        this.window = null
      })

      this.window.webContents.setWindowOpenHandler(({ url }) => {
        if (url.startsWith('https:')) {
          shell.openExternal(url)
        }

        return { action: 'deny' }
      })
    })
  }

  setZoom(zoom: number) {
    if (!this.window) return

    if (this.tray) {
      const beforeIndex = this.ZOOM_PERCENT_ARRAY.findIndex(percent => percent === this.zoom * 100)
      const afterIndex = this.ZOOM_PERCENT_ARRAY.findIndex(percent => percent === zoom * 100)

      this.contextMenu[1].submenu![beforeIndex].label = `${this.zoom * 100}%`
      this.contextMenu[1].submenu![afterIndex].label = `${zoom * 100}% (현재값)`

      this.tray.setContextMenu(Menu.buildFromTemplate(this.contextMenu))
    }

    this.zoom = zoom
    this.configModule.store.set('general.zoom', zoom)

    this.applyZoom(zoom)
  }

  private applyZoom(zoom: number) {
    if (!this.window) return

    // setMinimumSize를 사용하는 이유는 아래 setSize만 사용했을 때 의도된 설계인지 모르겠지만 최소 크기가 자동으로 변경되어 크기를 줄일 수 없다.
    // 그래서 setMinimumSize를 사용하여 직접 최소 크기를 변경 후 setSize를 사용하여 크기를 변경한다.
    this.window.setMinimumSize(this.APP_WIDTH * zoom, this.APP_HEIGHT * zoom)
    this.window.setSize(this.APP_WIDTH * zoom, this.APP_HEIGHT * zoom, true)
    this.window.webContents.setZoomFactor(zoom)
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

    this.configModule.store.onDidAnyChange(newValue => {
      if (!this.window) return
      this.window.webContents.send('configChanged', newValue)
    })

    this.configModule.onChange('general.zoom', value => {
      this.setZoom(value)
    })
  }

  createTray() {
    this.tray = new Tray(this.ICON.resize({ width: 20, height: 20 }))

    this.tray.on('double-click', () => this.createWindow())
    this.tray.setToolTip(productName)
    this.tray.setContextMenu(Menu.buildFromTemplate(this.contextMenu))
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
