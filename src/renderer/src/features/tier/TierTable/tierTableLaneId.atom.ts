import { atom } from 'jotai'

import { LANE_IDS } from '@main/modules/league/constants/lane'
import { LaneId } from '@main/modules/league/types/lane'

export const tierTableLaneIdAtom = atom<LaneId>(LANE_IDS[0])
