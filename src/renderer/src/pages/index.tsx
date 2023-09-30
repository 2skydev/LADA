import { useTranslation } from 'react-i18next'

import LayoutConfig from '@renderer/components/LayoutConfig'
import TierTable from '@renderer/features/tier/TierTable'
import * as Styled from '@renderer/styles/pageStyled/IndexPage.styled'

const IndexPage = () => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'renderer.pages',
  })

  return (
    <Styled.Root>
      <LayoutConfig breadcrumbs={[t('stats'), t('championTier')]} />
      <TierTable />
    </Styled.Root>
  )
}

export default IndexPage
