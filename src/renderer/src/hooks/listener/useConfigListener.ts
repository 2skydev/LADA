import { useEffect } from 'react'

import deepEqual from 'fast-deep-equal'
import { useSetAtom } from 'jotai'

import { defaultStore } from '@renderer/stores'
import { configAtom } from '@renderer/stores/atoms/config.atom'

const useConfigListener = () => {
  const setConfig = useSetAtom(configAtom)

  useEffect(() => {
    window.electron.onChangeConfigValue(value => {
      if (deepEqual(value, defaultStore.get(configAtom))) return
      setConfig(value)
    })
  }, [])
}

export default useConfigListener
