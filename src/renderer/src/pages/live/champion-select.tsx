import { useAtomValue } from 'jotai'

import LayoutConfig from '@renderer/components/LayoutConfig'
import ChampDetail from '@renderer/features/champ/ChampDetail/ChampDetail'
import LiveChampionSelectNotFound from '@renderer/features/empty/LiveChampionSelectNotFound'
import { championSelectSessionAtom } from '@renderer/stores/atoms/championSelectSession.atom'
import { LiveChampionSelectPageStyled } from '@renderer/styles/pageStyled/liveChampionSelectPageStyled'

const LiveChampionSelect = () => {
  const { championId, tempChampionId } = useAtomValue(championSelectSessionAtom) || {}

  const id = championId || tempChampionId

  return (
    <LiveChampionSelectPageStyled>
      <LayoutConfig breadcrumbs={['라이브 게임', '챔피언 선택']} />

      {!id && <LiveChampionSelectNotFound />}

      {id && <ChampDetail champId={Number(id)} />}
    </LiveChampionSelectPageStyled>
  )
}

export default LiveChampionSelect
