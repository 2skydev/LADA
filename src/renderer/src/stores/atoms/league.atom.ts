import { atom } from 'jotai'

export interface LeagueAtomValues {
  isReady: boolean
  isInGame: boolean
}

export const leagueAtom = atom(
  (async () => {
    return {
      isReady: await window.electron.isReady(),
      isInGame: await window.electron.isInGame(),
    }
  })(),
  (_, set, value: LeagueAtomValues) => {
    set(leagueAtom, value)
  },
)
