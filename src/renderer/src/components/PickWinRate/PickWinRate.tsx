import { useTranslation } from 'react-i18next'

import { Progress } from 'antd'
import clsx from 'clsx'

import * as Styled from './PickWinRate.styled'

export interface PickWinRateProps {
  className?: string
  winRate: number
  pickRate?: number
  count: number
}

const PickWinRate = ({ className, winRate, pickRate, count }: PickWinRateProps) => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'renderer.stats',
  })

  return (
    <Styled.Root className={clsx('PickWinRate', className)}>
      <div>
        <span className="label">W/R</span> {winRate}%
      </div>

      <div className="pickRate">
        <span className="label">{t('gameCount')}</span> {count.toLocaleString()}{' '}
        {pickRate && <Progress type="circle" percent={pickRate} size={14} />}
      </div>
    </Styled.Root>
  )
}

export default PickWinRate
