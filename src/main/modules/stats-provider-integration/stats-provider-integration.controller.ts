import { Injectable } from '@nestjs/common'

import { IPCHandle } from '@main/modules/electron/decorators/ipc-handle.decorator'
import { StatsProviderIntegrationService } from '@main/modules/stats-provider-integration/stats-provider-integration.service'

@Injectable()
export class StatsProviderIntegrationController {
  constructor(private readonly statsProviderIntegrationService: StatsProviderIntegrationService) {}

  @IPCHandle({ channel: 'integration.getChampionStats' })
  public async getChampionStats(
    ...args: Parameters<typeof this.statsProviderIntegrationService.getChampionStats>
  ) {
    return this.statsProviderIntegrationService.getChampionStats(...args)
  }

  @IPCHandle({ channel: 'integration.getChampionTierList' })
  async getChampionTierList(
    ...args: Parameters<typeof this.statsProviderIntegrationService.getChampionTierList>
  ) {
    return this.statsProviderIntegrationService.getChampionTierList(...args)
  }

  @IPCHandle({ channel: 'integration.getDuoSynergyList' })
  async getDuoSynergyList(
    ...args: Parameters<typeof this.statsProviderIntegrationService.getDuoSynergyList>
  ) {
    return this.statsProviderIntegrationService.getDuoSynergyList(...args)
  }

  @IPCHandle({ channel: 'integration.getInGame' })
  async getInGame(...args: Parameters<typeof this.statsProviderIntegrationService.getInGame>) {
    return this.statsProviderIntegrationService.getInGame(...args)
  }

  @IPCHandle({ channel: 'integration.getSummonerStatsByName' })
  async getSummonerStatsByName(
    ...args: Parameters<typeof this.statsProviderIntegrationService.getSummonerStatsByName>
  ) {
    return this.statsProviderIntegrationService.getSummonerStatsByName(...args)
  }

  @IPCHandle({ channel: 'integration.getSummonerStatsListByNames' })
  async getSummonerStatsListByNames(names: string[]) {
    return Promise.all(
      names.map(name => this.statsProviderIntegrationService.getSummonerStatsByName(name)),
    )
  }
}
