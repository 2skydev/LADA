import LayoutConfig from '@renderer/components/LayoutConfig'
import DuoSynergyTable from '@renderer/features/duo/DuoSynergyTable'
import * as Styled from '@renderer/styles/pageStyled/DuoSynergyPage.styled'

const DuoSynergyPage = () => {
  return (
    <Styled.Root>
      <LayoutConfig breadcrumbs={['통계', '듀오 시너지']} />
      <DuoSynergyTable />
    </Styled.Root>
  )
}

export default DuoSynergyPage
