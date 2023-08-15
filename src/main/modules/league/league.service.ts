import { BrowserWindow, app } from 'electron'
import { OverlayController, OVERLAY_WINDOW_OPTS } from 'electron-overlay-window'

import { Injectable, OnModuleInit } from '@nestjs/common'

import { ExecuteLog } from '@main/decorators/execute-log.decorator'
import { ConfigService } from '@main/modules/config/config.service'
import { ElectronService } from '@main/modules/electron/electron.service'
import { LeagueDataDragonProvider } from '@main/modules/league/league-data-dragon.provider'
import { LeagueAPIClient } from '@main/modules/league/league.client'
import { Lobby } from '@main/modules/league/types/lobby.types'
import { Summoner } from '@main/modules/league/types/summoner.types'
import { convertLaneEnToLaneId } from '@main/modules/league/utils/lane.utils'

@Injectable()
export class LeagueService implements OnModuleInit {
  public readonly client: LeagueAPIClient
  public isConnected = false

  private clientOverlayWindow: BrowserWindow | null = null

  constructor(
    private readonly electronService: ElectronService,
    private readonly configService: ConfigService,
    private readonly leagueDataDragonProvider: LeagueDataDragonProvider,
  ) {
    this.client = new LeagueAPIClient()

    this.client.on('connect', () => {
      this.isConnected = true
      this.electronService.window?.webContents.send('league/connect')
      this.electronService.window?.webContents.send('league/connect-change', 'connect')
    })

    this.client.on('disconnect', () => {
      this.isConnected = false
      this.clientOverlayWindow?.hide()
      this.electronService.window?.webContents.send('league/disconnect')
      this.electronService.window?.webContents.send('league/connect-change', 'disconnect')
    })

    this.client.on('in-game', isInGame => {
      this.electronService.window?.webContents.send('league/in-game', isInGame)
    })

    this.client.on('ready', () => {
      // 리그 클라이언트 실행 시 LADA 창 열기
      if (
        this.configService.get('general.openWindowWhenLeagueClientLaunch') &&
        !this.electronService.window &&
        this.electronService.isStarted
      ) {
        this.electronService.createWindow()
      }

      this.createClientOverlayWindow().then(isInitialCreated => {
        if (!isInitialCreated) return
        OverlayController.attachByTitle(this.clientOverlayWindow!, 'League of Legends')
        OverlayController.activateOverlay()
      })

      this.electronService.window?.webContents.send('league/connect-change', 'connect')

      this.client.subscribe('/lol-champ-select/v1/session', data => {
        this.electronService.window?.webContents.send('league/champ-select/session', data)
      })

      this.client.subscribe('/lol-summoner/v1/current-summoner', data => {
        this.electronService.window?.webContents.send('league/summoner/current', data)
      })

      this.client.subscribe('/lol-lobby/v2/lobby', data => {
        this.electronService.window?.webContents.send('league/lobby', data)
      })

      this.client.subscribe('/lol-matchmaking/v1/ready-check', async data => {
        if (!data) return

        if (data.playerResponse === 'None') {
          const { autoAccept = false, autoAcceptDelaySeconds = 0 } = this.configService.get('game')

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

  @ExecuteLog()
  async onModuleInit() {
    this.isConnected = await this.client.initialize()
  }

  // 현재 롤 클라이언트가 챔피언 선택 중인지 확인
  public async isLeagueChampSelecting() {
    if (!this.isConnected) return false

    const { status } = await this.client.request({
      method: 'GET',
      url: '/lol-champ-select/v1/session',
    })

    return status === 200
  }

  // 리그 클라이언트 오버레이 창 생성
  private async createClientOverlayWindow() {
    if (this.clientOverlayWindow) return false

    this.clientOverlayWindow = new BrowserWindow({
      ...OVERLAY_WINDOW_OPTS,
      alwaysOnTop: true,
      hasShadow: false,
      thickFrame: false,
      webPreferences: {
        preload: this.electronService.PRELOAD_PATH,
      },
    })

    if (app.isPackaged) {
      await this.clientOverlayWindow.loadFile(this.electronService.PROD_LOAD_FILE_PATH, {
        hash: '#/overlays/client',
      })
    } else {
      await this.clientOverlayWindow.loadURL(this.electronService.DEV_URL + '#/overlays/client')
    }

    return true
  }

  public async getCurrentSummoner(): Promise<Summoner> {
    const res = await this.client.request({
      method: 'GET',
      url: '/lol-summoner/v1/current-summoner',
    })

    const { summonerId, displayName, summonerLevel, profileIconId } = res.json() as any

    return {
      id: summonerId,
      name: displayName,
      level: summonerLevel,
      profileIcon: this.leagueDataDragonProvider.getImageUrl('profileicon', profileIconId),
    }
  }

  public async getLobby(): Promise<Lobby> {
    console.log('getLobby', Date.now())

    const res = await this.client.request({
      method: 'GET',
      url: '/lol-lobby/v2/lobby',
    })

    const data = res.json() as any

    const summoners = data.members.map((member: any) => {
      return {
        id: member.summonerId,
        name: member.summonerInternalName,
        level: member.summonerLevel,
        profileIcon: this.leagueDataDragonProvider.getImageUrl(
          'profileicon',
          member.summonerIconId,
        ),
        firstLaneId: convertLaneEnToLaneId(member.firstPositionPreference),
        secondLaneId: convertLaneEnToLaneId(member.secondPositionPreference),
      }
    })

    const spectators = data.gameConfig.customSpectators.map((member: any) => {
      return {
        id: member.summonerId,
        name: member.summonerInternalName,
        level: member.summonerLevel,
        profileIcon: this.leagueDataDragonProvider.getImageUrl(
          'profileicon',
          member.summonerIconId,
        ),
      }
    })

    const teams = ['customTeam100', 'customTeam200'].map(teamPropertyKey => {
      return data.gameConfig[teamPropertyKey].map((member: any) => {
        return {
          id: member.summonerId,
          name: member.summonerInternalName,
          level: member.summonerLevel,
          profileIcon: this.leagueDataDragonProvider.getImageUrl(
            'profileicon',
            member.summonerIconId,
          ),
        }
      })
    }) as Lobby['teams']

    return {
      title: data.gameConfig.customLobbyName,
      gameMode: data.gameConfig.gameMode,
      pickType: data.gameConfig.pickType || null,
      isCustom: data.gameConfig.isCustom,
      summoners,
      spectators,
      teams,
    }
  }
}
