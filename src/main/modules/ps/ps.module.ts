import { initializer, singleton } from '@launchtray/tsyringe-async'
import axios from 'axios'
import * as cheerio from 'cheerio'

import IPCServer from '@main/utils/IPCServer'

interface Version {
  id: number
  label: string
  date: string
}

const getLatestVersion = async (): Promise<Version> => {
  const { data: html } = await axios.get('https://lol.ps/statistics')
  const $ = cheerio.load(html)

  const [
    ,
    ,
    ,
    {
      data: {
        versionInfo: [latestVersion],
      },
    },
  ] = JSON.parse($('script[sveltekit\\:data-type="server_data"]').text())

  return {
    id: latestVersion.versionId,
    label: latestVersion.description,
    date: latestVersion.patchDate,
  }
}

@singleton()
export class PSModule {
  version: Version
  server: IPCServer

  constructor() {
    this.server = new IPCServer('apis/ps')

    this.server.add('/tiers/:lane', async ({ params }) => {
      const { lane } = params

      const {
        data: { data },
      } = await axios.get(`https://lol.ps/api/statistics/tierlist.json`, {
        params: {
          region: 0,
          version: this.version.id,
          tier: 2,
          lane: Number(lane),
        },
      })

      return data
    })

    this.server.add('/summoners', async ({ payload }) => {
      const { names = [] } = payload

      const promises = names.map((name: string) =>
        (async () => {
          const { data: html } = await axios.get(`https://lol.ps/summoner/${name}`)
          const $ = cheerio.load(html)

          const [
            ,
            ,
            ,
            {
              data: { summary },
            },
          ] = JSON.parse($('script[sveltekit\\:data-type="server_data"]').text())

          return summary
        })(),
      )

      return Promise.all(promises)
    })

    this.server.add('/champ/:id', async ({ params, payload }) => {
      const { id } = params
      const { laneId, tierId } = payload

      const {
        data: { data: champArguments },
      } = await axios.get(`https://lol.ps/api/champ/${id}/arguments.json`)

      const selectedLaneId = Number(laneId || champArguments.laneId)
      const selectedTierId = Number(tierId || champArguments.tierId)

      const {
        data: {
          data: { itemWinrates: item, spellWinrates: spell },
        },
      } = await axios.get(`https://lol.ps/api/champ/${id}/spellitem.json`, {
        params: {
          region: 0,
          version: this.version.id,
          tier: selectedTierId,
          lane: selectedLaneId,
        },
      })

      const {
        data: { data: skill },
      } = await axios.get(`https://lol.ps/api/champ/${id}/skill.json`, {
        params: {
          region: 0,
          version: this.version.id,
          tier: selectedTierId,
          lane: selectedLaneId,
        },
      })

      const {
        data: { data: runestatperk },
      } = await axios.get(`https://lol.ps/api/champ/${id}/runestatperk.json`, {
        params: {
          region: 0,
          version: this.version.id,
          tier: selectedTierId,
          lane: selectedLaneId,
        },
      })

      return { item, spell, skill, runestatperk }
    })
  }

  @initializer()
  async init() {
    this.version = await getLatestVersion()
  }
}
