import { app } from 'electron'
import log from 'electron-log'

import { initializer, singleton } from '@launchtray/tsyringe-async'
import AutoLaunch from 'auto-launch'
import { valid, gt } from 'semver'

import { ConfigModule } from '@main/modules/config/config.module'
import { migrationStore } from '@main/modules/migration/stores/migration.store'

@singleton()
export class MigrationModule {
  constructor(private configModule: ConfigModule) {}

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
    this.configModule.store.set('general.openWindowWhenLeagueClientLaunch', true)

    if (this.configModule.store.get('general.autoLaunch')) {
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
    this.configModule.store.set('game.useCurrentPositionChampionData', true)
  }

  async 'v0.0.16'() {
    this.configModule.store.set('general.zoom', 1.0)
  }
}
