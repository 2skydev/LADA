import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useRouteError } from 'react-router-dom'

import { Button } from 'antd'

import errorImage from '@renderer/assets/images/error.webp'
import Titlebar from '@renderer/components/Titlebar'

import * as Styled from './ErrorFallback.styled'

const ignorePaths = [/\/overlays\/.+/]

const ErrorFallback = () => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'renderer.error',
  })

  const [loading, setLoading] = useState(false)

  const { message } = useRouteError() as any
  const { pathname } = useLocation()

  const isIgnore = ignorePaths.some(path => path.test(pathname))

  const handleReload = () => {
    setLoading(true)

    setTimeout(() => {
      history.pushState(null, '', '/')
      window.location.reload()
    }, 500)
  }

  if (isIgnore) return null

  return (
    <Styled.Root className="ErrorFallback" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Titlebar />

      <img src={errorImage} alt="error" />

      <h1>{t('title')}</h1>
      <p>{t('description')}</p>

      <Button onClick={handleReload} loading={loading}>
        {t('back')}
      </Button>

      <div className="error">
        <div className="title">{t('errorContent')}</div>
        <div className="content">{message}</div>
      </div>
    </Styled.Root>
  )
}

export default ErrorFallback
