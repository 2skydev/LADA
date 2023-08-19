import { Module } from '@nestjs/common'

import { ConfigModule } from '@main/modules/config/config.module'
import { LeagueModule } from '@main/modules/league/league.module'
import { PSModule } from '@main/modules/ps/ps.module'
import { StatsProviderIntegrationController } from '@main/modules/stats-provider-integration/stats-provider-integration.controller'
import { StatsProviderIntegrationService } from '@main/modules/stats-provider-integration/stats-provider-integration.service'

@Module({
  imports: [LeagueModule, PSModule, ConfigModule],
  providers: [StatsProviderIntegrationController, StatsProviderIntegrationService],
  exports: [StatsProviderIntegrationService],
})
export class StatsProviderIntegrationModule {}
