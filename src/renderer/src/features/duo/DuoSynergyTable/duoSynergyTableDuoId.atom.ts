import { atom } from 'recoil'

import { DuoId } from '@renderer/features/duo/DuoLaneSelect'

export const duoSynergyTableDuoIdAtom = atom<DuoId>({
  key: 'duoSynergyTableDuoId',
  default: 0,
})
