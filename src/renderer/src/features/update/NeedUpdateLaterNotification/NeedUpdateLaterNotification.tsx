import { useEffect } from 'react'

import { notification } from 'antd'

const NeedUpdateLaterNotification = () => {
  const [api, contextHolder] = notification.useNotification()

  useEffect(() => {
    window.electron.onNeedUpdateLater(() => {
      api.warning({
        message: '업데이트 미뤄짐',
        description: (
          <>
            챔피언 선택중이라 업데이트가 미뤄졌습니다. <br />
            앱을 재시작하면 업데이트가 진행됩니다. <br />
            <br />
            수동으로도 업데이트 가능합니다. [일반 설정 &gt; 앱 버전]
          </>
        ),
        style: {
          width: 500,
        },
        duration: null,
      })
    })
  }, [])

  return contextHolder
}

export default NeedUpdateLaterNotification
