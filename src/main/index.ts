import 'reflect-metadata'

import { NestFactory } from '@nestjs/core'
import * as Sentry from '@sentry/electron/main'

import { AppModule } from '@main/modules/app/app.module'

if (process.env.NODE_ENV !== 'development') {
  Sentry.init({
    dsn: import.meta.env.MAIN_VITE_SENTRY_DSN,
  })
}

const bootstrap = async () => {
  await NestFactory.createApplicationContext(AppModule)
}

bootstrap()
