import { forwardRef } from 'react'

import { Radio, RadioGroupProps } from 'antd'
import clsx from 'clsx'

import { LANE_ID_ENUM } from '@main/modules/league/types/lane.types'

import LaneIcon from '@renderer/features/asset/LaneIcon'

import { DuoLaneSelectStyled } from './styled'

export interface DuoLaneSelectProps extends RadioGroupProps {
  className?: string
}

export type DuoId = 0 | 1 | 2 | 3

export const DUO_OPTIONS: [LANE_ID_ENUM, LANE_ID_ENUM, string][] = [
  [LANE_ID_ENUM.adc, LANE_ID_ENUM.sup, '바텀'],
  [LANE_ID_ENUM.mid, LANE_ID_ENUM.jg, '미드 & 정글'],
  [LANE_ID_ENUM.top, LANE_ID_ENUM.jg, '탑 & 정글'],
  [LANE_ID_ENUM.jg, LANE_ID_ENUM.sup, '정글 & 서폿'],
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
