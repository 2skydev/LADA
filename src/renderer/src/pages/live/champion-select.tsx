import { useAtomValue } from 'jotai'

import LayoutConfig from '@renderer/components/LayoutConfig'
import ChampDetail from '@renderer/features/champ/ChampDetail/ChampDetail'
import LiveChampionSelectNotFound from '@renderer/features/empty/LiveChampionSelectNotFound'
import { championSelectSessionAtom } from '@renderer/stores/atoms/championSelectSession.atom'
import { configAtom } from '@renderer/stores/atoms/config.atom'
import { LiveChampionSelectPageStyled } from '@renderer/styles/pageStyled/liveChampionSelectPageStyled'

const LiveChampionSelect = () => {
  const data = useAtomValue(championSelectSessionAtom)
  const gameId = data?.gameId

  return (
    <LiveChampionSelectPageStyled>
      <LayoutConfig breadcrumbs={['라이브 게임', '챔피언 선택']} />

      {!gameId && <LiveChampionSelectNotFound />}

      {gameId && (
        <>
          <LiveChampionDetail />
        </>
      )}
    </LiveChampionSelectPageStyled>
  )
}

const LiveChampionDetail = () => {
  const {
    game: { useCurrentPositionChampionData },
  } = useAtomValue(configAtom)

  const { championId, tempChampionId, laneId } = useAtomValue(championSelectSessionAtom) || {}

  const id = championId || tempChampionId
  const defaultLaneId = laneId === null || !useCurrentPositionChampionData ? undefined : laneId

  return <ChampDetail champId={Number(id)} defaultLaneId={defaultLaneId} />
}

export default LiveChampionSelect
