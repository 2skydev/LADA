import { atom } from 'jotai'

export const appUpdateAtom = atom(
  (async () => {
    return {
      version: await window.electron.getVersion(),
      status: await window.electron.getUpdaterStatus(),
    }
  })(),
  (_, set, value) => {
    set(appUpdateAtom, value)
  },
)
