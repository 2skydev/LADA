import 'reflect-metadata'

import { app, dialog } from 'electron'
import log from 'electron-log'

import { NestFactory } from '@nestjs/core'
import * as Sentry from '@sentry/electron/main'

import { AppModule } from '@main/modules/app/app.module'
import { ElectronService } from '@main/modules/electron/electron.service'
import { LeagueService } from '@main/modules/league/league.service'
import { UpdateService } from '@main/modules/update/update.service'

if (process.env.NODE_ENV !== 'development') {
  Sentry.init({
    dsn: import.meta.env.MAIN_VITE_SENTRY_DSN,
  })
}

const bootstrap = async () => {
  try {
    const app = await NestFactory.createApplicationContext(AppModule)

    const leagueService = app.get(LeagueService)
    const updateService = app.get(UpdateService)
    const electronService = app.get(ElectronService)

    await leagueService.clientInitialize()
    await updateService.autoUpdate()
    await electronService.start()
  } catch (error: any) {
    log.error('Failed to bootstrap application')
    log.error(error?.message, error)

    await app.whenReady()

    if (error?.message === 'unable to verify the first certificate') {
      dialog.showErrorBox(
        '앱 실행 오류',
        `인증서 오류로 인해 앱을 실행할 수 없습니다.\n네트워크를 변경하는 앱이 실행 중이라면 이 앱은 제외해주세요. (예시: 유니콘 Pro)\n자세한 로그는 ${
          log.transports.file.getFile().path
        }`,
      )
    } else {
      dialog.showErrorBox(
        '앱 실행 오류',
        `${error?.message}\n자세한 로그는 ${log.transports.file.getFile().path}`,
      )
    }

    process.exit(1)
  }
}

bootstrap()
