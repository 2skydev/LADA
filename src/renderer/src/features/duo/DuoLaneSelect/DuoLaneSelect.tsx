import { forwardRef } from 'react'

import { Radio, RadioGroupProps } from 'antd'
import clsx from 'clsx'

import LaneIcon from '@renderer/features/asset/LaneIcon'
import { LANE_ID } from '@renderer/types/league'

import { DuoLaneSelectStyled } from './styled'

export interface DuoLaneSelectProps extends RadioGroupProps {
  className?: string
}

export const DUO_OPTIONS: [LANE_ID, LANE_ID, string][] = [
  [LANE_ID.adc, LANE_ID.sup, '바텀'],
  [LANE_ID.mid, LANE_ID.jg, '미드 & 정글'],
  [LANE_ID.top, LANE_ID.jg, '탑 & 정글'],
  [LANE_ID.jg, LANE_ID.sup, '정글 & 서폿'],
]

const DuoLaneSelect = forwardRef<HTMLDivElement, DuoLaneSelectProps>(
  ({ className, ...props }, ref) => {
    return (
      <DuoLaneSelectStyled className={clsx('DuoLaneSelect', className)}>
        <Radio.Group ref={ref} {...props}>
          {DUO_OPTIONS.map(([laneId1, laneId2, label], index) => (
            <Radio.Button key={index} value={index}>
              <LaneIcon laneId={laneId1} />
              <LaneIcon laneId={laneId2} />
              <small>{label}</small>
            </Radio.Button>
          ))}
        </Radio.Group>
      </DuoLaneSelectStyled>
    )
  },
)

export default DuoLaneSelect
