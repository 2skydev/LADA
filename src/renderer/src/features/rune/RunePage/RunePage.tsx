import clsx from 'clsx'

import { RuneIdsGroupByType, RuneType } from '@main/modules/league/types/rune.types'

import RuneGroup, { RuneGroupValue } from '../RuneGroup'
import * as Styled from './RunePage.styled'

export interface RunePageProps extends RuneIdsGroupByType {
  className?: string
  onChange?: (value: RuneIdsGroupByType) => void
}

const RunePage = ({
  className,
  mainRuneIds,
  subRuneIds,
  shardRuneIds,
  onChange,
}: RunePageProps) => {
  const handleChange =
    <Type extends RuneType>(type: Type) =>
    (runeIds: RuneGroupValue<Type>) => {
      const runeIdsGroupByType: RuneIdsGroupByType = {
        mainRuneIds: [...mainRuneIds],
        subRuneIds: [...subRuneIds],
        shardRuneIds: [...shardRuneIds],
      }

      runeIdsGroupByType[`${type}RuneIds`] = runeIds

      onChange && onChange(runeIdsGroupByType)
    }

  return (
    <Styled.Root className={clsx('RunePage', className)}>
      <RuneGroup
        type="main"
        activeRuneIds={mainRuneIds}
        onChange={onChange && handleChange('main')}
      />

      <div className="right">
        <RuneGroup
          type="sub"
          activeRuneIds={subRuneIds}
          onChange={onChange && handleChange('sub')}
        />
        <RuneGroup
          type="shard"
          activeRuneIds={shardRuneIds}
          onChange={onChange && handleChange('shard')}
        />
      </div>
    </Styled.Root>
  )
}

export default RunePage
