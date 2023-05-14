import { ipcMain } from 'electron'

import { container } from '@launchtray/tsyringe-async'
import { constructor } from '@launchtray/tsyringe-async/dist/typings/types'

import { DEEP_LINK_HANDLE_METADATA, IPC_HANDLE_METADATA } from '@main/core/constants'
import { DeepLinkHandleMetadata } from '@main/core/decorators/deepLinkHandle'
import { IPCHandleMetadata } from '@main/core/decorators/ipcHandle'
import { AppModule } from '@main/modules/app/app.module'

export class AppFactoryStatic {
  modules: constructor<object>[] = []
  appModule: InstanceType<typeof AppModule>

  async create(_AppModule: typeof AppModule, modules: constructor<object>[]) {
    this.appModule = await container.resolve(_AppModule)
    this.modules = [_AppModule, ...modules]

    await this.createInstances()

    return this.appModule
  }

  private async createInstances() {
    for (const module of this.modules) {
      const instance = await container.resolve(module)
      this.resolveMetadatas(instance)
    }
  }

  private resolveMetadatas(instance: object) {
    Object.getOwnPropertyNames(instance.constructor.prototype).forEach(propertyName => {
      this.resolveIpcHandler(instance, propertyName)
      this.resolveDeepLinkHandler(instance, propertyName)
    })
  }

  private resolveIpcHandler(instance: object, propertyName: string) {
    const metadata: IPCHandleMetadata | undefined = Reflect.getMetadata(
      IPC_HANDLE_METADATA,
      instance,
      propertyName,
    )

    if (!metadata) return

    ipcMain[metadata.type](metadata.channel, (_, ...args) => metadata.handler.apply(instance, args))
  }

  private resolveDeepLinkHandler(instance: object, propertyName: string) {
    const metadata: DeepLinkHandleMetadata | undefined = Reflect.getMetadata(
      DEEP_LINK_HANDLE_METADATA,
      instance,
      propertyName,
    )

    if (!metadata) return

    this.appModule.deepLinkHandlers[metadata.path] = metadata.handler.bind(instance)
  }
}

export const AppFactory = new AppFactoryStatic()
