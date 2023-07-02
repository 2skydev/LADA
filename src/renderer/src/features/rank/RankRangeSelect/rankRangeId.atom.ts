import { atom } from 'recoil'

import { RANK_RANGE_IDS } from '@main/modules/ps/constants/rank'
import { RankRangeId } from '@main/modules/ps/types/rank'

export const rankRangeIdAtom = atom<RankRangeId>({
  key: 'rankRangeId',
  default: RANK_RANGE_IDS[0],
})
