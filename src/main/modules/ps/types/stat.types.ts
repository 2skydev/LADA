import { InGame, InGamePlayer, InGameTeam } from '@main/modules/league/types/stat.types'

export interface PSInGame extends InGame {
  red: PSInGameTeam
  blue: PSInGameTeam
}

export interface PSInGameTeam extends InGameTeam {
  players: PSInGamePlayer[]
}

export interface PSInGamePlayer extends InGamePlayer {
  summonerPsId: string
  psScore: number
  ganked: number
  turrets: number
}
