import { Module } from '@nestjs/common'

import { ConfigModule } from '@main/modules/config/config.module'
import { DeveloperModule } from '@main/modules/developer/developer.module'
import { ElectronModule } from '@main/modules/electron/electron.module'
import { LeagueModule } from '@main/modules/league/league.module'
import { MigrationModule } from '@main/modules/migration/migration.module'
import { PSModule } from '@main/modules/ps/ps.module'
import { StatsProviderIntegrationModule } from '@main/modules/stats-provider-integration/stats-provider-integration.module'
import { UpdateModule } from '@main/modules/update/update.module'

@Module({
  imports: [
    ConfigModule,
    MigrationModule.forRootAsync(),
    ElectronModule,
    UpdateModule,
    DeveloperModule,
    LeagueModule,
    PSModule,
    StatsProviderIntegrationModule,
  ],
})
export class AppModule {}
