import { app } from 'electron'

import { Injectable } from '@nestjs/common'

import { IPCHandle } from '@main/modules/electron/decorators/ipc-handle.decorator'
import { UpdateService } from '@main/modules/update/update.service'

@Injectable()
export class UpdateController {
  constructor(private readonly updateService: UpdateService) {}

  @IPCHandle()
  public getVersion() {
    return app.getVersion()
  }

  @IPCHandle()
  public getUpdateStatus() {
    return this.updateService.status
  }

  @IPCHandle()
  public async checkForUpdate() {
    return this.updateService.checkForUpdates()
  }

  @IPCHandle({ type: 'on' })
  public quitAndInstall() {
    this.updateService.quitAndInstall()
  }
}
