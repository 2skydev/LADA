import { Log } from '../modules/developers';
import { AppControlAction } from '../modules/general';
import { UpdateEvent, UpdateStatus } from '../modules/update';
import { ConfigStoreValues } from '../stores/config';

export type APICategory = 'league' | 'ps';

export interface ElectronRendererContext {
  onUpdate: (callback: (event: UpdateEvent, data: any) => void) => void;

  initializeUpdater: () => void;
  appControl: (action: AppControlAction) => void;
  openExternal: (link: string) => void;
  checkForUpdate: () => void;
  quitAndInstall: () => void;

  getConfig: () => Promise<ConfigStoreValues>;
  setConfig: (config: ConfigStoreValues) => Promise<ConfigStoreValues>;

  getVersion: () => Promise<string>;
  getUpdaterStatus: () => Promise<UpdateStatus>;

  getStorePath: () => Promise<string>;
  getLogs: () => Promise<Log[]>;
  clearLogs: () => Promise<boolean>;

  apis: (category: APICategory, url: string, payload?: any) => Promise<any>;

  subscribeLeague: (path: string, callback: (data: any) => void) => void;
  unsubscribeLeague: (path: string) => void;

  off: (channel: string, listener: (...args: any[]) => void) => void;
}
