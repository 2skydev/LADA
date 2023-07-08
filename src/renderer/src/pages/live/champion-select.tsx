import LayoutConfig from '@renderer/components/LayoutConfig'
import ChampDetail from '@renderer/features/champ/ChampDetail/ChampDetail'
import { LiveChampionSelectPageStyled } from '@renderer/styles/pageStyled/liveChampionSelectPageStyled'

const LiveChampionSelect = () => {
  return (
    <LiveChampionSelectPageStyled>
      <LayoutConfig breadcrumbs={['라이브 게임', '챔피언 선택']} />

      {/* <ChampDetail /> */}
    </LiveChampionSelectPageStyled>
  )
}

export default LiveChampionSelect
