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
import { writeFile, readdir, readFile } from 'fs/promises'
import i18next from 'i18next'
import { parse as jsoncParse } from 'jsonc-parser'
import { groupBy } from 'lodash'
import { join } from 'path'
import { match } from 'path-to-regexp'

import { productName, protocols } from '@main/../../electron-builder.json'
import { ExecuteLog } from '@main/decorators/execute-log.decorator'
import { ConfigService } from '@main/modules/config/config.service'
import { AppWindow, AppWindowMap } from '@main/modules/electron/decorators/app-window.decorator'
import { DeepLinkHandleMap } from '@main/modules/electron/decorators/deep-link-handle.decorator'
import { IPCHandleMap } from '@main/modules/electron/decorators/ipc-handle.decorator'
import { IPCSenderMap } from '@main/modules/electron/decorators/ipc-sender.decorator'
import {
  ELECTRON_MAIN_WINDOW_KEY,
  ZOOM_PERCENT_ARRAY,
} from '@main/modules/electron/electron.constants'
import { ElectronController } from '@main/modules/electron/electron.controller'
import { AppControlAction } from '@main/modules/electron/types/app-control.type'
import { LanguageOption } from '@main/modules/electron/types/language.types'

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
  @AppWindow(ELECTRON_MAIN_WINDOW_KEY)
  public window: BrowserWindow | null = null

  public tray: Tray | null = null

  // deep link handlers
  public deepLinkHandlers: Record<string, (params: object) => void> = {}

  // update.module.ts -> autoUpdate() 참고
  public isNeedUpdate = false
  public isNeedUpdateLater = false

  public isStarted = false

  public zoom: number

  public autoLauncher = new AutoLaunch({
    name: 'LADA',
    path: app.getPath('exe'),
    isHidden: true,
  })

  public languageOptions: LanguageOption[] = []

  private controller: ElectronController

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
  }

  @ExecuteLog()
  public async onModuleInit() {
    this.controller = this.moduleRef.get(ElectronController)

    await app.whenReady()
    await this.initI18Next()

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

    IPCSenderMap.forEach(({ channel, windowKeys, handler, target }) => {
      const instance = this.moduleRef.get(target, { strict: false })

      const windows = windowKeys.map(windowKey => {
        const windowMetadata = AppWindowMap.get(windowKey)

        if (!windowMetadata) throw new Error(`[ @AppWindow ] Window key '${windowKey}' not found.`)

        const instance = this.moduleRef.get(windowMetadata.target, { strict: false })

        return {
          propertyName: windowMetadata.propertyName,
          instance,
        }
      })

      const originalHandler = handler

      const newHandler = function (...args: any[]) {
        const result = originalHandler.apply(instance, args)

        windows.forEach(({ propertyName, instance }) => {
          instance[propertyName]?.webContents.send(channel, result)
        })
      }

      instance[channel] = newHandler
    })

    await this.generateIpcInvokeContextPreloadFile()
    await this.generateIpcOnContextPreloadFile()
  }

  public async generateIpcInvokeContextPreloadFile() {
    if (app.isPackaged) return

    const groups = groupBy([...IPCHandleMap.values()], 'target.name')

    let importString = `import { ipcRenderer } from 'electron';\n\n`
    let contentString = `export const generatedIpcInvokeContext = {`

    Object.entries(groups).forEach(([controllerName, handlers]) => {
      const controllerFilename = paramCase(controllerName.replace('Controller', ''))

      importString += `import { ${controllerName} } from '@main/modules/${controllerFilename}/${controllerFilename}.controller';\n`

      contentString += `\n  // ${controllerName}\n`

      handlers.forEach(item => {
        const type = item.type === 'on' || item.type === 'once' ? 'send' : 'invoke'
        const handlerType = `typeof ${controllerName}.prototype.${item.handler.name}`
        const asyncString = type === 'invoke' ? 'async ' : ''
        const args = `...args: Parameters<${handlerType}>`
        const returnType = type === 'invoke' ? `Promise<ReturnType<${handlerType}>>` : 'void'
        const fn = `ipcRenderer.${type}('${item.channel}', ...args)`

        contentString += `  ${item.handler.name}: ${asyncString}(${args}): ${returnType} => ${fn},\n`
      })
    })

    contentString += `};\n`

    await writeFile(
      `src/preload/generated-ipc-invoke-context.ts`,
      `${importString}\n${contentString}`,
    )
  }

  public async generateIpcOnContextPreloadFile() {
    if (app.isPackaged) return

    const groups = groupBy([...IPCSenderMap.values()], 'target.name')

    let importString = `import { ipcRenderer } from 'electron';\n\n`
    let contentString = `type Unsubscribe = () => void

export const generatedIpcOnContext = {`

    Object.entries(groups).forEach(([controllerName, handlers]) => {
      const controllerFilename = paramCase(controllerName.replace('Controller', ''))

      importString += `import { ${controllerName} } from '@main/modules/${controllerFilename}/${controllerFilename}.controller';\n`

      contentString += `\n  // ${controllerName}\n`

      handlers.forEach(item => {
        const handlerType = `typeof ${controllerName}.prototype.${item.handler.name}`
        const callback = `callback: (data: ReturnType<${handlerType}>) => void`
        const fn = `{
    const handler = (_, data) => callback(data)
    ipcRenderer.on('${item.channel}', handler)
    return () => ipcRenderer.off('${item.channel}', handler)
  }`

        contentString += `  ${item.handler.name}: (${callback}): Unsubscribe => ${fn},\n`
      })
    })

    contentString += `};\n`

    await writeFile(`src/preload/generated-ipc-on-context.ts`, `${importString}\n${contentString}`)
  }

  // 앱 시작 (src/main/index.ts에서 실행)
  @ExecuteLog()
  public async start() {
    if (!this.IS_HIDDEN_LAUNCH && !this.isNeedUpdate) {
      await this.createWindow()

      if (this.isNeedUpdateLater) {
        setTimeout(() => {
          this.controller.onNeedUpdateLater()
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
    this.zoom = zoom
    this.configService.set('general.zoom', zoom)
    this.applyZoom(zoom)
    this.reloadContextMenu()
  }

  public relaunch() {
    app.relaunch()
    app.quit()
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
      if (!this.window || !newValue) return
      this.controller.onChangeConfigValue(newValue)
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

    this.configService.onChange('general.language', async value => {
      await i18next.changeLanguage(value!)
      this.controller.onChangeLanguage(value!)
    })
  }

  private createTray() {
    this.tray = new Tray(this.ICON.resize({ width: 20, height: 20 }))

    this.tray.on('double-click', () => this.createWindow())
    this.tray.setToolTip(productName)

    this.reloadContextMenu()
  }

  private reloadContextMenu() {
    const template: MenuItemConstructorOptions[] = [
      {
        label: i18next.t('main.contextMenu.showHome'),
        type: 'normal',
        click: () => this.createWindow(),
      },
      {
        label: i18next.t('main.contextMenu.setAppZoom'),
        type: 'submenu',
        submenu: [
          ...this.ZOOM_PERCENT_ARRAY.map(
            percent =>
              ({
                label: `${percent}%${
                  percent === this.zoom * 100 ? ` (${i18next.t('main.contextMenu.nowValue')})` : ''
                }`,
                type: 'normal',
                click: () => this.setZoom(percent / 100),
              } as MenuItemConstructorOptions),
          ),
        ],
      },
      { type: 'separator' },
      { label: i18next.t('main.contextMenu.quit'), role: 'quit', type: 'normal' },
    ]

    this.tray?.setContextMenu(Menu.buildFromTemplate(template))
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

  private async initI18Next() {
    const systemLocale = app.getSystemLocale().replace('-', '_')
    const savedLanguage = this.configService.get('general.language')

    if (!savedLanguage) {
      this.configService.set('general.language', systemLocale)
    }

    const fileNames = await readdir(`${this.RESOURCES_PATH}/locales`)

    const files = await Promise.all(
      fileNames.map(fileName =>
        readFile(`${this.RESOURCES_PATH}/locales/${fileName}`, { encoding: 'utf-8' }),
      ),
    )

    const resources = files.reduce((resources, file, index) => {
      const json = jsoncParse(file)
      const locale = fileNames[index].replace('.json', '')

      resources[locale] = {
        translation: json,
      }

      this.languageOptions.push({
        label: json?.label,
        value: locale,
      })

      return resources
    }, {})

    await i18next.init({
      lng: savedLanguage ?? systemLocale,
      fallbackLng: 'ko_KR',
      resources,
    })
  }
}
