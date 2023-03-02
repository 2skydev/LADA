import { ModuleFunction } from '@app/app';
import { configStore } from '@app/stores/config';
import IPCServer from '@app/utils/IPCServer';

import LeagueAPIClient from './leagueAPIClient';

const LeagueModule: ModuleFunction = async context => {
  const server = new IPCServer('apis/league');
  const client = new LeagueAPIClient();

  server.add('/is-ready', async () => client.isReady());

  server.add('/summoner/current', async () => {
    const data = await client.request({
      method: 'GET',
      url: '/lol-summoner/v1/current-summoner',
    });

    return data;
  });

  client.on('connect', () => {
    context.window?.webContents.send('league/connect');
    context.window?.webContents.send('league/connect-change', 'connect');
  });

  client.on('disconnect', () => {
    context.window?.webContents.send('league/disconnect');
    context.window?.webContents.send('league/connect-change', 'disconnect');
  });

  client.on('ready', () => {
    context.window?.webContents.send('league/connect-change', 'connect');

    client.subscribe('/lol-champ-select/v1/session', data => {
      context.window?.webContents.send('league/room/session', data);
    });

    client.subscribe('/lol-summoner/v1/current-summoner', data => {
      context.window?.webContents.send('league/summoner/current', data);
    });

    client.subscribe('/lol-matchmaking/v1/ready-check', async data => {
      if (data.playerResponse === 'None' && configStore.get('game.autoAccept')) {
        await client.request({
          method: 'POST',
          url: '/lol-matchmaking/v1/ready-check/accept',
        });
      }
    });
  });
};

export default LeagueModule;
