import { ReactNode } from 'react'

import clsx from 'clsx'

import RuneIcon from '@renderer/features/rune/RuneIcon/RuneIcon'
import useRuneData from '@renderer/hooks/useRuneData'

import { RuneGroupStyled } from './styled'

export interface RuneGroupProps {
  className?: string
  children?: ReactNode
  type: 'main' | 'sub' | 'shard'
  activeRuneIds: number[]
}

const RuneGroup = ({ className, type, activeRuneIds }: RuneGroupProps) => {
  const data = useRuneData()
  if (!data) return null

  const categoryData = data.categories[data.categoryFindMap[activeRuneIds[0]]]

  return (
    <RuneGroupStyled
      className={clsx('RuneGroup', type, className)}
      data-category={categoryData.key}
    >
      {categoryData.slots.slice(type === 'sub' ? 1 : 0).map((runes, i) => (
        <div className="slot" key={i}>
          {runes.map(rune => (
            <RuneIcon
              key={`${i}.${rune.id}`}
              runeId={rune.id}
              size={type === 'shard' ? '28px' : '38px'}
              largeImage={type === 'main' && !i}
              active={
                type === 'sub' ? activeRuneIds.includes(rune.id) : activeRuneIds[i] === rune.id
              }
              onClick={() => {}}
            />
          ))}
        </div>
      ))}
    </RuneGroupStyled>
  )
}

export default RuneGroup
