import { useEffect } from 'react'

import { useAtom } from 'jotai'

import { appUpdateAtom } from '@renderer/stores/atoms/appUpdate.atom'

const useAppUpdateListener = () => {
  const [appUpdate, setAppUpdate] = useAtom(appUpdateAtom)

  useEffect(() => {
    window.electron.onUpdate((event, data) => {
      setAppUpdate({
        ...appUpdate,
        status: {
          event,
          data,
          time: new Date().getTime(),
        },
      })
    })
  }, [])
}

export default useAppUpdateListener
