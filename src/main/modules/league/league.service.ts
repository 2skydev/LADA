import { BrowserWindow, app } from 'electron'
import { OverlayController, OVERLAY_WINDOW_OPTS } from 'electron-overlay-window'

import { Injectable, OnModuleInit } from '@nestjs/common'
import { ModuleRef } from '@nestjs/core'
import { t } from 'i18next'

import { ExecuteLog } from '@main/decorators/execute-log.decorator'
import { ConfigService } from '@main/modules/config/config.service'
import { AppWindow } from '@main/modules/electron/decorators/app-window.decorator'
import { ElectronService } from '@main/modules/electron/electron.service'
import { LeagueDataDragonProvider } from '@main/modules/league/league-data-dragon.provider'
import { LeagueAPIClient } from '@main/modules/league/league.client'
import {
  FLASH_SUMMONER_SPELL_ID,
  LADA_RUNE_PAGE_NAME_PREFIX,
  LEAGUE_CLIENT_OVERLAY_WINDOW_KEY,
} from '@main/modules/league/league.constants'
import { LeagueController } from '@main/modules/league/league.controller'
import { ChampionSelectSession } from '@main/modules/league/types/champion-select-session.types'
import { Lobby } from '@main/modules/league/types/lobby.types'
import { Summoner } from '@main/modules/league/types/summoner.types'
import { convertLaneEnToLaneId } from '@main/modules/league/utils/lane.utils'

/**
 * Description
 *
 * 아래 import는 `LeagueService.statsProviderIntegrationService`의 타입을 위해 필요합니다.
 * 빌드 시 사라지는 코드입니다.
 */
import { StatsProviderIntegrationService } from '@main/modules/stats-provider-integration/stats-provider-integration.service'

@Injectable()
export class LeagueService implements OnModuleInit {
  public readonly client: LeagueAPIClient = new LeagueAPIClient()
  public isConnected = false

  @AppWindow(LEAGUE_CLIENT_OVERLAY_WINDOW_KEY)
  private clientOverlayWindow: BrowserWindow | null = null

  private controller: LeagueController
  private statsProviderIntegrationService: StatsProviderIntegrationService

  private beforeChampionId: number | null = null

  constructor(
    private readonly electronService: ElectronService,
    private readonly configService: ConfigService,
    private readonly leagueDataDragonProvider: LeagueDataDragonProvider,
    private readonly moduleRef: ModuleRef,
  ) {}

  @ExecuteLog()
  async onModuleInit() {
    this.controller = this.moduleRef.get(LeagueController)

    /**
     * Description
     *
     * 아래 동적 import는 의도한 코드입니다.
     * 빌드시 한개의 파일로 번들링이 되는데 이때 TDZ(Temporal Dead Zone)에 걸리는 문제가 있습니다.
     *
     * 이를 해결하기 위해 `electron.vite.config.ts` 파일의 `main.build.rollupOptions.output.preserveModules` 옵션을 사용하여
     * 여러개의 파일로 나누고 nestjs의 forwardRef를 사용하여 순환 참조를 해결할 수 있지만,
     * electron 공식 문서에 따르면 한 개의 파일로 번들링하는 것이 성능상 이점이 있다고 합니다.
     *
     * @see https://www.electronjs.org/docs/latest/tutorial/performance#7-bundle-your-code
     */
    const { StatsProviderIntegrationService } = await import(
      '@main/modules/stats-provider-integration/stats-provider-integration.service'
    )
    this.statsProviderIntegrationService = this.moduleRef.get(StatsProviderIntegrationService, {
      strict: false,
    })

    this.registerEvents()
  }

  @ExecuteLog()
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
  public async isChampionSelecting() {
    if (!this.isConnected) return false

    try {
      const data = await this.client.get('/lol-champ-select/v1/session')
      return Boolean(data && data?.httpStatus !== 404)
    } catch {
      return false
    }
  }

  private async isCanAddRunePage(): Promise<boolean> {
    const data = await this.client.get('/lol-perks/v1/inventory')

    if (!data) return false

    return data.canAddCustomPage as boolean
  }

  private async deleteOldRunePage() {
    const data = (await this.client.get('/lol-perks/v1/pages')) as any[] | null

    if (!data) return

    data.sort((a, b) => a.lastModified - b.lastModified)

    const oldRunePageId = data[0].id

    await this.client.delete(`/lol-perks/v1/pages/${oldRunePageId}`)
  }

  private async getLADARunePageId(): Promise<number | null> {
    const data = (await this.client.get('/lol-perks/v1/pages')) as any[] | null

    if (!data) return null

    return data.find(item => item.name.includes(LADA_RUNE_PAGE_NAME_PREFIX))?.id || null
  }

  private async createNewLADARunePage(runeIds: number[], pageName: string) {
    const { categoryFindMap } = await this.leagueDataDragonProvider.getRuneData()

    const isCanAddRunePage = await this.isCanAddRunePage()
    if (!isCanAddRunePage) await this.deleteOldRunePage()

    await this.client.post('/lol-perks/v1/pages', {
      name: LADA_RUNE_PAGE_NAME_PREFIX + pageName,
      selectedPerkIds: runeIds,
      primaryStyleId: categoryFindMap[runeIds[0]],
      subStyleId: categoryFindMap[runeIds[4]],
    })
  }

  // 현재 로그인된 소환사 가져오기
  public async getCurrentSummoner() {
    const data = await this.client.get('/lol-summoner/v1/current-summoner')
    return this.convertSummonerData(data)
  }

  // 현재 로비 가져오기
  public async getLobby() {
    const data = await this.client.get('/lol-lobby/v2/lobby')
    return await this.convertLobbyData(data)
  }

  // 현재 챔피언 선택 세션 가져오기
  public async getChampionSelectSession() {
    const data = await this.client.get('/lol-champ-select/v1/session')
    return this.convertChampionSelectSessionData(data)
  }

  public async setRunePageByRuneIds(runeIds: number[], pageName: string) {
    const { categoryFindMap } = await this.leagueDataDragonProvider.getRuneData()
    const ladaRunePageId = await this.getLADARunePageId()

    if (ladaRunePageId === null) {
      await this.createNewLADARunePage(runeIds, pageName)
    } else {
      await this.client.put(`/lol-perks/v1/pages/${ladaRunePageId}`, {
        name: LADA_RUNE_PAGE_NAME_PREFIX + pageName,
        selectedPerkIds: runeIds,
        primaryStyleId: categoryFindMap[runeIds[0]],
        subStyleId: categoryFindMap[runeIds[4]],
      })
    }
  }

  public async setSummonerSpell(summonerSpellIds: number[]) {
    const flashIndex = summonerSpellIds.findIndex(x => x === FLASH_SUMMONER_SPELL_ID)

    if (flashIndex !== -1) {
      const flashKey = this.configService.get('game.flashKey')

      summonerSpellIds = [summonerSpellIds[+!flashIndex], FLASH_SUMMONER_SPELL_ID]

      if (flashKey === 'D') {
        summonerSpellIds.reverse()
      }
    }

    await this.client.patch('/lol-champ-select/v1/session/my-selection', {
      spell1Id: summonerSpellIds[0],
      spell2Id: summonerSpellIds[1],
    })
  }

  // 자동 설정 트리거 (설정에서 활성화 시에만 동작)
  public async triggerAutoSetting(championSelectSession: ChampionSelectSession) {
    const { championId, tempChampionId, laneId } = championSelectSession
    const viewChampionId = championId || tempChampionId

    // 선택한 챔피언이 없거나 이전에 선택한 챔피언과 같은 경우 무시
    if (viewChampionId === null) return
    if (this.beforeChampionId === viewChampionId) return

    this.beforeChampionId = viewChampionId

    const useCurrentPositionChampionData = this.configService.get(
      'game.useCurrentPositionChampionData',
    )

    const championStats = await this.statsProviderIntegrationService.getChampionStats(
      viewChampionId,
      {
        laneId: useCurrentPositionChampionData ? laneId ?? undefined : undefined,
      },
    )

    // 룬 자동 설정
    if (this.configService.get('game.autoRuneSetting')) {
      const mainRuneBuild = championStats.runeBuilds[0]
      if (!mainRuneBuild) return

      const laneLabel = t('league.laneId', { returnObjects: true })[championStats.summary.laneId]

      await this.setRunePageByRuneIds(
        [...mainRuneBuild.mainRuneIds, ...mainRuneBuild.subRuneIds, ...mainRuneBuild.shardRuneIds],
        `${laneLabel} ${championStats.champion.name}`,
      )
    }

    // 소환사 주문 자동 설정
    if (this.configService.get('game.autoSummonerSpellSetting')) {
      await this.setSummonerSpell(championStats.summary.spells.map(spell => spell.id))
    }
  }

  private handleCurrentSummoner(data: any) {
    const convertedData = this.convertSummonerData(data)
    this.controller.onChangeCurrentSummoner(convertedData!)
  }

  private async handleLobby(data: any) {
    const convertedData = await this.convertLobbyData(data)
    this.controller.onChangeLobby(convertedData!)
  }

  private async handleChampionSelectSession(data: any) {
    const convertedData = await this.convertChampionSelectSessionData(data)
    if (!convertedData) return

    this.controller.onChangeChampionSelectSession(convertedData!)

    if (!this.electronService.window) {
      this.triggerAutoSetting(convertedData)
    }
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

    const { summonerId, gameName, tagLine, summonerLevel, profileIconId } = data

    return {
      id: summonerId,
      name: gameName + '#' + tagLine,
      level: summonerLevel,
      profileIcon: this.leagueDataDragonProvider.getImageUrl('profileicon', profileIconId),
    }
  }

  private async getSummonerByPuuidCached(puuid: string) {
    const data = await this.client.get(`/lol-summoner/v1/summoners-by-puuid-cached/${puuid}`)

    return this.convertSummonerData(data)
  }

  private async convertLobbyData(data: any): Promise<Lobby | null> {
    if (!data || data?.httpStatus === 404) return null

    const summoners = await Promise.all(
      data.members.map(async (member: any) => {
        const summoner = await this.getSummonerByPuuidCached(member.puuid)

        return {
          id: member.summonerId,
          name: summoner?.name ?? '',
          level: member.summonerLevel,
          profileIcon: this.leagueDataDragonProvider.getImageUrl(
            'profileicon',
            member.summonerIconId,
          ),
          firstLaneId: convertLaneEnToLaneId(member.firstPositionPreference),
          secondLaneId: convertLaneEnToLaneId(member.secondPositionPreference),
        }
      }),
    )

    const spectators = await Promise.all(
      data.gameConfig.customSpectators.map(async (member: any) => {
        const summoner = await this.getSummonerByPuuidCached(member.puuid)

        return {
          id: member.summonerId,
          name: summoner?.name ?? '',
          level: member.summonerLevel,
          profileIcon: this.leagueDataDragonProvider.getImageUrl(
            'profileicon',
            member.summonerIconId,
          ),
        }
      }),
    )

    const teams = (await Promise.all(
      ['customTeam100', 'customTeam200'].map(async teamPropertyKey => {
        return await Promise.all(
          data.gameConfig[teamPropertyKey].map(async (member: any) => {
            const summoner = await this.getSummonerByPuuidCached(member.puuid)

            return {
              id: member.summonerId,
              name: summoner?.name ?? '',
              level: member.summonerLevel,
              profileIcon: this.leagueDataDragonProvider.getImageUrl(
                'profileicon',
                member.summonerIconId,
              ),
            }
          }),
        )
      }),
    )) as Lobby['teams']

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

    if (!currentSummonerData) return null

    const {
      assignedPosition: laneEn = null,
      championId = null,
      championPickIntent: tempChampionId = null,
    } = currentSummonerData

    return {
      gameId: data.gameId,
      laneId: convertLaneEnToLaneId(laneEn),
      championId: championId || null,
      tempChampionId: tempChampionId || null,
    }
  }
}
