import { app } from 'electron'
import log from 'electron-log'

import { initializer, singleton } from '@launchtray/tsyringe-async'
import AutoLaunch from 'auto-launch'
import { valid, gt } from 'semver'

import { configStore } from '@main/modules/config/stores/config.store'
import { migrationStore } from '@main/modules/migration/stores/migration.store'

@singleton()
export class MigrationModule {
  constructor() {}

  @initializer()
  async migrate() {
    let currentVersion = `v${app.getVersion()}`

    // 개발 모드에서는 가장 최신 버전으로 마이그레이션
    if (!app.isPackaged) {
      const versions = Object.getOwnPropertyNames(this.constructor.prototype).filter(propertyName =>
        valid(propertyName),
      )
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
  }

  async 'v0.0.5'() {
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

  async 'v0.0.11'() {
    configStore.set('game.useCurrentPositionChampionData', true)
  }
}
