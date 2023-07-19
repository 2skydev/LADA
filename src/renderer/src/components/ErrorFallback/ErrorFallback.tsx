import { useState } from 'react'
import { useLocation, useRouteError } from 'react-router-dom'

import { Button } from 'antd'

import errorImage from '@renderer/assets/images/error.webp'
import Titlebar from '@renderer/components/Titlebar'

import { ErrorFallbackStyled } from './styled'

const ignorePaths = [/\/overlays\/.+/]

const ErrorFallback = () => {
  const [loading, setLoading] = useState(false)

  const { message } = useRouteError() as any
  const { pathname } = useLocation()

  const isIgnore = ignorePaths.some(path => path.test(pathname))

  const handleReload = () => {
    setLoading(true)
    setTimeout(() => window.location.reload(), 500)
  }

  if (isIgnore) return null

  return (
    <ErrorFallbackStyled
      className="ErrorFallback"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <Titlebar />

      <img src={errorImage} alt="error" />

      <h1>알 수 없는 곳으로 와버린 거 같아요</h1>
      <p>원인은 저희가 찾아볼게요 여러분들은 다시 돌아가는 게 좋을 것 같아요</p>

      <Button onClick={handleReload} loading={loading}>
        돌아가기
      </Button>

      <div className="error">
        <div className="title">오류 내용</div>
        <div className="content">{message}</div>
      </div>
    </ErrorFallbackStyled>
  )
}

export default ErrorFallback
