import { useTranslation } from 'react-i18next'

import LayoutConfig from '@renderer/components/LayoutConfig'
import DuoSynergyTable from '@renderer/features/duo/DuoSynergyTable'
import * as Styled from '@renderer/styles/pageStyled/DuoSynergyPage.styled'

const DuoSynergyPage = () => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'renderer.pages',
  })

  return (
    <Styled.Root>
      <LayoutConfig breadcrumbs={[t('stats'), t('duoSynergy')]} />
      <DuoSynergyTable />
    </Styled.Root>
  )
}

export default DuoSynergyPage
