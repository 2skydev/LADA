import { DEEP_LINK_HANDLE_METADATA } from '@main/core/constants'

export interface DeepLinkHandleMetadata {
  path: string
  handler: (params: object) => void
}

export function DeepLinkHandle(path: string) {
  return function (target: any, key: string, descriptor: PropertyDescriptor) {
    Reflect.defineMetadata(
      DEEP_LINK_HANDLE_METADATA,
      { path, handler: descriptor.value },
      target,
      key,
    )
  }
}
