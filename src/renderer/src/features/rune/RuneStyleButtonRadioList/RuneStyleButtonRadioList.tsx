import clsx from 'clsx'

import ButtonRadioList, {
  ButtonRadioListProps,
} from '@renderer/components/ButtonRadioList/ButtonRadioList'
import PickWinRate from '@renderer/components/PickWinRate'
import RuneIcon from '@renderer/features/rune/RuneIcon'

import { RuneStyleButtonRadioListStyled } from './styled'

export interface RuneStyleButtonRadioListItems {
  mainRuneId: number
  subRuneId: number
  winRate: number
  count: number
  pickRate: number
}

export interface RuneStyleButtonRadioListProps
  extends Pick<ButtonRadioListProps, 'onChange' | 'value'> {
  className?: string
  items: RuneStyleButtonRadioListItems[]
}

const RuneStyleButtonRadioList = ({
  className,
  items,
  ...buttonRadioListProps
}: RuneStyleButtonRadioListProps) => {
  return (
    <RuneStyleButtonRadioListStyled className={clsx('RuneStyleButtonRadioList', className)}>
      <ButtonRadioList
        {...buttonRadioListProps}
        options={items.map((item, i) => ({
          value: i,
          label: (
            <>
              <div className="runeIconBox">
                <RuneIcon className="main" runeId={item.mainRuneId} size="38px" imageOnly />
                <RuneIcon className="sub" runeId={item.subRuneId} size="18px" useCategoryImage />
              </div>

              <div className="texts">
                <PickWinRate winRate={item.winRate} pickRate={item.pickRate} count={item.count} />
              </div>
            </>
          ),
        }))}
      />
    </RuneStyleButtonRadioListStyled>
  )
}

export default RuneStyleButtonRadioList
