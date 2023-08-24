import { ReactNode } from 'react'

import clsx from 'clsx'

import { RuneIdsGroupByType, RuneType } from '@main/modules/league/types/rune.types'

import RuneIcon from '@renderer/features/rune/RuneIcon/RuneIcon'
import useAPI from '@renderer/hooks/useAPI'

import * as Styled from './RuneGroup.styled'

export type RuneGroupValue<Type extends RuneType> = RuneIdsGroupByType[`${Type}RuneIds`]

export interface RuneGroupProps<
  Type extends RuneType,
  Value extends RuneGroupValue<Type> = RuneGroupValue<Type>,
> {
  className?: string
  children?: ReactNode
  type: Type
  activeRuneIds: Value
  onChange?: (value: Value) => void
}

const RuneGroup = <
  Type extends RuneType,
  Value extends RuneGroupValue<Type> = RuneGroupValue<Type>,
>({
  className,
  type,
  activeRuneIds,
  onChange,
}: RuneGroupProps<Type, Value>) => {
  const { data } = useAPI('getRuneData', {
    revalidateIfStale: false,
  })

  if (!data) return null

  const categoryData = data.categories[data.categoryFindMap[activeRuneIds[0]]]

  const handleClick = (slotId: number) => (clickedRuneId: number) => {
    if (type !== 'sub' && activeRuneIds[slotId] === clickedRuneId) return
    if (type === 'sub' && activeRuneIds.includes(clickedRuneId)) return

    let runeIds: Value = [...activeRuneIds]

    if (type === 'sub') {
      const result: [number, number] = [0, 0]

      const usedSlotIds = runeIds.map(runeId =>
        categoryData.slots.slice(1).findIndex(runes => runes.some(rune => rune.id === runeId)),
      )

      const runeIndexUsingSameSlotId = usedSlotIds.findIndex(usedSlotId => usedSlotId === slotId)

      if (runeIndexUsingSameSlotId !== -1) {
        result[0] = clickedRuneId
        result[1] = runeIds[+!runeIndexUsingSameSlotId]
      } else {
        result[0] = clickedRuneId
        result[1] = runeIds[0]
      }

      runeIds = result as Value
    } else {
      runeIds[slotId] = clickedRuneId
    }

    onChange!(runeIds)
  }

  return (
    <Styled.Root className={clsx('RuneGroup', type, className)} data-category={categoryData.key}>
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
              onClick={onChange && handleClick(i)}
            />
          ))}
        </div>
      ))}
    </Styled.Root>
  )
}

export default RuneGroup
