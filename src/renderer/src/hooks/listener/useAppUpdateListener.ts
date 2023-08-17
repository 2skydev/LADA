import { useEffect } from 'react'

import { useAtom } from 'jotai'

import { appUpdateAtom } from '@renderer/stores/atoms/appUpdate.atom'

const useAppUpdateListener = () => {
  const [appUpdate, setAppUpdate] = useAtom(appUpdateAtom)

  useEffect(() => {
    window.electron.onUpdate(status => {
      setAppUpdate({
        ...appUpdate,
        status,
      })
    })
  }, [])
}

export default useAppUpdateListener
