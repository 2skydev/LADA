import Store from 'electron-store'

export type UpdateEvent =
  | 'checking-for-update'
  | 'update-available'
  | 'update-not-available'
  | 'error'
  | 'download-progress'
  | 'update-downloaded'

export interface UpdateStatus {
  event: UpdateEvent
  data: any
  time: number
}

export interface UpdateStoreValues {
  status: UpdateStatus
}

export const updateStore = new Store<UpdateStoreValues>({
  name: 'update',
  accessPropertiesByDotNotation: false,
  defaults: {
    status: {
      event: 'checking-for-update',
      data: null,
      time: new Date().getTime(),
    },
  },
})
