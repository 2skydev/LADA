import { forwardRef } from 'react'

import { Radio, RadioGroupProps } from 'antd'
import clsx from 'clsx'

import LaneIcon from '@renderer/features/lane/LaneIcon'

import * as Styled from './LaneSelect.styled'

export interface LaneSelectProps extends RadioGroupProps {
  className?: string
  hideLabel?: boolean
}

export const LANE_LABELS = ['탑', '정글', '미드', '원딜', '서폿']

const LaneSelect = forwardRef<HTMLDivElement, LaneSelectProps>(
  ({ className, hideLabel = false, ...props }, ref) => {
    return (
      <Styled.Root className={clsx('LaneSelect', className)}>
        <Radio.Group ref={ref} {...props}>
          {LANE_LABELS.map((lane, index) => (
            <Radio.Button key={index} value={index}>
              <LaneIcon laneId={index} /> {!hideLabel && <small>{lane}</small>}
            </Radio.Button>
          ))}
        </Radio.Group>
      </Styled.Root>
    )
  },
)

export default LaneSelect
