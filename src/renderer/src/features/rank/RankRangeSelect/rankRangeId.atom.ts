import { atomWithStorage } from 'jotai/utils'

import { RANK_RANGE_IDS } from '@main/modules/ps/ps.constants'
import { RankRangeId } from '@main/modules/ps/types/rank.types'

export const rankRangeIdAtom = atomWithStorage<RankRangeId>('rankRangeId', RANK_RANGE_IDS[0])
