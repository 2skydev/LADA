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

  server.add('/tiers/:lane', async ({ params, payload }) => {
    const { lane } = params;
    const { rankRangeId = 2 } = payload;

    const {
      data: { data },
    } = await axios.get(`https://lol.ps/api/statistics/tierlist.json`, {
      params: {
        region: 0,
        version: version.id,
        tier: rankRangeId,
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
    let { laneId, rankRangeId = 2 } = payload;

    // 선택한 라인이 없다면 챔피언의 기본 라인을 가져오기
    if (laneId === null || laneId === undefined) {
      const {
        data: { data: champArgs },
      } = await axios.get(`https://lol.ps/api/champ/${id}/arguments.json`);
      laneId = champArgs.laneId;
    }

    laneId = Number(laneId);
    rankRangeId = Number(rankRangeId);

    const {
      data: { data: summary },
    } = await axios.get(`https://lol.ps/api/champ/${id}/summary.json`, {
      params: {
        region: 0,
        version: version.id,
        tier: rankRangeId,
        lane: laneId,
      },
    });

    const {
      data: {
        data: { itemWinrates: item, spellWinrates: spell },
      },
    } = await axios.get(`https://lol.ps/api/champ/${id}/spellitem.json`, {
      params: {
        region: 0,
        version: version.id,
        tier: rankRangeId,
        lane: laneId,
      },
    });

    const {
      data: { data: skill },
    } = await axios.get(`https://lol.ps/api/champ/${id}/skill.json`, {
      params: {
        region: 0,
        version: version.id,
        tier: rankRangeId,
        lane: laneId,
      },
    });

    const {
      data: { data: runestatperk },
    } = await axios.get(`https://lol.ps/api/champ/${id}/runestatperk.json`, {
      params: {
        region: 0,
        version: version.id,
        tier: rankRangeId,
        lane: laneId,
      },
    });

    const {
      data: {
        data: { timelineWinrates },
      },
    } = await axios.get(`https://lol.ps/api/champ/${id}/graphs.json`, {
      params: {
        region: 0,
        version: version.id,
        tier: rankRangeId,
        lane: laneId,
      },
    });

    const {
      data: { data: versus },
    } = await axios.get(`https://lol.ps/api/champ/${id}/versus.json`, {
      params: {
        region: 0,
        version: version.id,
        tier: rankRangeId,
        lane: laneId,
      },
    });

    const counterChampionIdList = JSON.parse(versus.counterChampionIdList);
    const counterWinrateList = JSON.parse(versus.counterWinrateList);

    interface CounterChampions {
      up: { champId: number; winrate: number }[];
      down: { champId: number; winrate: number }[];
    }

    const counterChampions: CounterChampions = counterChampionIdList.reduce(
      (acc: CounterChampions, champId: number, index: number) => {
        const winrate = counterWinrateList[index];

        acc[winrate > 50 ? 'up' : 'down'].push({ champId, winrate });

        return acc;
      },
      { up: [], down: [] },
    );

    counterChampions.down.sort((a, b) => a.winrate - b.winrate);
    counterChampions.up.sort((a, b) => b.winrate - a.winrate);

    return { item, spell, skill, runestatperk, summary, timelineWinrates, counterChampions };
  });
};

export default PSModule;
