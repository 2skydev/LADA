import { ipcMain } from 'electron';

import { match } from 'path-to-regexp';

interface IPCServerRequest {
  params: Record<string, string>;
}

type Resolver = (request: IPCServerRequest) => void;

class IPCServer {
  public resolvers: Map<string, Resolver> = new Map();

  constructor(channel: string) {
    ipcMain.handle(channel, (_, url: string) => this.handler(url));
  }

  private async handler(url: string) {
    for (let [path, resolver] of this.resolvers.entries()) {
      const data = match(path)(url);

      if (!data) continue;

      const response = await resolver({
        params: data.params as Record<string, string>,
      });

      return response;
    }
  }

  public add(url: string, resolver: Resolver) {
    this.resolvers.set(url, resolver);
  }
}

export default IPCServer;
