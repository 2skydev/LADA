import { useTranslation } from 'react-i18next'
import { useLocation, useParams } from 'react-router-dom'

import QueryString from 'qs'

import { LaneId } from '@main/modules/league/types/lane.types'

import LayoutConfig from '@renderer/components/LayoutConfig'
import ChampionStats from '@renderer/features/champion/ChampionStats'
import * as Styled from '@renderer/styles/pageStyled/ChampionStatsPage.styled'

const ChampionStatsPage = () => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'renderer.pages',
  })

  const { id } = useParams()
  const { search } = useLocation()
  const { laneId } = QueryString.parse(search, { ignoreQueryPrefix: true })

  const defaultLaneId = laneId ? (Number(laneId) as LaneId) : undefined

  return (
    <Styled.Root>
      <LayoutConfig breadcrumbs={[t('stats'), t('championDetail')]} />
      <ChampionStats championId={Number(id)} defaultLaneId={defaultLaneId} />
    </Styled.Root>
  )
}

export default ChampionStatsPage
