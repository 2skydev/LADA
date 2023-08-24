import LayoutConfig from '@renderer/components/LayoutConfig'
import TeamManager from '@renderer/features/team/TeamManager'
import * as Styled from '@renderer/styles/pageStyled/TeamPage.styled'

const TeamPage = () => {
  return (
    <Styled.Root>
      <LayoutConfig breadcrumbs={['유틸리티', '5:5 팀 구성']} />
      <TeamManager />
    </Styled.Root>
  )
}

export default TeamPage
