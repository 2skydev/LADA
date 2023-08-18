import { BrowserWindow, app } from 'electron'
import { OverlayController, OVERLAY_WINDOW_OPTS } from 'electron-overlay-window'

import { Injectable, OnModuleInit } from '@nestjs/common'
import { ModuleRef } from '@nestjs/core'

import { ExecuteLog } from '@main/decorators/execute-log.decorator'
import { ConfigService } from '@main/modules/config/config.service'
import { AppWindow } from '@main/modules/electron/decorators/app-window.decorator'
import { ElectronService } from '@main/modules/electron/electron.service'
import { LeagueDataDragonProvider } from '@main/modules/league/league-data-dragon.provider'
import { LeagueAPIClient } from '@main/modules/league/league.client'
import { LEAGUE_CLIENT_OVERLAY_WINDOW_KEY } from '@main/modules/league/league.constants'
import { LeagueController } from '@main/modules/league/league.controller'
import { ChampionSelectSession } from '@main/modules/league/types/champion-select-session.types'
import { Lobby } from '@main/modules/league/types/lobby.types'
import { Summoner } from '@main/modules/league/types/summoner.types'
import { convertLaneEnToLaneId } from '@main/modules/league/utils/lane.utils'

@Injectable()
export class LeagueService implements OnModuleInit {
  public readonly client: LeagueAPIClient = new LeagueAPIClient()
  public isConnected = false

  @AppWindow(LEAGUE_CLIENT_OVERLAY_WINDOW_KEY)
  private clientOverlayWindow: BrowserWindow | null = null

  private controller: LeagueController

  constructor(
    private readonly electronService: ElectronService,
    private readonly configService: ConfigService,
    private readonly leagueDataDragonProvider: LeagueDataDragonProvider,
    private readonly moduleRef: ModuleRef,
  ) {}

  @ExecuteLog()
  async onModuleInit() {
    this.controller = this.moduleRef.get(LeagueController)
    this.registerEvents()
  }

  public async clientInitialize() {
    this.isConnected = await this.client.initialize()
  }

  registerEvents() {
    this.client.on('connect', () => {
      this.isConnected = true
      this.controller.onChangeLeagueClientConnection('connect')
    })

    this.client.on('disconnect', () => {
      this.isConnected = false
      this.clientOverlayWindow?.hide()
      this.controller.onChangeLeagueClientConnection('disconnect')
    })

    this.client.on('in-game', isInGame => {
      this.controller.onChangeIsInGame(isInGame)
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

      this.controller.onChangeLeagueClientConnection('connect')

      this.client.subscribe(
        '/lol-summoner/v1/current-summoner',
        this.handleCurrentSummoner.bind(this),
      )
      this.client.subscribe('/lol-lobby/v2/lobby', this.handleLobby.bind(this))
      this.client.subscribe(
        '/lol-champ-select/v1/session',
        this.handleChampionSelectSession.bind(this),
      )
      this.client.subscribe('/lol-matchmaking/v1/ready-check', this.handleAutoAccept.bind(this))
    })
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

  // 현재 롤 클라이언트가 챔피언 선택 중인지 확인
  public async isLeagueChampSelecting() {
    if (!this.isConnected) return false

    const data = await this.client.get('/lol-champ-select/v1/session')

    return data !== null
  }

  // 현재 로그인된 소환사 가져오기
  public async getCurrentSummoner() {
    const data = await this.client.get('/lol-summoner/v1/current-summoner')
    return this.convertSummonerData(data)
  }

  // 현재 로비 가져오기
  public async getLobby() {
    const data = await this.client.get('/lol-lobby/v2/lobby')
    return this.convertLobbyData(data)
  }

  // 현재 챔피언 선택 세션 가져오기
  public async getChampionSelectSession() {
    const data = await this.client.get('/lol-champ-select/v1/session')
    return this.convertChampionSelectSessionData(data)
  }

  private async handleCurrentSummoner(data: any) {
    const convertedData = await this.convertSummonerData(data)
    this.controller.onChangeCurrentSummoner(convertedData!)
  }

  private async handleLobby(data: any) {
    const convertedData = await this.convertLobbyData(data)
    this.controller.onChangeLobby(convertedData!)
  }

  private async handleChampionSelectSession(data: any) {
    const convertedData = await this.convertChampionSelectSessionData(data)
    this.controller.onChangeChampionSelectSession(convertedData!)
  }

  private async handleAutoAccept(data: any) {
    if (!data) return

    if (data.playerResponse === 'None') {
      const { autoAccept = false, autoAcceptDelaySeconds = 0 } = this.configService.get('game')

      if (!autoAccept) return

      this.clientOverlayWindow?.show()
      this.clientOverlayWindow?.focus()
      OverlayController.focusTarget()

      this.controller.onAutoAccept({
        timer: data.timer,
        autoAcceptDelaySeconds,
        playerResponse: data.playerResponse,
      })

      if (data.timer < autoAcceptDelaySeconds) return

      await this.client.post('/lol-matchmaking/v1/ready-check/accept')
    } else {
      this.controller.onAutoAccept({
        playerResponse: data.playerResponse,
      })
    }
  }

  private convertSummonerData(data: any): Summoner | null {
    if (!data || data?.httpStatus === 404) return null

    const { summonerId, displayName, summonerLevel, profileIconId } = data

    return {
      id: summonerId,
      name: displayName,
      level: summonerLevel,
      profileIcon: this.leagueDataDragonProvider.getImageUrl('profileicon', profileIconId),
    }
  }

  private convertLobbyData(data: any): Lobby | null {
    if (!data || data?.httpStatus === 404) return null

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

  private async convertChampionSelectSessionData(data: any): Promise<ChampionSelectSession | null> {
    if (!data || data?.httpStatus === 404) return null

    const summoner = (await this.getCurrentSummoner())!

    const currentSummonerData = data.myTeam.find(player => player.summonerId === summoner.id)

    const {
      assignedPosition: laneEn = null,
      championId = null,
      championPickIntent: tempChampionId = null,
    } = currentSummonerData

    return {
      gameId: data.gameId,
      laneId: convertLaneEnToLaneId(laneEn),
      championId,
      tempChampionId,
    }
  }
}
