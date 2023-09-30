import { forwardRef } from 'react'

import { Radio, RadioGroupProps } from 'antd'
import clsx from 'clsx'

import useDuoLaneOptions from '@renderer/features/duo/DuoLaneSelect/hooks/useDuoLaneOptions'
import LaneIcon from '@renderer/features/lane/LaneIcon'

import * as Styled from './DuoLaneSelect.styled'

export interface DuoLaneSelectProps extends RadioGroupProps {
  className?: string
}

export type DuoId = 0 | 1 | 2 | 3

const DuoLaneSelect = forwardRef<HTMLDivElement, DuoLaneSelectProps>(
  ({ className, ...props }, ref) => {
    const options = useDuoLaneOptions()

    return (
      <Styled.Root className={clsx('DuoLaneSelect', className)}>
        <Radio.Group ref={ref} {...props}>
          {options.map(([laneId1, laneId2, label], index) => (
            <Radio.Button key={index} value={index}>
              <LaneIcon laneId={laneId1} />
              <LaneIcon laneId={laneId2} />
              <small>{label}</small>
            </Radio.Button>
          ))}
        </Radio.Group>
      </Styled.Root>
    )
  },
)

export default DuoLaneSelect
