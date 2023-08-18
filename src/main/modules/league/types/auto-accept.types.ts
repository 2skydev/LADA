export interface AutoAcceptEvent {
  timer?: number
  autoAcceptDelaySeconds?: number
  playerResponse: 'None' | 'Accepted' | 'Declined'
}
