import { TIERS } from '@main/modules/league/constants/rank'
import { Division, Rank } from '@main/modules/league/types/rank'

export const getAvgTier = (ranks: Rank[]): Rank => {
  let sum = 0
  let lpSum = 0

  ranks.forEach(rank => {
    let score = TIERS.indexOf(rank.tier) * 4
    score += rank.division ? Math.abs(rank.division - 4) : 0
    sum += score
    lpSum += rank.lp
  })

  const avgScore = Math.round(sum / ranks.length)

  const tierIndex = Math.floor(avgScore / 4)
  const division = Math.abs((avgScore % 4) - 4)
  const lp = Math.round(lpSum / ranks.length)

  return {
    tier: TIERS[tierIndex],
    division: division as Division,
    lp,
  }
}
