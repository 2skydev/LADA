import { useParams } from 'react-router-dom';

import LayoutConfig from '~/components/LayoutConfig';
import useAPI from '~/hooks/useAPI';
import { ChampPageStyled } from '~/styles/pageStyled/champPageStyled';

const Champ = () => {
  const { id } = useParams();

  const { data } = useAPI('ps', `/champ/${id}`);

  console.log(data);

  return (
    <ChampPageStyled>
      <LayoutConfig breadcrumbs={['챔피언', '상세보기']} />
    </ChampPageStyled>
  );
};

export default Champ;
