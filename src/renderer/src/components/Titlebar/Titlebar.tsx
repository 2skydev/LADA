import clsx from 'clsx'
import { useAtomValue } from 'jotai'

import { AppControlAction } from '@main/modules/electron/types/app-control.type'

import { configAtom } from '@renderer/stores/atoms/config.atom'

import * as Styled from './Titlebar.styled'

export interface TitlebarProps {
  className?: string
}

const Titlebar = ({ className }: TitlebarProps) => {
  const {
    general: { developerMode },
  } = useAtomValue(configAtom)

  const appControl = (action: AppControlAction) => {
    window.electron.appControl(action)
  }

  return (
    <Styled.Root className={clsx('Titlebar', className)}>
      {developerMode && (
        <div onClick={() => appControl('devtools')}>
          <i className="bx bx-code-alt" />
        </div>
      )}

      <div onClick={() => appControl('minimize')}>
        <i className="bx bx-minus" />
      </div>

      <div onClick={() => appControl('maximize')}>
        <i className="bx bx-square" />
      </div>

      <div className="close" onClick={() => appControl('close')}>
        <i className="bx bx-x" />
      </div>
    </Styled.Root>
  )
}

export default Titlebar
