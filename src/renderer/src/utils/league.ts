import { Lane } from '@renderer/types/league'

export const leagueChampSelectLaneStringToLane = (
  value: 'top' | 'jungle' | 'mid' | 'bottom' | 'utility' | '',
): Lane | null => {
  return (
    {
      top: 'top',
      jungle: 'jg',
      mid: 'mid',
      bottom: 'adc',
      utility: 'sup',
    }[value] || null
  )
}
