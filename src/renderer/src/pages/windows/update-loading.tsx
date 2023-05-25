import { useEffect, useState } from 'react'

import { Progress } from 'antd'
import { useRecoilValue } from 'recoil'

import logoImage from '@renderer/assets/images/logo@256.png'
import { updateStore } from '@renderer/stores/update'
import { WindowsUpdateLoadingPageStyled } from '@renderer/styles/pageStyled/windowsUpdatePageStyled'

const WindowsUpdateLoading = () => {
  const [percent, setPercent] = useState(0)
  const [text, setText] = useState('업데이트 다운로드중...')
  const { status } = useRecoilValue(updateStore)

  useEffect(() => {
    switch (status.event) {
      case 'download-progress':
        if (percent !== 100) setPercent(Number(status.data.percent))
        break

      case 'update-downloaded':
        setText('잠시 후 앱이 재시작됩니다.')
        break
    }
  }, [status])

  return (
    <WindowsUpdateLoadingPageStyled>
      <img src={logoImage} alt="logo" />
      <div className="text">{text}</div>
      <Progress percent={percent} showInfo={false} size={[200, 6]} />
    </WindowsUpdateLoadingPageStyled>
  )
}

export default WindowsUpdateLoading
