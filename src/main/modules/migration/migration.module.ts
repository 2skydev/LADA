import { app } from 'electron'
import log from 'electron-log'

import { Module } from '@nestjs/common'
import AutoLaunch from 'auto-launch'
import { omit } from 'lodash'
import { lte, valid } from 'semver'

import { configStore } from '@main/modules/config/config.store'
import { migrationStore } from '@main/modules/migration/migration.store'

@Module({})
export class MigrationModule {
  public static async forRootAsync() {
    const currentVersion = `v${app.getVersion()}`
    const initialInstallationVersion = migrationStore.get('initialInstallationVersion')
    const isInitialInstallation =
      !initialInstallationVersion &&
      !Object.keys(omit(migrationStore.store, ['migratedVersions', 'initialInstallationVersion']))
        .length

    let migratedVersions = migrationStore.get('migratedVersions')
    let executedMigrationVersions = migrationStore.get('executedMigrationVersions')

    // 마이그레이션 스토어가 비어있는 경우
    if (!migratedVersions || !executedMigrationVersions) {
      migratedVersions = []
      executedMigrationVersions = []

      migrationStore.store = {
        initialInstallationVersion: currentVersion,
        migratedVersions,
        executedMigrationVersions,
      }
    }

    // 선언된 모든 마이그레이션 불러오기
    const migrationVersions = Object.getOwnPropertyNames(this).filter(propertyName =>
      valid(propertyName),
    )

    if (isInitialInstallation) {
      // 초기 설치라면 현재 모든 마이그레이션을 실행할 필요가 없으므로 실행된 것으로 간주
      migrationStore.set('migratedVersions', migrationVersions)
    } else {
      // 초기 설치가 아니라면 마이그레이션 실행
      const executableMigrationVersions = migrationVersions.filter(version => {
        const isExecutable = !migratedVersions!.includes(version)

        // 개발 모드라면 버전 비교 없이 실행
        if (!app.isPackaged) return isExecutable

        // 프로덕션 모드라면 하위 및 같은 버전만 실행
        return isExecutable && lte(version, currentVersion)
      })

      // 실행 가능한 마이그레이션이 있다면 실행
      if (executableMigrationVersions.length) {
        for (const version of executableMigrationVersions) {
          try {
            await this[version]()
            log.info(`[Migration Module] Migrated to ${currentVersion}`)
          } catch (error) {
            log.error(`[Migration Module] ${currentVersion}\n`, error)
          }
        }

        migratedVersions.push(...executableMigrationVersions)
        executedMigrationVersions.push(...executableMigrationVersions)
        migrationStore.set('migratedVersions', migratedVersions)
        migrationStore.set('executedMigrationVersions', executedMigrationVersions)
      }
    }

    return {
      module: MigrationModule,
    }
  }

  public static async 'v0.0.5'() {
    if (configStore.get('general.openWindowWhenLeagueClientLaunch') === undefined) {
      configStore.set('general.openWindowWhenLeagueClientLaunch', true)
    }

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
    if (configStore.get('game.useCurrentPositionChampionData') === undefined) {
      configStore.set('game.useCurrentPositionChampionData', true)
    }
  }

  public static async 'v0.0.16'() {
    if (configStore.get('general.zoom') === undefined) {
      configStore.set('general.zoom', 1.0)
    }
  }

  public static async 'v0.0.17'() {
    if (configStore.get('game.statsProvider') === undefined) {
      configStore.set('game.statsProvider', 'LOL.PS')
    }

    if (configStore.get('game.autoRuneSetting') === undefined) {
      configStore.set('game.autoRuneSetting', true)
    }
  }

  public static async 'v0.0.18'() {
    if (configStore.get('game.autoSummonerSpellSetting') === undefined) {
      configStore.set('game.autoSummonerSpellSetting', true)
    }

    if (configStore.get('game.flashKey') === undefined) {
      configStore.set('game.flashKey', 'F')
    }
  }

  public static async 'v0.0.19'() {
    if (configStore.get('general.language') === undefined) {
      configStore.set('general.language', null)
    }
  }

  public static async 'v0.0.22'() {
    const language = configStore.get('general.language') as string | undefined | null

    if (language && !['en_US', 'ko_KR'].includes(language)) {
      configStore.set('general.language', null)
    }
  }
}
