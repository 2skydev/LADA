import { useLocation } from 'react-router-dom'

import qs from 'qs'

const useQS = <ReturnValue extends Record<string, any> | null = null>(): ReturnValue extends Record<
  string,
  any
>
  ? ReturnValue
  : qs.ParsedQs => {
  const { search } = useLocation()

  return qs.parse(search, { ignoreQueryPrefix: true }) as ReturnValue extends Record<string, any>
    ? ReturnValue
    : qs.ParsedQs
}

export default useQS
