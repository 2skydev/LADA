import { atom } from 'recoil'

import { RANK_RANGE_IDS } from '@main/modules/ps/constants/rank'
import { RankRangeId } from '@main/modules/ps/types/rank'

import { localStorageEffect } from '@renderer/utils/recoil'

export const rankRangeIdAtom = atom<RankRangeId>({
  key: 'rankRangeId',
  default: RANK_RANGE_IDS[0],
  effects: [localStorageEffect('rankRangeId')],
})
