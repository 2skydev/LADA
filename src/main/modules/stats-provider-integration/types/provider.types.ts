import { STATS_PROVIDERS } from '@main/modules/stats-provider-integration/stats-provider-integration.constants'

export type StatsProvider = (typeof STATS_PROVIDERS)[number]
