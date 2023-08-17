import { Injectable } from '@nestjs/common'

import { IPCHandle } from '@main/modules/electron/decorators/ipc-handle.decorator'
import { ElectronService } from '@main/modules/electron/electron.service'
import type { AppControlAction } from '@main/modules/electron/types/app-control.type'

@Injectable()
export class ElectronController {
  constructor(private electronService: ElectronService) {}

  @IPCHandle({ type: 'on' })
  public appControl(action: AppControlAction) {
    this.electronService.appControl(action)
  }
}
