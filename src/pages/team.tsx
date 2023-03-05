import LayoutConfig from '~/components/LayoutConfig';
import TeamManager from '~/features/team/TeamManager';
import { TeamPageStyled } from '~/styles/pageStyled/teamPageStyled';

const Team = () => {
  return (
    <TeamPageStyled>
      <LayoutConfig breadcrumbs={['유틸리티', '5:5 팀 구성']} />
      <TeamManager />
    </TeamPageStyled>
  );
};

export default Team;
