import { LANE_IDS } from '@main/modules/league/constants/lane'

export type LaneId = (typeof LANE_IDS)[number]

export enum LANE_ID_ENUM {
  top = 0,
  jg = 1,
  mid = 2,
  adc = 3,
  sup = 4,
}
