import { Injectable } from '@nestjs/common'

import { IPCHandle } from '@main/modules/electron/decorators/ipc-handle.decorator'
import { LeagueDataDragonProvider } from '@main/modules/league/league-data-dragon.provider'
import { LeagueService } from '@main/modules/league/league.service'

@Injectable()
export class LeagueController {
  constructor(
    private readonly leagueService: LeagueService,
    private readonly leagueDataDragonProvider: LeagueDataDragonProvider,
  ) {}

  @IPCHandle({ channel: 'league.isReady' })
  public isReady() {
    return this.leagueService.client.isReady()
  }

  @IPCHandle({ channel: 'league.getCurrentSummoner' })
  public async getCurrentSummoner() {
    return this.leagueService.getCurrentSummoner()
  }

  @IPCHandle({ channel: 'league.getLobby' })
  public async getLobby() {
    return this.leagueService.getLobby()
  }

  @IPCHandle({ channel: 'league.getChampionNames' })
  public async getChampionNames() {
    return this.leagueDataDragonProvider.getChampionNames()
  }

  @IPCHandle({ channel: 'league.getRuneData' })
  public async getRuneData() {
    return this.leagueDataDragonProvider.getRuneData()
  }
}
