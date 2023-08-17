import { Module } from '@nestjs/common'

import { ConfigModule } from '@main/modules/config/config.module'
import { ElectronModule } from '@main/modules/electron/electron.module'
import { LeagueDataDragonProvider } from '@main/modules/league/league-data-dragon.provider'
import { LeagueController } from '@main/modules/league/league.controller'
import { LeagueService } from '@main/modules/league/league.service'

@Module({
  imports: [ElectronModule, ConfigModule],
  providers: [LeagueController, LeagueService, LeagueDataDragonProvider],
  exports: [LeagueService, LeagueDataDragonProvider],
})
export class LeagueModule {}
