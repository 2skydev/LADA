import { Result } from 'antd'
import clsx from 'clsx'

import * as Styled from './SummonerNotFound.styled'

export interface SummonerNotFoundProps {
  className?: string
}

const SummonerNotFound = ({ className }: SummonerNotFoundProps) => {
  return (
    <Styled.Root className={clsx('SummonerNotFound', className)}>
      <Result
        status="warning"
        title="소환사를 찾을 수 없습니다."
        extra="리그 오브 레전드 클라이언트를 실행한 후 다시 시도해주세요."
      />
    </Styled.Root>
  )
}

export default SummonerNotFound
