import LayoutConfig from '@renderer/components/LayoutConfig'
import TierTable from '@renderer/features/tier/TierTable'
import { IndexPageStyled } from '@renderer/styles/pageStyled/indexPageStyled'

const Index = () => {
  return (
    <IndexPageStyled>
      <LayoutConfig breadcrumbs={['통계', '챔피언 티어']} />
      <TierTable />
    </IndexPageStyled>
  )
}

export default Index
