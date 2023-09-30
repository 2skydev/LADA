import { useEffect } from 'react'

import { Modal } from 'antd'
import { t } from 'i18next'

const LanguageChangeInfoModal = () => {
  const [modal, contextHolder] = Modal.useModal()

  useEffect(() => {
    window.electron.onChangeLanguage(() => {
      modal.confirm({
        icon: null,
        centered: true,
        title: t('renderer.languageChangeInfoModal.title'),
        content: t('renderer.languageChangeInfoModal.description'),
        okText: t('renderer.languageChangeInfoModal.ok'),
        cancelText: t('renderer.languageChangeInfoModal.later'),
        onOk: () => {
          window.electron.relaunch()
        },
      })
    })
  }, [])

  return contextHolder
}

export default LanguageChangeInfoModal
