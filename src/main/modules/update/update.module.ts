import { Module } from '@nestjs/common'

import { ElectronModule } from '@main/modules/electron/electron.module'
import { LeagueModule } from '@main/modules/league/league.module'
import { UpdateController } from '@main/modules/update/update.controller'
import { UpdateService } from '@main/modules/update/update.service'

@Module({
  imports: [ElectronModule, LeagueModule],
  providers: [UpdateController, UpdateService],
  exports: [UpdateService],
})
export class UpdateModule {}
