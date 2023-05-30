import { BrowserWindow } from 'electron'
import { OverlayController, OVERLAY_WINDOW_OPTS } from 'electron-overlay-window'

import { initializer, singleton } from '@launchtray/tsyringe-async'
import axios from 'axios'

import { IPCHandle } from '@main/core/decorators/ipcHandle'
import { AppModule } from '@main/modules/app/app.module'
import { configStore } from '@main/modules/config/stores/config.store'
import IPCServer from '@main/utils/IPCServer'

import LeagueAPIClient from './leagueAPIClient'

@singleton()
export class LeagueModule {
  server: IPCServer
  client: LeagueAPIClient
  version: string
  isConnected = false

  constructor(private appModule: AppModule) {
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
      this.appModule.window?.webContents.send('league/disconnect')
      this.appModule.window?.webContents.send('league/connect-change', 'disconnect')
    })

    this.client.on('ready', () => {
      // 리그 클라이언트 실행 시 LADA 창 열기
      if (
        configStore.get('general.openWindowWhenLeagueClientLaunch') &&
        !this.appModule.window &&
        this.appModule.isStarted
      ) {
        this.appModule.createWindow()
      }

      const clientOverlayWindow = new BrowserWindow({
        ...OVERLAY_WINDOW_OPTS,
        alwaysOnTop: true,
        hasShadow: false,
        webPreferences: {
          preload: this.appModule.PRELOAD_PATH,
        },
      })

      clientOverlayWindow.loadURL('http://localhost:3000/#/overlays/client')

      OverlayController.attachByTitle(clientOverlayWindow, 'League of Legends')
      OverlayController.activateOverlay()

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
          const { autoAccept = false, autoAcceptDelaySeconds = 0 } = configStore.get('game')

          if (!autoAccept) return

          clientOverlayWindow.show()
          clientOverlayWindow.focus()
          OverlayController.focusTarget()
          clientOverlayWindow.webContents.send('league/auto-accept', {
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
          clientOverlayWindow.webContents.send('league/auto-accept', {
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
