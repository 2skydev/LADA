import {
  app,
  BrowserWindow,
  ipcMain,
  Menu,
  MenuItemConstructorOptions,
  nativeImage,
  shell,
  Tray,
} from 'electron'

import { Injectable, OnApplicationBootstrap, OnModuleInit } from '@nestjs/common'
import { ModuleRef } from '@nestjs/core'
import AutoLaunch from 'auto-launch'
import { paramCase } from 'change-case'
import { writeFile } from 'fs/promises'
import { groupBy } from 'lodash'
import { join } from 'path'
import { match } from 'path-to-regexp'

import { productName, protocols } from '@main/../../electron-builder.json'
import { ExecuteLog } from '@main/decorators/execute-log.decorator'
import { ConfigService } from '@main/modules/config/config.service'
import { DeepLinkHandleMap } from '@main/modules/electron/decorators/deep-link-handle.decorator'
import { IPCHandleMap } from '@main/modules/electron/decorators/ipc-handle.decorator'
import { ZOOM_PERCENT_ARRAY } from '@main/modules/electron/electron.constants'
import { AppControlAction } from '@main/modules/electron/types/app-control.type'

@Injectable()
export class ElectronService implements OnModuleInit, OnApplicationBootstrap {
  public readonly APP_PATH = app.getAppPath()
  public readonly PROTOCOL = protocols.name
  public readonly IS_MAC = process.platform === 'darwin'
  public readonly DEV_URL = `http://localhost:3000/`
  public readonly PROD_LOAD_FILE_PATH = join(this.APP_PATH, 'out/renderer/index.html')
  public readonly PRELOAD_PATH = join(this.APP_PATH, 'out/preload/index.js')
  public readonly RESOURCES_PATH = app.isPackaged
    ? join(process.resourcesPath, 'resources')
    : join(this.APP_PATH, 'resources')
  public readonly ICON = nativeImage.createFromPath(
    `${this.RESOURCES_PATH}/icons/${this.IS_MAC ? 'logo@512.png' : 'logo@256.ico'}`,
  )
  public readonly IS_HIDDEN_LAUNCH = process.argv.includes('--hidden')

  public readonly APP_WIDTH = 1800
  public readonly APP_HEIGHT = 1000

  public readonly ZOOM_PERCENT_ARRAY = ZOOM_PERCENT_ARRAY

  // main window
  public window: BrowserWindow | null = null

  public tray: Tray | null = null

  // deep link handlers
  public deepLinkHandlers: Record<string, (params: object) => void> = {}

  // update.module.ts -> autoUpdate() 참고
  public isNeedUpdate = false
  public isNeedUpdateLater = false

  public isStarted = false

  public zoom: number

  public contextMenu: MenuItemConstructorOptions[] = [
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

  public autoLauncher = new AutoLaunch({
    name: 'LADA',
    path: app.getPath('exe'),
    isHidden: true,
  })

  constructor(
    private readonly configService: ConfigService,
    private readonly moduleRef: ModuleRef,
  ) {
    // smooth scrolling
    app.commandLine.appendSwitch(`--enable-smooth-scrolling`)

    // protocol
    app.setAsDefaultProtocolClient(this.PROTOCOL)

    // zoom
    this.zoom = this.configService.get('general.zoom')
    const index = this.ZOOM_PERCENT_ARRAY.findIndex(percent => percent === this.zoom * 100)
    this.contextMenu[1].submenu![index].label = `${this.zoom * 100}% (현재값)`
  }

  @ExecuteLog()
  public async onModuleInit() {
    await app.whenReady()

    const gotTheLock = app.requestSingleInstanceLock()

    if (!gotTheLock) {
      app.quit()
      process.exit(0)
    }

    this.registerEvents()
    this.createTray()
  }

  @ExecuteLog()
  public async onApplicationBootstrap() {
    IPCHandleMap.forEach(({ channel, type, handler, target }) => {
      const instance = this.moduleRef.get(target, { strict: false })
      ipcMain[type](channel, (_, ...args) => handler.apply(instance, args))
    })

    DeepLinkHandleMap.forEach(({ path, handler, target }) => {
      const instance = this.moduleRef.get(target, { strict: false })
      this.deepLinkHandlers[path] = handler.bind(instance)
    })

    await this.generateIpcInvokeContextPreloadFile()
  }

  public async generateIpcInvokeContextPreloadFile() {
    if (app.isPackaged) return

    const groups = groupBy([...IPCHandleMap.values()], 'target.name')

    let importString = `import { ipcRenderer } from 'electron';\n\n`
    let contentString = `export const generatedIpcInvokeContext = {\n`

    Object.entries(groups).forEach(([controllerName, handlers]) => {
      const controllerFilename = paramCase(controllerName.replace('Controller', ''))

      importString += `import { ${controllerName} } from '@main/modules/${controllerFilename}/${controllerFilename}.controller';\n`

      contentString += `  // ${controllerName}\n`

      handlers.forEach(item => {
        const type = item.type === 'on' || item.type === 'once' ? 'send' : 'invoke'
        const handlerType = `typeof ${controllerName}.prototype.${item.handler.name}`
        const asyncString = type === 'invoke' ? 'async ' : ''
        const args = `...args: Parameters<${handlerType}>`
        const returnType = type === 'invoke' ? `Promise<ReturnType<${handlerType}>>` : 'void'
        const fn = `ipcRenderer.${type}('${item.channel}', ...args)`

        contentString += `  ${item.handler.name}: ${asyncString}(${args}): ${returnType} => ${fn},\n`
      })

      contentString += `\n`
    })

    contentString += `};\n`

    await writeFile(
      `src/preload/generated-ipc-invoke-context.ts`,
      `${importString}\n\n${contentString}`,
    )
  }

  // 앱 시작 (src/main/index.ts에서 실행)
  public async start() {
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

  public async createWindow() {
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

  public async appControl(action: AppControlAction) {
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

  public setZoom(zoom: number) {
    if (!this.window) return

    if (this.tray) {
      const beforeIndex = this.ZOOM_PERCENT_ARRAY.findIndex(percent => percent === this.zoom * 100)
      const afterIndex = this.ZOOM_PERCENT_ARRAY.findIndex(percent => percent === zoom * 100)

      this.contextMenu[1].submenu![beforeIndex].label = `${this.zoom * 100}%`
      this.contextMenu[1].submenu![afterIndex].label = `${zoom * 100}% (현재값)`

      this.tray.setContextMenu(Menu.buildFromTemplate(this.contextMenu))
    }

    this.zoom = zoom
    this.configService.set('general.zoom', zoom)

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

  private registerEvents() {
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

    this.configService.onAnyChange(newValue => {
      if (!this.window) return
      this.window.webContents.send('configChanged', newValue)
    })

    this.configService.onChange('general.zoom', value => {
      this.setZoom(value)
    })

    this.configService.onChange('general.autoLaunch', async value => {
      const isEnabled = await this.autoLauncher.isEnabled()

      // 아래 enable/disable 실행 시 오류가 발생 할 수 있기 때문에 두 값이 같을 경우 아무것도 하지 않는다.
      if (isEnabled === value || (!isEnabled && !value)) return

      this.autoLauncher[value ? 'enable' : 'disable']()
    })
  }

  private createTray() {
    this.tray = new Tray(this.ICON.resize({ width: 20, height: 20 }))

    this.tray.on('double-click', () => this.createWindow())
    this.tray.setToolTip(productName)
    this.tray.setContextMenu(Menu.buildFromTemplate(this.contextMenu))
  }

  private resolveDeepLink(url: string) {
    const pathname = url.replace(`${this.PROTOCOL}://`, '/')

    for (const path in this.deepLinkHandlers) {
      const data = match(path)(pathname)

      if (data) {
        this.deepLinkHandlers[path](data.params)
        break
      }
    }
  }
}
