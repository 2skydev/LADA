import { Injectable } from '@nestjs/common'

import { IPCHandle } from '@main/modules/electron/decorators/ipc-handle.decorator'
import { IPCSender } from '@main/modules/electron/decorators/ipc-sender.decorator'
import { ELECTRON_MAIN_WINDOW_KEY } from '@main/modules/electron/electron.constants'
import { LeagueDataDragonProvider } from '@main/modules/league/league-data-dragon.provider'
import { LEAGUE_CLIENT_OVERLAY_WINDOW_KEY } from '@main/modules/league/league.constants'
import { LeagueService } from '@main/modules/league/league.service'
import type { AutoAcceptEvent } from '@main/modules/league/types/auto-accept.types'
import type { ChampionSelectSession } from '@main/modules/league/types/champion-select-session.types'
import type { Lobby } from '@main/modules/league/types/lobby.types'
import type { Summoner } from '@main/modules/league/types/summoner.types'

@Injectable()
export class LeagueController {
  constructor(
    private readonly leagueService: LeagueService,
    private readonly leagueDataDragonProvider: LeagueDataDragonProvider,
  ) {}

  @IPCHandle()
  public isReady() {
    return this.leagueService.client.isReady()
  }

  @IPCHandle()
  public isInGame() {
    return this.leagueService.client.isInGame
  }

  @IPCHandle()
  public async getChampionNames() {
    return this.leagueDataDragonProvider.getChampionNames()
  }

  @IPCHandle()
  public async getRuneData() {
    return this.leagueDataDragonProvider.getRuneData()
  }

  @IPCHandle()
  public async getCurrentSummoner() {
    return this.leagueService.getCurrentSummoner()
  }

  @IPCHandle()
  public async getLobby() {
    return this.leagueService.getLobby()
  }

  @IPCHandle()
  public async getChampionSelectSession() {
    return this.leagueService.getChampionSelectSession()
  }

  @IPCHandle()
  public async setRunePageByRuneIds(...args: Parameters<LeagueService['setRunePageByRuneIds']>) {
    return this.leagueService.setRunePageByRuneIds(...args)
  }

  @IPCSender({
    windowKeys: [ELECTRON_MAIN_WINDOW_KEY, LEAGUE_CLIENT_OVERLAY_WINDOW_KEY],
  })
  public onChangeLeagueClientConnection(value: 'connect' | 'disconnect') {
    return value
  }

  @IPCSender({
    windowKeys: [ELECTRON_MAIN_WINDOW_KEY],
  })
  public onChangeIsInGame(value: boolean) {
    return value
  }

  @IPCSender({
    windowKeys: [LEAGUE_CLIENT_OVERLAY_WINDOW_KEY],
  })
  public onAutoAccept(value: AutoAcceptEvent) {
    return value
  }

  @IPCSender({
    windowKeys: [ELECTRON_MAIN_WINDOW_KEY],
  })
  public onChangeChampionSelectSession(value: ChampionSelectSession) {
    return value
  }

  @IPCSender({
    windowKeys: [ELECTRON_MAIN_WINDOW_KEY],
  })
  public onChangeCurrentSummoner(value: Summoner) {
    return value
  }

  @IPCSender({
    windowKeys: [ELECTRON_MAIN_WINDOW_KEY],
  })
  public onChangeLobby(value: Lobby) {
    return value
  }
}
