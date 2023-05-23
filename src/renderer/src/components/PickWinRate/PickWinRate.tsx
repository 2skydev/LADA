import { Progress } from 'antd'
import clsx from 'clsx'

import { PickWinRateStyled } from './styled'

export interface PickWinRateProps {
  className?: string
  winRate: number
  pickRate?: number
  count: number
}

const PickWinRate = ({ className, winRate, pickRate, count }: PickWinRateProps) => {
  return (
    <PickWinRateStyled className={clsx('PickWinRate', className)}>
      <div>
        <span className="label">W/R</span> {winRate}%
      </div>

      <div className="pickRate">
        <span className="label">게임수</span> {count.toLocaleString()}{' '}
        {pickRate && <Progress type="circle" percent={pickRate} size={14} />}
      </div>
    </PickWinRateStyled>
  )
}

export default PickWinRate
