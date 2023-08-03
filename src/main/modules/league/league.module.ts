import { BrowserWindow, app } from 'electron'
import { OverlayController, OVERLAY_WINDOW_OPTS } from 'electron-overlay-window'

import { initializer, singleton } from '@launchtray/tsyringe-async'
import axios from 'axios'

import { IPCHandle } from '@main/core/decorators/ipcHandle'
import { AppModule } from '@main/modules/app/app.module'
import { ConfigModule } from '@main/modules/config/config.module'
import LeagueAPIClient from '@main/modules/league/utils/leagueAPIClient'
import IPCServer from '@main/utils/IPCServer'

@singleton()
export class LeagueModule {
  server: IPCServer
  client: LeagueAPIClient
  version: string
  isConnected = false
  clientOverlayWindow: BrowserWindow | null = null

  constructor(private appModule: AppModule, private configModule: ConfigModule) {
    this.server = new IPCServer('apis/league')
    this.client = new LeagueAPIClient()

    this.server.add('/is-ready', async () => this.client.isReady())

    this.server.add('/summoner/current', async () => {
      const res = await this.client.request({
        method: 'GET',
        url: '/lol-summoner/v1/current-summoner',
      })

      return res.json()
    })

    this.server.add('/lobby', async () => {
      const res = await this.client.request({
        method: 'GET',
        url: '/lol-lobby/v2/lobby',
      })

      return res.json()
    })

    this.client.on('connect', () => {
      this.isConnected = true
      this.appModule.window?.webContents.send('league/connect')
      this.appModule.window?.webContents.send('league/connect-change', 'connect')
    })

    this.client.on('disconnect', () => {
      this.isConnected = false
      this.clientOverlayWindow?.hide()
      this.appModule.window?.webContents.send('league/disconnect')
      this.appModule.window?.webContents.send('league/connect-change', 'disconnect')
    })

    this.client.on('in-game', isInGame => {
      this.appModule.window?.webContents.send('league/in-game', isInGame)
    })

    this.client.on('ready', () => {
      // 리그 클라이언트 실행 시 LADA 창 열기
      if (
        this.configModule.store.get('general.openWindowWhenLeagueClientLaunch') &&
        !this.appModule.window &&
        this.appModule.isStarted
      ) {
        this.appModule.createWindow()
      }

      this.createClientOverlayWindow().then(isInitialCreated => {
        if (!isInitialCreated) return
        OverlayController.attachByTitle(this.clientOverlayWindow!, 'League of Legends')
        OverlayController.activateOverlay()
      })

      this.appModule.window?.webContents.send('league/connect-change', 'connect')

      this.client.subscribe('/lol-champ-select/v1/session', data => {
        this.appModule.window?.webContents.send('league/champ-select/session', data)
      })

      this.client.subscribe('/lol-summoner/v1/current-summoner', data => {
        this.appModule.window?.webContents.send('league/summoner/current', data)
      })

      this.client.subscribe('/lol-lobby/v2/lobby', data => {
        this.appModule.window?.webContents.send('league/lobby', data)
      })

      this.client.subscribe('/lol-matchmaking/v1/ready-check', async data => {
        if (!data) return

        if (data.playerResponse === 'None') {
          const { autoAccept = false, autoAcceptDelaySeconds = 0 } =
            this.configModule.store.get('game')

          if (!autoAccept) return

          this.clientOverlayWindow?.show()
          this.clientOverlayWindow?.focus()
          OverlayController.focusTarget()

          this.clientOverlayWindow?.webContents.send('league/auto-accept', {
            timer: data.timer,
            playerResponse: data.playerResponse,
            autoAcceptDelaySeconds,
          })

          if (data.timer < autoAcceptDelaySeconds) return

          await this.client.request({
            method: 'POST',
            url: '/lol-matchmaking/v1/ready-check/accept',
          })
        } else {
          this.clientOverlayWindow?.webContents.send('league/auto-accept', {
            playerResponse: data.playerResponse,
          })
        }
      })
    })
  }

  @initializer()
  async init() {
    this.isConnected = await this.client.initialize()

    const { data: versions } = await axios.get(
      `https://ddragon.leagueoflegends.com/api/versions.json`,
    )

    this.version = versions[0]
  }

  // 리그 클라이언트 오버레이 창 생성
  async createClientOverlayWindow() {
    if (this.clientOverlayWindow) return false

    this.clientOverlayWindow = new BrowserWindow({
      ...OVERLAY_WINDOW_OPTS,
      alwaysOnTop: true,
      hasShadow: false,
      webPreferences: {
        preload: this.appModule.PRELOAD_PATH,
      },
    })

    if (app.isPackaged) {
      await this.clientOverlayWindow.loadFile(this.appModule.PROD_LOAD_FILE_PATH, {
        hash: '#/overlays/client',
      })
    } else {
      await this.clientOverlayWindow.loadURL(this.appModule.DEV_URL + '#/overlays/client')
    }

    return true
  }

  // 현재 롤 클라이언트가 챔피언 선택 중인지 확인
  async isLeagueChampSelecting() {
    if (!this.isConnected) return false

    const { status } = await this.client.request({
      method: 'GET',
      url: '/lol-champ-select/v1/session',
    })

    return status === 200
  }

  @IPCHandle()
  getLeagueVersion() {
    return this.version
  }
}
