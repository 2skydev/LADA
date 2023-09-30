import { useTranslation } from 'react-i18next'

import { Result } from 'antd'
import { useAtomValue } from 'jotai'

import LayoutConfig from '@renderer/components/LayoutConfig'
import ChampionStats from '@renderer/features/champion/ChampionStats'
import { championSelectSessionAtom } from '@renderer/stores/atoms/championSelectSession.atom'
import { configAtom } from '@renderer/stores/atoms/config.atom'
import * as Styled from '@renderer/styles/pageStyled/LiveChampionSelectPage.styled'

const LiveChampionSelectPage = () => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'renderer',
  })

  const data = useAtomValue(championSelectSessionAtom)

  const hasChampionId = data && Boolean(data.championId || data.tempChampionId)

  return (
    <Styled.Root>
      <LayoutConfig breadcrumbs={[t('pages.live'), t('pages.championSelect')]} />

      {hasChampionId && <LiveChampionDetail />}

      {!hasChampionId && (
        <Result
          status="warning"
          title={t('stats.championSelect.notFound.title')}
          extra={t('stats.championSelect.notFound.description')}
        />
      )}
    </Styled.Root>
  )
}

const LiveChampionDetail = () => {
  const {
    game: { useCurrentPositionChampionData, autoRuneSetting, autoSummonerSpellSetting },
  } = useAtomValue(configAtom)

  const { championId, tempChampionId, laneId } = useAtomValue(championSelectSessionAtom)!

  const id = championId || tempChampionId
  const defaultLaneId = laneId === null || !useCurrentPositionChampionData ? undefined : laneId

  return (
    <ChampionStats
      championId={id!}
      defaultLaneId={defaultLaneId}
      autoRuneSetting={autoRuneSetting}
      autoSummonerSpellSetting={autoSummonerSpellSetting}
    />
  )
}

export default LiveChampionSelectPage
