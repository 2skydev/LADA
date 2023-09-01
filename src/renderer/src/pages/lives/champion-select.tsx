import { Result } from 'antd'
import { useAtomValue } from 'jotai'

import LayoutConfig from '@renderer/components/LayoutConfig'
import ChampionStats from '@renderer/features/champion/ChampionStats'
import { championSelectSessionAtom } from '@renderer/stores/atoms/championSelectSession.atom'
import { configAtom } from '@renderer/stores/atoms/config.atom'
import * as Styled from '@renderer/styles/pageStyled/LiveChampionSelectPage.styled'

const LiveChampionSelectPage = () => {
  const data = useAtomValue(championSelectSessionAtom)

  const hasChampionId = data && Boolean(data.championId || data.tempChampionId)

  return (
    <Styled.Root>
      <LayoutConfig breadcrumbs={['라이브 게임', '챔피언 선택']} />

      {hasChampionId && <LiveChampionDetail />}

      {!hasChampionId && (
        <Result
          status="warning"
          title="챔피언 선택 정보를 불러올 수 없습니다."
          extra={<>현재 게임에 참여중이지 않거나, 챔피언 선택 정보를 불러올 수 없는 상태입니다.</>}
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
