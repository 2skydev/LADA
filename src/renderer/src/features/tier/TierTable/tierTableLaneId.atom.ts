import { atom } from 'recoil'

import { LANE_IDS } from '@main/modules/league/constants/lane'
import { LaneId } from '@main/modules/league/types/lane'

export const tierTableLaneIdAtom = atom<LaneId>({
  key: 'tierTableLaneId',
  default: LANE_IDS[0],
})
