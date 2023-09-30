import { useEffect } from 'react'

import { notification } from 'antd'
import { t } from 'i18next'

const NeedUpdateLaterNotification = () => {
  const [api, contextHolder] = notification.useNotification()

  useEffect(() => {
    window.electron.onNeedUpdateLater(() => {
      api.warning({
        message: t('renderer.needUpdateLaterNotification.title'),
        description: (
          <div style={{ whiteSpace: 'pre-wrap' }}>
            {t('renderer.needUpdateLaterNotification.description')}
          </div>
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
