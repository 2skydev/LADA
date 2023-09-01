import clsx from 'clsx'

import TierIcon, { HoneyIcon, OpIcon } from '@renderer/features/tier/TierIcon'

import * as Styled from './ChampionProfileSmall.styled'

export interface ChampionProfileSmallProps {
  className?: string
  championId: number
  championNameKr?: string
  tier?: number
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
    <Styled.Root className={clsx('ChampionProfileSmall', className)}>
      <div className="profileImage">
        {tier && <TierIcon tier={tier} />}
        {isHoney && <HoneyIcon />}
        {isOp && <OpIcon />}

        <div className="imageMask">
          <img
            src={`https://cdn.lol.ps/assets/img/champion-portraits/${championId}_60.webp`}
            alt={String(championNameKr || championId)}
          />
        </div>
      </div>

      {championNameKr && <span className="name">{championNameKr}</span>}
    </Styled.Root>
  )
}

export default ChampionProfileSmall
