import LayoutConfig from '@renderer/components/LayoutConfig'
import DuoSynergyTable from '@renderer/features/duo/DuoSynergyTable'
import { DuoSynergyPageStyled } from '@renderer/styles/pageStyled/duoSynergyPageStyled'

const DuoSynergyPage = () => {
  return (
    <DuoSynergyPageStyled>
      <LayoutConfig breadcrumbs={['통계', '듀오 시너지']} />
      <DuoSynergyTable />
    </DuoSynergyPageStyled>
  )
}

export default DuoSynergyPage
