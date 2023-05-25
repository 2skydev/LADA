import { useEffect, useMemo } from 'react'
import { Outlet, useLocation } from 'react-router-dom'

import { ConfigProvider, GlobalToken, theme } from 'antd'
import antdLocaleKR from 'antd/locale/ko_KR'
import { useRecoilState } from 'recoil'
import { ThemeProvider } from 'styled-components'

import Layout from '@renderer/components/Layout'
import Titlebar from '@renderer/components/Titlebar'
import NeedUpdateLaterNotification from '@renderer/features/update/NeedUpdateLaterNotification'
import { useUpdateContentModal } from '@renderer/hooks/useUpdateContentModal'
import { appStateStore } from '@renderer/stores/app'
import { updateStore } from '@renderer/stores/update'
import { InitGlobalStyled } from '@renderer/styles/init'
import { antdTheme, colors, sizes } from '@renderer/styles/themes'

type Sizes = typeof sizes
type Colors = typeof colors

declare module 'styled-components' {
  export interface DefaultTheme {
    sizes: Sizes
    colors: Colors
    token: GlobalToken
  }
}

const App = () => {
  return (
    <ConfigProvider theme={antdTheme} locale={antdLocaleKR}>
      <AppInner />
    </ConfigProvider>
  )
}

const noLayoutPaths = [/\/windows\/.+/, /\/overlays\/.+/]

const AppInner = () => {
  const { pathname } = useLocation()
  const antdToken = theme.useToken()

  const [update, setUpdate] = useRecoilState(updateStore)
  const [appState, setAppState] = useRecoilState(appStateStore)

  const bootstrap = async () => {
    window.electron.onUpdate((event, data) => {
      setUpdate({
        ...update,
        status: {
          event,
          data,
          time: new Date().getTime(),
        },
      })
    })

    const isReady = await window.electron.apis('league', '/is-ready')

    setAppState({
      ...appState,
      leagueIsReady: isReady,
    })

    window.electron.subscribeLeague('connect-change', state => {
      setAppState({
        ...appState,
        leagueIsReady: state === 'connect',
      })
    })

    // window.electron.subscribeLeague('room/session', data => {
    //   console.log('room/session', data)
    // })
  }

  const styledTheme = useMemo(
    () => ({
      sizes: sizes,
      colors: colors,
      token: antdToken.token,
    }),
    [],
  )

  const isNoLayout = noLayoutPaths.some(path => path.test(pathname))

  useUpdateContentModal({ autoOpen: !isNoLayout })

  useEffect(() => {
    bootstrap()
  }, [])

  return (
    <ThemeProvider theme={styledTheme}>
      <InitGlobalStyled />

      {isNoLayout && <Outlet />}

      {!isNoLayout && (
        <div id="app">
          <NeedUpdateLaterNotification />

          <Titlebar />

          <Layout>
            <Outlet />
          </Layout>
        </div>
      )}
    </ThemeProvider>
  )
}

export default App
