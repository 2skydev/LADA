import { Button, Result } from 'antd'
import clsx from 'clsx'

import * as Styled from './InGameNotFound.styled'

export interface InGameNotFoundProps {
  className?: string
  reload: () => void
  isLoading?: boolean
}

const InGameNotFound = ({ className, reload, isLoading }: InGameNotFoundProps) => {
  return (
    <Styled.Root className={clsx('InGameNotFound', className)}>
      <Result
        status="warning"
        title="인게임 정보를 불러올 수 없습니다."
        extra={
          <>
            현재 게임에 참여중이지 않거나, 인게임 정보를 불러올 수 없는 상태입니다.
            <br />
            <br />
            <Button onClick={() => reload()} loading={isLoading}>
              새로고침
            </Button>
          </>
        }
      />
    </Styled.Root>
  )
}

export default InGameNotFound
