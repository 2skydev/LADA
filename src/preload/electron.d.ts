import type { ElectronContext } from './index'

declare global {
  interface Window {
    electron: ElectronContext
  }
}
