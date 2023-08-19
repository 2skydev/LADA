import { useLocation, useParams } from 'react-router-dom'

import QueryString from 'qs'

import { LaneId } from '@main/modules/league/types/lane.types'

import LayoutConfig from '@renderer/components/LayoutConfig'
import ChampDetail from '@renderer/features/champ/ChampDetail'
import { ChampPageStyled } from '@renderer/styles/pageStyled/champPageStyled'

const Champ = () => {
  const { id } = useParams()
  const { search } = useLocation()
  const { laneId } = QueryString.parse(search, { ignoreQueryPrefix: true })

  const defaultLaneId = laneId ? (Number(laneId) as LaneId) : undefined

  return (
    <ChampPageStyled>
      <LayoutConfig breadcrumbs={['통계', '챔피언 상세']} />
      <ChampDetail champId={Number(id)} defaultLaneId={defaultLaneId} />
    </ChampPageStyled>
  )
}

export default Champ
