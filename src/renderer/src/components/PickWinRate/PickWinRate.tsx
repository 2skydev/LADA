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
  return (
    <Styled.Root className={clsx('PickWinRate', className)}>
      <div>
        <span className="label">W/R</span> {winRate}%
      </div>

      <div className="pickRate">
        <span className="label">게임수</span> {count.toLocaleString()}{' '}
        {pickRate && <Progress type="circle" percent={pickRate} size={14} />}
      </div>
    </Styled.Root>
  )
}

export default PickWinRate
