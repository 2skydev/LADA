import { atom } from 'jotai'

import { LANE_IDS } from '@main/modules/league/league.constants'
import { LaneId } from '@main/modules/league/types/lane.types'

export const tierTableLaneIdAtom = atom<LaneId>(LANE_IDS[0])
