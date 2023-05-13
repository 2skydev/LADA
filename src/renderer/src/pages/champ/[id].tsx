import { useParams } from 'react-router-dom'

import LayoutConfig from '@renderer/components/LayoutConfig'
import ChampDetail from '@renderer/features/champ/ChampDetail'
import { ChampPageStyled } from '@renderer/styles/pageStyled/champPageStyled'

const Champ = () => {
  const { id } = useParams()

  return (
    <ChampPageStyled>
      <LayoutConfig breadcrumbs={['챔피언', '상세보기']} />
      <ChampDetail champId={Number(id)} />
    </ChampPageStyled>
  )
}

export default Champ
