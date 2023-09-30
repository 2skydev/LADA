import clsx from 'clsx'

import TierIcon, { HoneyIcon, OpIcon } from '@renderer/features/tier/TierIcon'

import * as Styled from './ChampionProfileSmall.styled'

export interface ChampionProfileSmallProps {
  className?: string
  id: number
  image: string
  name?: string
  tier?: number
  isOp?: boolean
  isHoney?: boolean
}

const ChampionProfileSmall = ({
  className,
  id,
  image,
  name,
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
          <img src={image} alt={String(id)} />
        </div>
      </div>

      {name && <span className="name">{name}</span>}
    </Styled.Root>
  )
}

export default ChampionProfileSmall
