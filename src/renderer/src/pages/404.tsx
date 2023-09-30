import { useTranslation } from 'react-i18next'

import { Empty } from 'antd'

import LayoutConfig from '@renderer/components/LayoutConfig'
import * as Styled from '@renderer/styles/pageStyled/NotFoundPage.styled'

const NotFoundPage = () => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'renderer.pages',
  })

  return (
    <Styled.Root>
      <LayoutConfig breadcrumbs={[t('notFound')]} />
      <Empty description={t('notFound')} />
    </Styled.Root>
  )
}

export default NotFoundPage
