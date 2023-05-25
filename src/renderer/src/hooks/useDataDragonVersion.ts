import useSWRImmutable from 'swr/immutable'

const useDataDragonVersion = (): string | null => {
  const { data } = useSWRImmutable('getLeagueVersion', () => {
    return window.electron.getLeagueVersion()
  })

  return data || null
}

export default useDataDragonVersion
