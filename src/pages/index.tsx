import LayoutConfig from '~/components/LayoutConfig';
import TierTable from '~/features/tier/TierTable';
import { IndexPageStyled } from '~/styles/pageStyled/indexPageStyled';

const Index = () => {
  return (
    <IndexPageStyled>
      <LayoutConfig breadcrumbs={['챔피언', '챔피언 티어']} />
      <TierTable />
    </IndexPageStyled>
  );
};

export default Index;
