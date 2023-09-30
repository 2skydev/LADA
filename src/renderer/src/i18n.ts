import dayjs from 'dayjs'

export const antdLocaleResolvers = {
  en_US: async () => {},
  ko_KR: async () => (await import('antd/lib/locale/ko_KR')).default,
}

export const dayjsLocaleResolvers = {
  en_US: async () => {},
  ko_KR: async () => {
    await import('dayjs/locale/ko')
    dayjs.locale('ko')
  },
}
