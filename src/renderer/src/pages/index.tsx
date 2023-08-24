import LayoutConfig from '@renderer/components/LayoutConfig'
import TierTable from '@renderer/features/tier/TierTable'
import * as Styled from '@renderer/styles/pageStyled/IndexPage.styled'

const IndexPage = () => {
  return (
    <Styled.Root>
      <LayoutConfig breadcrumbs={['통계', '챔피언 티어']} />
      <TierTable />
    </Styled.Root>
  )
}

export default IndexPage
