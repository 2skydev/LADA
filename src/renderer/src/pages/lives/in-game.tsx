import { useTranslation } from 'react-i18next'

import LayoutConfig from '@renderer/components/LayoutConfig/LayoutConfig'
import InGameInfo from '@renderer/features/inGame/InGameInfo'
import * as Styled from '@renderer/styles/pageStyled/LiveInGamePage.styled'

const LiveInGamePage = () => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'renderer.pages',
  })

  return (
    <Styled.Root>
      <LayoutConfig breadcrumbs={[t('live'), t('inGame')]} />
      <InGameInfo />
    </Styled.Root>
  )
}

export default LiveInGamePage
