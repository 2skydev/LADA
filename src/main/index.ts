import 'reflect-metadata'

import { container } from '@launchtray/tsyringe-async'
import * as Sentry from '@sentry/electron/main'

import { AppFactory } from '@main/core/factory'
import { AppModule } from '@main/modules/app/app.module'
import { ConfigModule } from '@main/modules/config/config.module'
import { DeveloperModule } from '@main/modules/developer/developer.module'
import { LeagueModule } from '@main/modules/league/league.module'
import { MigrationModule } from '@main/modules/migration/migration.module'
import { PSModule } from '@main/modules/ps/ps.module'
import { UpdateModule } from '@main/modules/update/update.module'

Sentry.init({
  dsn: import.meta.env.MAIN_VITE_SENTRY_DSN,
})
;(async () => {
  // 마이그레이션이 항상 먼저 실행되도록 처리
  await container.resolve(MigrationModule)

  const appModule = await AppFactory.create(AppModule, [
    ConfigModule,
    UpdateModule,
    DeveloperModule,
    LeagueModule,
    PSModule,
  ])

  const updateModule = await container.resolve(UpdateModule)

  await updateModule.autoUpdate()
  await appModule.start()
})()
