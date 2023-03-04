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

    const {
      data: { data },
    } = await axios.get(`https://lol.ps/api/champ/${id}/arguments.json`);

    const selectedLaneId = Number(laneId || data.laneId);
    const selectedTierId = Number(tierId || data.tierId);

    return data;
  });
};

export default PSModule;
