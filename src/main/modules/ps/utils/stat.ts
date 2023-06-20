import { InGamePlayerTag } from '@main/modules/league/types/stat'
import { PSInGamePlayer } from '@main/modules/ps/types/stat'

export const getTagsByPSInGamePlayerData = (player: PSInGamePlayer) => {
  let tags: InGamePlayerTag[] = []

  const recentMatchesString = player.recentMatches.map(match => Number(match.isWin)).join('')
  const winStreak = recentMatchesString.match(/^1{3,}/)?.[0].length ?? 0
  const loseStreak = recentMatchesString.match(/^0{3,}/)?.[0].length ?? 0

  if (winStreak >= 3) {
    tags.push({
      color: 'green',
      label: `${winStreak}연승`,
    })
  }

  if (loseStreak >= 3) {
    tags.push({
      color: 'red',
      label: `${loseStreak}연패`,
    })
  }

  if (player.ganked >= 1) {
    tags.push({
      color: 'red',
      label: `갱킹맛집`,
      tooltip: `최근 10경기 평균 ${player.ganked.toFixed(1)}번 갱킹당했습니다.`,
    })
  }

  if (player.turrets >= 2) {
    tags.push({
      color: 'green',
      label: `철거왕`,
      tooltip: `최근 10경기 평균 ${player.turrets.toFixed(1)}개의 포탑을 철거했습니다.`,
    })
  }

  if (player.psScore > 65) {
    tags.push({
      color: 'green',
      label: '캐리후보',
      tooltip: `최근 10판 기준 PS 점수가 65점 이상입니다.`,
    })
  }

  if (player.psScore < 35) {
    tags.push({
      color: 'red',
      label: '상태나쁨',
      tooltip: `최근 10판 기준 PS 점수가 35점 이하입니다.`,
    })
  }

  tags.sort((a, b) => a.color.localeCompare(b.color))

  return tags
}
