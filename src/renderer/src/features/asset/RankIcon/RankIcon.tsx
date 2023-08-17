import clsx from 'clsx'

import { Tier } from '@main/modules/league/types/rank.types'

import bronzeImage from '@renderer/assets/images/rank/bronze.png'
import challengerImage from '@renderer/assets/images/rank/challenger.png'
import diamondImage from '@renderer/assets/images/rank/diamond.png'
import emeraldImage from '@renderer/assets/images/rank/emerald.png'
import goldImage from '@renderer/assets/images/rank/gold.png'
import grandmasterImage from '@renderer/assets/images/rank/grandmaster.png'
import ironImage from '@renderer/assets/images/rank/iron.png'
import masterImage from '@renderer/assets/images/rank/master.png'
import platinumImage from '@renderer/assets/images/rank/platinum.png'
import silverImage from '@renderer/assets/images/rank/silver.png'
import unrankedImage from '@renderer/assets/images/rank/unranked.png'

import { RankIconStyled } from './styled'

const RANK_IMAGES: Record<Tier, string> = {
  UNRANKED: unrankedImage,
  IRON: ironImage,
  BRONZE: bronzeImage,
  SILVER: silverImage,
  GOLD: goldImage,
  PLATINUM: platinumImage,
  EMERALD: emeraldImage,
  DIAMOND: diamondImage,
  MASTER: masterImage,
  GRANDMASTER: grandmasterImage,
  CHALLENGER: challengerImage,
}

export type Rank = keyof typeof RANK_IMAGES

export interface RankIconProps {
  className?: string
  tier: Tier
}

const RankIcon = ({ className, tier }: RankIconProps) => {
  return (
    <RankIconStyled className={clsx('RankIcon', className)} src={RANK_IMAGES[tier]} alt={tier} />
  )
}

export default RankIcon
