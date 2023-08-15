import { LANE_EN_TO_LANE_ID_MAP } from '@main/modules/league/league.constants'
import { LaneId } from '@main/modules/league/types/lane.types'

export const convertLaneEnToLaneId = (value: string): LaneId | null => {
  return LANE_EN_TO_LANE_ID_MAP[value.toUpperCase()] || null
}
