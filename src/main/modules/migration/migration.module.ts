import { app } from 'electron'
import log from 'electron-log'

import { Module } from '@nestjs/common'
import AutoLaunch from 'auto-launch'
import { gt, valid } from 'semver'

import { configStore } from '@main/modules/config/config.store'
import { migrationStore } from '@main/modules/migration/migration.store'

@Module({})
export class MigrationModule {
  public static async forRootAsync() {
    let currentVersion = `v${app.getVersion()}`

    // 개발 모드에서는 가장 최신 버전으로 마이그레이션
    if (!app.isPackaged) {
      const versions = Object.getOwnPropertyNames(this).filter(propertyName => valid(propertyName))
      const latestVersion = versions.find(version => gt(version, currentVersion))
      currentVersion = latestVersion || currentVersion
    }

    if (!migrationStore.get(currentVersion)) {
      if (this[currentVersion]) {
        await this[currentVersion]()
        log.info(`[Migration Module] Migrated to ${currentVersion}`)
      } else {
        log.info(`[Migration Module] Migration for ${currentVersion} not found`)
      }

      migrationStore.set(currentVersion, true)
    }

    return {
      module: MigrationModule,
    }
  }

  public static async 'v0.0.5'() {
    configStore.set('general.openWindowWhenLeagueClientLaunch', true)

    if (configStore.get('general.autoLaunch')) {
      const ladaAutoLauncher = new AutoLaunch({
        name: 'LADA',
        path: app.getPath('exe'),
        isHidden: true,
      })

      if (await ladaAutoLauncher.isEnabled()) await ladaAutoLauncher.disable()
      await ladaAutoLauncher.enable()
    }
  }

  public static async 'v0.0.11'() {
    configStore.set('game.useCurrentPositionChampionData', true)
  }

  public static async 'v0.0.16'() {
    configStore.set('general.zoom', 1.0)
  }

  public static async 'v0.0.17'() {
    configStore.set('game.statsProvider', 'LOL.PS')
    configStore.set('game.autoRuneSetting', true)
  }

  public static async 'v0.0.18'() {
    configStore.set('game.autoSummonerSpellSetting', true)
    configStore.set('game.flashKey', 'F')
  }

  public static async 'v0.0.19'() {
    configStore.set('general.language', null)
  }
}
