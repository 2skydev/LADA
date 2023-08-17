import 'reflect-metadata'

import { NestFactory } from '@nestjs/core'
import * as Sentry from '@sentry/electron/main'

import { AppModule } from '@main/modules/app/app.module'
import { ElectronService } from '@main/modules/electron/electron.service'
import { UpdateService } from '@main/modules/update/update.service'

if (process.env.NODE_ENV !== 'development') {
  Sentry.init({
    dsn: import.meta.env.MAIN_VITE_SENTRY_DSN,
  })
}

const bootstrap = async () => {
  const app = await NestFactory.createApplicationContext(AppModule)

  const updateService = app.get(UpdateService)
  const electronService = app.get(ElectronService)

  await updateService.autoUpdate()
  await electronService.start()
}

bootstrap()
