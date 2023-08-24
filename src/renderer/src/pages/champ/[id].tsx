import { useLocation, useParams } from 'react-router-dom'

import QueryString from 'qs'

import { LaneId } from '@main/modules/league/types/lane.types'

import LayoutConfig from '@renderer/components/LayoutConfig'
import ChampDetail from '@renderer/features/champ/ChampDetail'
import * as Styled from '@renderer/styles/pageStyled/ChampPage.styled'

const ChampPage = () => {
  const { id } = useParams()
  const { search } = useLocation()
  const { laneId } = QueryString.parse(search, { ignoreQueryPrefix: true })

  const defaultLaneId = laneId ? (Number(laneId) as LaneId) : undefined

  return (
    <Styled.Root>
      <LayoutConfig breadcrumbs={['통계', '챔피언 상세']} />
      <ChampDetail champId={Number(id)} defaultLaneId={defaultLaneId} />
    </Styled.Root>
  )
}

export default ChampPage
