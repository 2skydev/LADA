import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Progress } from 'antd'
import { useAtomValue } from 'jotai'

import logoImage from '@renderer/assets/images/logo@256.png'
import { appUpdateAtom } from '@renderer/stores/atoms/appUpdate.atom'
import * as Styled from '@renderer/styles/pageStyled/WindowsUpdateLoadingPage.styled'

const WindowsUpdateLoadingPage = () => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'renderer.updateLoading',
  })

  const [percent, setPercent] = useState(0)
  const [text, setText] = useState(t('loading'))
  const { status } = useAtomValue(appUpdateAtom)

  useEffect(() => {
    switch (status.event) {
      case 'download-progress':
        if (percent !== 100) setPercent(Number(status.data.percent))
        break

      case 'update-downloaded':
        setText(t('autoRestart'))
        break
    }
  }, [status])

  return (
    <Styled.Root>
      <img src={logoImage} alt="logo" />
      <div className="text">{text}</div>
      <Progress percent={percent} showInfo={false} size={[200, 6]} />
    </Styled.Root>
  )
}

export default WindowsUpdateLoadingPage
