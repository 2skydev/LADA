import Store from 'electron-store'

export type MigrationStoreValues = Record<string, boolean>

export const migrationStore = new Store<MigrationStoreValues>({
  name: 'migration',
  accessPropertiesByDotNotation: false,
  defaults: {},
})
