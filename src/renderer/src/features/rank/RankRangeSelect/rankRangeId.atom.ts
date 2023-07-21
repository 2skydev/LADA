import { atomWithStorage } from 'jotai/utils'

import { RANK_RANGE_IDS } from '@main/modules/ps/constants/rank'
import { RankRangeId } from '@main/modules/ps/types/rank'

export const rankRangeIdAtom = atomWithStorage<RankRangeId>('rankRangeId', RANK_RANGE_IDS[0])
