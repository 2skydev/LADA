import axios from 'axios';
import * as cheerio from 'cheerio';

import { ModuleFunction } from '@app/app';
import IPCServer from '@app/utils/IPCServer';

interface Version {
  id: number;
  label: string;
  date: string;
}

const getLatestVersion = async (): Promise<Version> => {
  const { data: html } = await axios.get('https://lol.ps/statistics');
  const $ = cheerio.load(html);

  const [
    ,
    ,
    ,
    {
      data: {
        versionInfo: [latestVersion],
      },
    },
  ] = JSON.parse($('script[sveltekit\\:data-type="server_data"]').text());

  return {
    id: latestVersion.versionId,
    label: latestVersion.description,
    date: latestVersion.patchDate,
  };
};

const PSModule: ModuleFunction = async () => {
  const version = await getLatestVersion();

  const server = new IPCServer('apis/ps');

  server.add('/tiers/:lane', async ({ params }) => {
    const { lane } = params;

    const {
      data: { data },
    } = await axios.get(`https://lol.ps/api/statistics/tierlist.json`, {
      params: {
        region: 0,
        version: version.id,
        tier: 2,
        lane: Number(lane),
      },
    });

    return data;
  });

  server.add('/summoners', async ({ payload }) => {
    const { names = [] } = payload;

    const promises = names.map((name: string) =>
      (async () => {
        const { data: html } = await axios.get(`https://lol.ps/summoner/${name}`);
        const $ = cheerio.load(html);

        const [
          ,
          ,
          ,
          {
            data: { summary },
          },
        ] = JSON.parse($('script[sveltekit\\:data-type="server_data"]').text());

        return summary;
      })(),
    );

    return Promise.all(promises);
  });

  server.add('/champ/:id', async ({ params, payload }) => {
    const { id } = params;
    const { laneId, tierId } = payload;

    const { data: html } = await axios.get(`https://lol.ps/champ/${id}`);
    const $ = cheerio.load(html);

    const [, , , { data: champData }] = JSON.parse(
      $('script[sveltekit\\:data-type="server_data"]').text(),
    );

    const selectedLaneId = Number(laneId || champData.championArguments.laneId);
    const selectedTierId = Number(tierId || champData.championArguments.tierId);

    const {
      data: {
        data: { itemWinrates: item, spellWinrates: spell },
      },
    } = await axios.get(`https://lol.ps/api/champ/${id}/spellitem.json`, {
      params: {
        region: 0,
        version: version.id,
        tier: selectedTierId,
        lane: selectedLaneId,
      },
    });

    const {
      data: { data: skill },
    } = await axios.get(`https://lol.ps/api/champ/${id}/skill.json`, {
      params: {
        region: 0,
        version: version.id,
        tier: selectedTierId,
        lane: selectedLaneId,
      },
    });

    const {
      data: { data: runestatperk },
    } = await axios.get(`https://lol.ps/api/champ/${id}/runestatperk.json`, {
      params: {
        region: 0,
        version: version.id,
        tier: selectedTierId,
        lane: selectedLaneId,
      },
    });

    return { item, spell, skill, runestatperk, champ: champData };
  });
};

export default PSModule;
