import { Empty } from 'antd'

import LayoutConfig from '@renderer/components/LayoutConfig'
import * as Styled from '@renderer/styles/pageStyled/NotFoundPage.styled'

const NotFoundPage = () => {
  return (
    <Styled.Root>
      <LayoutConfig breadcrumbs={['페이지를 찾을 수 없습니다 :(']} />
      <Empty description="페이지를 찾을 수 없습니다 :(" />
    </Styled.Root>
  )
}

export default NotFoundPage
