import { forwardRef } from 'react'
import { useTranslation } from 'react-i18next'

import { Radio, RadioGroupProps } from 'antd'
import clsx from 'clsx'

import LaneIcon from '@renderer/features/lane/LaneIcon'

import * as Styled from './LaneSelect.styled'

export interface LaneSelectProps extends RadioGroupProps {
  className?: string
  hideLabel?: boolean
}

const LaneSelect = forwardRef<HTMLDivElement, LaneSelectProps>(
  ({ className, hideLabel = false, ...props }, ref) => {
    const { t } = useTranslation('translation', {
      keyPrefix: 'league',
    })

    const labels = t('laneId', { returnObjects: true })

    return (
      <Styled.Root className={clsx('LaneSelect', className)}>
        <Radio.Group ref={ref} {...props}>
          {labels.map((lane, index) => (
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
