import { atom } from 'jotai'

export interface LeagueAtomValues {
  isReady: boolean
  isInGame: boolean
}

export const leagueAtom = atom<LeagueAtomValues>({
  isReady: false,
  isInGame: false,
})
