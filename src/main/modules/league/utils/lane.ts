import { LaneId } from '@main/modules/league/types/lane'

export const leagueChampSelectLaneStringToLaneId = (
  value: 'top' | 'jungle' | 'middle' | 'bottom' | 'utility' | '',
): LaneId | null => {
  return (
    {
      top: 0,
      jungle: 1,
      middle: 2,
      bottom: 3,
      utility: 4,
    }[value] || null
  )
}
