import { BrowserWindow } from 'electron';
import { OverlayController, OVERLAY_WINDOW_OPTS } from 'electron-overlay-window';

import { ModuleFunction } from '@app/app';
import { configStore } from '@app/stores/config';
import IPCServer from '@app/utils/IPCServer';

import LeagueAPIClient from './leagueAPIClient';

const LeagueModule: ModuleFunction = async context => {
  const server = new IPCServer('apis/league');
  const client = new LeagueAPIClient();

  server.add('/is-ready', async () => client.isReady());

  server.add('/summoner/current', async () => {
    const res = await client.request({
      method: 'GET',
      url: '/lol-summoner/v1/current-summoner',
    });

    return res.json();
  });

  server.add('/lobby', async () => {
    const res = await client.request({
      method: 'GET',
      url: '/lol-lobby/v2/lobby',
    });

    return res.json();
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
    const clientOverlay = new BrowserWindow({
      ...OVERLAY_WINDOW_OPTS,
      webPreferences: {
        preload: context.PRELOAD_PATH,
      },
    });

    clientOverlay.loadURL('http://localhost:3000/#/overlays/client');

    OverlayController.attachByTitle(clientOverlay, 'League of Legends');
    OverlayController.activateOverlay();

    context.window?.webContents.send('league/connect-change', 'connect');

    client.subscribe('/lol-champ-select/v1/session', data => {
      context.window?.webContents.send('league/room/session', data);
    });

    client.subscribe('/lol-summoner/v1/current-summoner', data => {
      context.window?.webContents.send('league/summoner/current', data);
    });

    client.subscribe('/lol-lobby/v2/lobby', data => {
      context.window?.webContents.send('league/lobby', data);
    });

    client.subscribe('/lol-matchmaking/v1/ready-check', async data => {
      console.log(data);

      if (data?.playerResponse === 'None') {
        const { autoAccept = false, autoAcceptDelaySeconds = 0 } = configStore.get('game');

        if (!autoAccept) return;
        if (data?.timer < autoAcceptDelaySeconds) return;

        context.window?.webContents.send('league/auto-accept', {
          timer: data.timer,
          playerResponse: data.playerResponse,
          autoAcceptDelaySeconds,
        });

        await client.request({
          method: 'POST',
          url: '/lol-matchmaking/v1/ready-check/accept',
        });
      } else {
        context.window?.webContents.send('league/auto-accept', {
          playerResponse: data.playerResponse,
        });
      }
    });
  });
};

export default LeagueModule;
