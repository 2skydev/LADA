import { useEffect, useMemo } from 'react'
import { Outlet, useLocation } from 'react-router-dom'

import { ConfigProvider, GlobalToken, theme } from 'antd'
import antdLocaleKR from 'antd/locale/ko_KR'
import { useRecoilState } from 'recoil'
import { ThemeProvider } from 'styled-components'

import Layout from '@renderer/components/Layout'
import Titlebar from '@renderer/components/Titlebar'
import NeedUpdateLaterNotification from '@renderer/features/update/NeedUpdateLaterNotification'
import useNavigateToTierList from '@renderer/hooks/useNavigateToTierList'
import { useUpdateContentModal } from '@renderer/hooks/useUpdateContentModal'
import { appStateStore } from '@renderer/stores/app'
import { champSelectSessionStore } from '@renderer/stores/champSelectSession'
import { currentSummonerStore } from '@renderer/stores/currentSummoner'
import { updateStore } from '@renderer/stores/update'
import { InitGlobalStyled } from '@renderer/styles/init'
import { antdTheme, colors, sizes } from '@renderer/styles/themes'
import { leagueChampSelectLaneStringToLane } from '@renderer/utils/league'

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
  const [champSelectSession, setChampSelectSession] = useRecoilState(champSelectSessionStore)
  const [currentSummoner, setCurrentSummoner] = useRecoilState(currentSummonerStore)

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

    window.electron.subscribeLeague('summoner/current', data => {
      console.log('summoner/current', data)
      if (data) {
        setCurrentSummoner({
          id: data.summonerId,
          name: data.displayName,
          profileIconId: data.profileIconId,
        })
      } else {
        setCurrentSummoner(null)
      }
    })

    window.electron.subscribeLeague('champ-select/session', data => {
      const currentSummonerId = currentSummoner!.id
      const currentLane =
        data.myTeam.find(player => player.summonerId === currentSummonerId)?.assignedPosition ||
        null

      setChampSelectSession({
        gameId: data.gameId,
        lane: leagueChampSelectLaneStringToLane(currentLane),
      })

      console.log('champ-select/session', data, currentLane)
    })
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
  useNavigateToTierList()

  useEffect(() => {
    bootstrap()
  }, [])

  useEffect(() => {
    if (champSelectSession?.gameId) {
    }
  }, [champSelectSession?.gameId, champSelectSession?.lane])

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
