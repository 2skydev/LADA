import { Injectable } from '@nestjs/common'

import { ConfigService } from '@main/modules/config/config.service'
import { LeagueService } from '@main/modules/league/league.service'
import type { GetChampionStatsOptions } from '@main/modules/league/types/champion.types'
import type { LaneId } from '@main/modules/league/types/lane.types'
import { PSService } from '@main/modules/ps/ps.service'
import type { DuoId, GetDuoSynergyListOptions } from '@main/modules/ps/types/duo.types'
import type { RankRangeId } from '@main/modules/ps/types/rank.types'
import { StatsProvider } from '@main/modules/stats-provider-integration/types/provider.types'

@Injectable()
export class StatsProviderIntegrationService {
  // TODO: 현재는 제공자를 변경할 수 없어서 사용하지 않음 (이후에 제공자 변경 기능 추가)
  // @ts-ignore
  private provider: StatsProvider

  constructor(
    readonly configService: ConfigService,
    private readonly psService: PSService,
    private readonly leagueService: LeagueService,
  ) {
    this.provider = configService.get('game.statsProvider')

    configService.onChange('game.statsProvider', provider => {
      this.provider = provider
    })
  }

  // 챔피언 통계
  public async getChampionStats(championId: number, options?: GetChampionStatsOptions) {
    return this.psService.getChampionStats(championId, options)
  }

  // 챔피언 티어 목록
  public async getChampionTierList(laneId: LaneId, rankRangeId: RankRangeId = 2) {
    return this.psService.getChampionTierList(laneId, rankRangeId)
  }

  // 듀오 시너지 목록
  public async getDuoSynergyList(duoId: DuoId, options?: GetDuoSynergyListOptions) {
    return this.psService.getDuoSynergyList(duoId, options)
  }

  // 인게임 정보
  public async getInGameByCurrentSummoner() {
    if (!this.leagueService.client.isInGame) return null

    const summoner = await this.leagueService.getCurrentSummoner()
    if (!summoner) return null

    return this.psService.getInGameByName(summoner.name)
  }

  // 소환사 통계
  public async getSummonerStatsByName(name: string) {
    return this.psService.getSummonerStatsByName(name)
  }

  // 소환사 통계 목록
  public async getSummonerStatsListByNames(names: string[]) {
    return Promise.all(names.map(name => this.psService.getSummonerStatsByName(name)))
  }
}
