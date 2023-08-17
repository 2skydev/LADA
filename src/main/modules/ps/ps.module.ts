import { Module } from '@nestjs/common'

import { LeagueModule } from '@main/modules/league/league.module'
import { PSService } from '@main/modules/ps/ps.service'

@Module({
  imports: [LeagueModule],
  providers: [PSService],
  exports: [PSService],
})
export class PSModule {}
