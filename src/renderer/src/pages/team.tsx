import LayoutConfig from '@renderer/components/LayoutConfig'
import TeamManager from '@renderer/features/team/TeamManager'
import { TeamPageStyled } from '@renderer/styles/pageStyled/teamPageStyled'

const Team = () => {
  return (
    <TeamPageStyled>
      <LayoutConfig breadcrumbs={['유틸리티', '5:5 팀 구성']} />
      <TeamManager />
    </TeamPageStyled>
  )
}

export default Team
