import { app } from 'electron';
import Store from 'electron-store';

import AutoLaunch from 'auto-launch';

const IS_DEV = process.env.NODE_ENV === 'development';

export interface ConfigStoreValues {
  general: {
    autoLaunch: boolean;
    developerMode: boolean;
  };
  game: {
    autoAccept: boolean;
  };
}

export const configStore = new Store<ConfigStoreValues>({
  name: 'config',
  accessPropertiesByDotNotation: false,
  defaults: {
    general: {
      autoLaunch: false,
      developerMode: IS_DEV,
    },
    game: {
      autoAccept: false,
    },
  },
});

configStore.onDidChange('general', async (newValue, oldValue) => {
  if (newValue?.autoLaunch === oldValue?.autoLaunch) return;
  if (newValue?.autoLaunch === undefined) return;

  const ladaAutoLauncher = new AutoLaunch({
    name: 'LADA',
    path: app.getPath('exe'),
  });

  const isEnabled = await ladaAutoLauncher.isEnabled();

  if (isEnabled === newValue.autoLaunch || (!isEnabled && !newValue.autoLaunch)) return;

  ladaAutoLauncher[newValue.autoLaunch ? 'enable' : 'disable']();
});
