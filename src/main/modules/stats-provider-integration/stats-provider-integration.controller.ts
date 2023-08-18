import { Injectable } from '@nestjs/common'

import { IPCHandle } from '@main/modules/electron/decorators/ipc-handle.decorator'
import { StatsProviderIntegrationService } from '@main/modules/stats-provider-integration/stats-provider-integration.service'

@Injectable()
export class StatsProviderIntegrationController {
  constructor(private readonly statsProviderIntegrationService: StatsProviderIntegrationService) {}

  @IPCHandle()
  public async getChampionStats(
    ...args: Parameters<typeof this.statsProviderIntegrationService.getChampionStats>
  ) {
    return this.statsProviderIntegrationService.getChampionStats(...args)
  }

  @IPCHandle()
  async getChampionTierList(
    ...args: Parameters<typeof this.statsProviderIntegrationService.getChampionTierList>
  ) {
    return this.statsProviderIntegrationService.getChampionTierList(...args)
  }

  @IPCHandle()
  async getDuoSynergyList(
    ...args: Parameters<typeof this.statsProviderIntegrationService.getDuoSynergyList>
  ) {
    return this.statsProviderIntegrationService.getDuoSynergyList(...args)
  }

  @IPCHandle()
  async getInGame(...args: Parameters<typeof this.statsProviderIntegrationService.getInGame>) {
    return this.statsProviderIntegrationService.getInGame(...args)
  }

  @IPCHandle()
  async getSummonerStatsByName(
    ...args: Parameters<typeof this.statsProviderIntegrationService.getSummonerStatsByName>
  ) {
    return this.statsProviderIntegrationService.getSummonerStatsByName(...args)
  }

  @IPCHandle()
  async getSummonerStatsListByNames(names: string[]) {
    return Promise.all(
      names.map(name => this.statsProviderIntegrationService.getSummonerStatsByName(name)),
    )
  }
}
