import { Outlet, useLocation } from 'react-router-dom'

import Layout from '@renderer/components/Layout'
import Titlebar from '@renderer/components/Titlebar'
import NeedUpdateLaterNotification from '@renderer/features/update/NeedUpdateLaterNotification'
import useChampionDetailPageAutoNavigate from '@renderer/hooks/autoNavigate/useChampionDetailPageAutoNavigate'
import useInGamePageAutoNavigate from '@renderer/hooks/autoNavigate/useInGamePageAutoNavigate'
import useTierListPageAutoNavigate from '@renderer/hooks/autoNavigate/useTierListPageAutoNavigate'
import useAppStateListener from '@renderer/hooks/listener/useAppStateListener'
import useAppUpdateListener from '@renderer/hooks/listener/useAppUpdateListener'
import useChampionSelectSessionListener from '@renderer/hooks/listener/useChampionSelectSessionListener'
import useCurrentSummonerListener from '@renderer/hooks/listener/useCurrentSummonerListener'
import { useUpdateContentModal } from '@renderer/hooks/useUpdateContentModal'
import { InitGlobalStyled } from '@renderer/styles/init'

const noLayoutPaths = [/\/windows\/.+/, /\/overlays\/.+/]

const App = () => {
  const { pathname } = useLocation()

  const isNoLayout = noLayoutPaths.some(path => path.test(pathname))

  useUpdateContentModal({ autoOpen: !isNoLayout })

  // listeners
  useAppStateListener()
  useAppUpdateListener()
  useChampionSelectSessionListener()
  useCurrentSummonerListener()

  // auto navigate
  useTierListPageAutoNavigate()
  useInGamePageAutoNavigate()
  useChampionDetailPageAutoNavigate()

  return (
    <>
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
    </>
  )
}

export default App
