import { useEffect } from 'react'

import { useRecoilState } from 'recoil'

import { updateStore } from '@renderer/stores/update'

const useAppUpdateListener = () => {
  const [update, setUpdate] = useRecoilState(updateStore)

  useEffect(() => {
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
  }, [])
}

export default useAppUpdateListener
