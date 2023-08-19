import { Outlet, useLocation } from 'react-router-dom'

import Layout from '@renderer/components/Layout'
import Titlebar from '@renderer/components/Titlebar'
import NeedUpdateLaterNotification from '@renderer/features/update/NeedUpdateLaterNotification'
import useChampionSelectPageAutoNavigate from '@renderer/hooks/autoNavigate/useChampionSelectPageAutoNavigate'
import useInGamePageAutoNavigate from '@renderer/hooks/autoNavigate/useInGamePageAutoNavigate'
import useTierListPageAutoNavigate from '@renderer/hooks/autoNavigate/useTierListPageAutoNavigate'
import useAppUpdateListener from '@renderer/hooks/listener/useAppUpdateListener'
import useChampionSelectSessionListener from '@renderer/hooks/listener/useChampionSelectSessionListener'
import useConfigListener from '@renderer/hooks/listener/useConfigListener'
import useCurrentSummonerListener from '@renderer/hooks/listener/useCurrentSummonerListener'
import useLeagueListener from '@renderer/hooks/listener/useLeagueListener'
import { useUpdateContentModal } from '@renderer/hooks/useUpdateContentModal'
import { InitGlobalStyled } from '@renderer/styles/init'

const noLayoutPaths = [/\/windows\/.+/, /\/overlays\/.+/]

const App = () => {
  const { pathname } = useLocation()

  const isNoLayout = noLayoutPaths.some(path => path.test(pathname))

  useUpdateContentModal({ autoOpen: !isNoLayout })

  // listeners
  useConfigListener()
  useLeagueListener()
  useAppUpdateListener()
  useChampionSelectSessionListener()
  useCurrentSummonerListener()

  return (
    <>
      <InitGlobalStyled />
      {isNoLayout && <Outlet />}

      {!isNoLayout && (
        <div id="app">
          <AutoNavigateHooks />
          <NeedUpdateLaterNotification />

          <Titlebar />

          <Layout>
            <Outlet />
          </Layout>
        </div>
      )}
    </>
  )
}

const AutoNavigateHooks = () => {
  useTierListPageAutoNavigate()
  useInGamePageAutoNavigate()
  useChampionSelectPageAutoNavigate()

  return null
}

export default App
