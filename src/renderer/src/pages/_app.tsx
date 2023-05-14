import { useEffect, useMemo } from 'react'
import { Outlet, useLocation } from 'react-router-dom'

import { ConfigProvider, GlobalToken, theme } from 'antd'
import antdLocaleKR from 'antd/locale/ko_KR'
import { useRecoilState } from 'recoil'
import { ThemeProvider } from 'styled-components'

import Layout from '@renderer/components/Layout'
import Titlebar from '@renderer/components/Titlebar'
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

const AppInner = () => {
  const { pathname } = useLocation()
  const antdToken = theme.useToken()

  const [update, setUpdate] = useRecoilState(updateStore)
  const [appState, setAppState] = useRecoilState(appStateStore)

  useUpdateContentModal({ autoOpen: true })

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

    window.electron.initializeUpdater()

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

  const isOverlay = pathname.includes('/overlays')

  useEffect(() => {
    bootstrap()
  }, [])

  return (
    <ThemeProvider theme={styledTheme}>
      <InitGlobalStyled />

      {isOverlay && <Outlet />}

      {!isOverlay && (
        <div id="app">
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
