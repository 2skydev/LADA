import clsx from 'clsx'

import TierIcon, { HoneyIcon, OpIcon } from '../TierIcon'
import { ChampionProfileSmallStyled } from './styled'

export interface ChampionProfileSmallProps {
  className?: string
  championId: number
  championNameKr: string
  tier: number
  isOp?: boolean
  isHoney?: boolean
}

const ChampionProfileSmall = ({
  className,
  championId,
  championNameKr,
  tier,
  isOp,
  isHoney,
}: ChampionProfileSmallProps) => {
  return (
    <ChampionProfileSmallStyled className={clsx('ChampionProfileSmall', className)}>
      <div className="profileImage">
        <TierIcon tier={tier} />
        {isHoney && <HoneyIcon />}
        {isOp && <OpIcon />}

        <div className="imageMask">
          <img
            src={`https://cdn.lol.ps/assets/img/champion-portraits/${championId}_60.webp`}
            alt={championNameKr}
          />
        </div>
      </div>

      <span className="name">{championNameKr}</span>
    </ChampionProfileSmallStyled>
  )
}

export default ChampionProfileSmall
