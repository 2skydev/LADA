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
};

export default PSModule;
