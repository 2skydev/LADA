import { Lane } from '@renderer/types/league'

export const leagueChampSelectLaneStringToLane = (
  value: 'top' | 'jungle' | 'middle' | 'bottom' | 'utility' | '',
): Lane | null => {
  return (
    {
      top: 'top',
      jungle: 'jg',
      middle: 'mid',
      bottom: 'adc',
      utility: 'sup',
    }[value] || null
  )
}
