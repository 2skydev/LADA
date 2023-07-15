import { atom } from 'jotai'

export interface LeagueAtomValues {
  isReady: boolean
  isInGame: boolean
}

export const LeagueAtom = atom<LeagueAtomValues>({
  isReady: false,
  isInGame: false,
})
