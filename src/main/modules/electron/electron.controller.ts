import { Injectable } from '@nestjs/common'

import type { ConfigStoreValues } from '@main/modules/config/config.store'
import { IPCHandle } from '@main/modules/electron/decorators/ipc-handle.decorator'
import { IPCSender } from '@main/modules/electron/decorators/ipc-sender.decorator'
import { ELECTRON_MAIN_WINDOW_KEY } from '@main/modules/electron/electron.constants'
import { ElectronService } from '@main/modules/electron/electron.service'
import type { AppControlAction } from '@main/modules/electron/types/app-control.type'

@Injectable()
export class ElectronController {
  constructor(private electronService: ElectronService) {}

  @IPCHandle({ type: 'on' })
  public appControl(action: AppControlAction) {
    this.electronService.appControl(action)
  }

  @IPCSender({
    windowKeys: [ELECTRON_MAIN_WINDOW_KEY],
  })
  public onNeedUpdateLater() {}

  @IPCSender({
    windowKeys: [ELECTRON_MAIN_WINDOW_KEY],
  })
  public onChangeConfigValue(value: ConfigStoreValues) {
    return value
  }
}
