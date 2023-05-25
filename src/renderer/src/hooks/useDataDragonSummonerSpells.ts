import axios from 'axios'
import useSWRImmutable from 'swr/immutable'

import useDataDragonVersion from '@renderer/hooks/useDataDragonVersion'

const useDataDragonSummonerSpells = (): null | Record<string, { en: string; ko: string }> => {
  const version = useDataDragonVersion()

  const { data } = useSWRImmutable(
    version ? `https://ddragon.leagueoflegends.com/cdn/${version}/data/ko_KR/summoner.json` : null,
    async url => {
      const { data } = await axios.get(url)
      return data
    },
  )

  if (!data) return null

  return Object.values(data.data).reduce((acc: Record<string, any>, spell: any) => {
    return {
      ...acc,
      [spell.key]: { en: spell.id, ko: spell.name },
    }
  }, {})
}

export default useDataDragonSummonerSpells
