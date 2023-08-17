import clsx from 'clsx'

import { RuneBuild } from '@main/modules/league/types/stat.types'

import ButtonRadioList, {
  ButtonRadioListProps,
} from '@renderer/components/ButtonRadioList/ButtonRadioList'
import PickWinRate from '@renderer/components/PickWinRate'
import RuneIcon from '@renderer/features/rune/RuneIcon'

import { RuneBuildButtonRadioListStyled } from './styled'

export interface RuneBuildButtonRadioListProps
  extends Pick<ButtonRadioListProps, 'onChange' | 'value'> {
  className?: string
  items: RuneBuild[]
}

const RuneBuildButtonRadioList = ({
  className,
  items,
  ...buttonRadioListProps
}: RuneBuildButtonRadioListProps) => {
  return (
    <RuneBuildButtonRadioListStyled className={clsx('RuneBuildButtonRadioList', className)}>
      <ButtonRadioList
        {...buttonRadioListProps}
        options={items.map((item, i) => ({
          value: i,
          label: (
            <>
              <div className="runeIconBox">
                <RuneIcon className="main" runeId={item.mainRuneIds[0]} size="38px" imageOnly />
                <RuneIcon
                  className="sub"
                  runeId={item.subRuneIds[0]}
                  size="18px"
                  useCategoryImage
                />
              </div>

              <div className="texts">
                <PickWinRate winRate={item.winRate} pickRate={item.pickRate} count={item.count} />
              </div>
            </>
          ),
        }))}
      />
    </RuneBuildButtonRadioListStyled>
  )
}

export default RuneBuildButtonRadioList
