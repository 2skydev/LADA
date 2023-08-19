import { Result } from 'antd'
import clsx from 'clsx'

import { LiveChampionSelectNotFoundStyled } from './styled'

export interface LiveChampionSelectNotFoundProps {
  className?: string
}

const LiveChampionSelectNotFound = ({ className }: LiveChampionSelectNotFoundProps) => {
  return (
    <LiveChampionSelectNotFoundStyled className={clsx('LiveChampionSelectNotFound', className)}>
      <Result
        status="warning"
        title="챔피언 선택 정보를 불러올 수 없습니다."
        extra={<>현재 게임에 참여중이지 않거나, 챔피언 선택 정보를 불러올 수 없는 상태입니다.</>}
      />
    </LiveChampionSelectNotFoundStyled>
  )
}

export default LiveChampionSelectNotFound
