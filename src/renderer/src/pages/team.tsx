import { useTranslation } from 'react-i18next'

import LayoutConfig from '@renderer/components/LayoutConfig'
import TeamManager from '@renderer/features/team/TeamManager'
import * as Styled from '@renderer/styles/pageStyled/TeamPage.styled'

const TeamPage = () => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'renderer.pages',
  })

  return (
    <Styled.Root>
      <LayoutConfig breadcrumbs={[t('utility'), t('customGameTeamManager')]} />
      <TeamManager />
    </Styled.Root>
  )
}

export default TeamPage
