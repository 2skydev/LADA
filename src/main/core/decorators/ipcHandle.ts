import { IPC_HANDLE_METADATA } from '@main/core/constants'

export interface IPCHandleOptions {
  channel?: string
  type?: IPCHandleType
}

export interface IPCHandleMetadata {
  channel: string
  type: IPCHandleType
  handler: (...args: any[]) => any
}

export type IPCHandleType = 'handle' | 'handleOnce' | 'on' | 'once'

export function IPCHandle(options: IPCHandleOptions = {}) {
  return function (target: any, key: string, descriptor: PropertyDescriptor) {
    const { channel = key, type = 'handle' } = options

    Reflect.defineMetadata(
      IPC_HANDLE_METADATA,
      { channel, type, handler: descriptor.value },
      target,
      key,
    )
  }
}
