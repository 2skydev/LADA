import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Divider, Space, Tag } from 'antd'
import clsx from 'clsx'
import dayjs from 'dayjs'
import { match, P } from 'ts-pattern'

import { NO_DIVISION_TIERS } from '@main/modules/league/constants/rank'
import { PSInGame } from '@main/modules/ps/types/stat'

import ChampionImage from '@renderer/features/asset/ChampionImage'
import ChampionProfileSmall from '@renderer/features/asset/ChampionProfileSmall/ChampionProfileSmall'
import DataDragonImage from '@renderer/features/asset/DataDragonImage/DataDragonImage'
import LaneIcon from '@renderer/features/asset/LaneIcon/LaneIcon'
import RankIcon from '@renderer/features/asset/RankIcon/RankIcon'
import InGameNotFound from '@renderer/features/inGame/InGameNotFound/InGameNotFound'
import RuneIcon from '@renderer/features/rune/RuneIcon/RuneIcon'
import useAPI from '@renderer/hooks/useAPI'
import useDataDragonChampNames from '@renderer/hooks/useDataDragonChampNames'
import useDataDragonSummonerSpells from '@renderer/hooks/useDataDragonSummonerSpells'

import { InGameInfoStyled } from './styled'

export interface InGameInfoProps {
  className?: string
  summonerPsId: string
}

const GameTime = ({ gameStartTime }: { gameStartTime: number }) => {
  const [time, setTime] = useState(dayjs().diff(gameStartTime))

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(dayjs().diff(gameStartTime))
    }, 1000)

    return () => clearInterval(interval)
  }, [gameStartTime])

  return <>{dayjs(time).format('mm:ss')}</>
}

const InGameInfo = ({ className, summonerPsId }: InGameInfoProps) => {
  const { data, isValidating, mutate: reload } = useAPI<PSInGame>('ps', `/in-game/${summonerPsId}`)

  const navigate = useNavigate()
  const summonerSpells = useDataDragonSummonerSpells()
  const champNames = useDataDragonChampNames()

  const openExternalSearchPage = (summonerName: string) => {
    window.open(`https://lol.ps/summoner/${encodeURIComponent(summonerName)}?region=kr`)
  }

  const moveChampionDetailPage = (championId: number) => {
    navigate(`/champ/${championId}`)
  }

  return (
    <InGameInfoStyled className={clsx('InGameInfo', className)}>
      {data && summonerSpells && champNames && (
        <>
          <header>
            <h2>인게임 정보</h2>

            <Space className="summaryProperties">
              <Tag>개인/2인 랭크</Tag>

              <Tag>
                평균 {data.avgRankInfo.tier}{' '}
                {!NO_DIVISION_TIERS.includes(data.avgRankInfo.tier) && data.avgRankInfo.division}{' '}
                <span style={{ opacity: 0.6 }}>-</span> {data.avgRankInfo.lp}LP
              </Tag>

              <Tag>
                <GameTime gameStartTime={data.gameStartTime} /> 게임중
              </Tag>
            </Space>
          </header>

          <div className="teams">
            {[data.myTeam, data.enemyTeam].map(team => (
              <div className={clsx('team', team === data.myTeam && 'myTeam')} key={team}>
                <div className="header">
                  <div className="title">{team === data.myTeam ? '아군' : '적군'}</div>
                  <div className="title">랭크 통계</div>
                  <div className="title">PS Score</div>
                  <div className="title">룬 빌드</div>
                </div>

                {data[team].players.map(player => {
                  const kdaClassName = match(player.championStat.kda)
                    .with(
                      P.when(kda => kda >= 3),
                      () => 'green',
                    )
                    .otherwise(() => '')

                  const seasonWinRateClassName = match(+player.seasonStat.winRate.toFixed(0))
                    .with(
                      P.when(winRate => winRate >= 55),
                      () => 'green',
                    )
                    .otherwise(() => '')

                  return (
                    <div className="item" key={player.summonerPsId}>
                      <div
                        className={clsx('player', player.summonerPsId === summonerPsId && 'self')}
                      >
                        <div className="playerSummary">
                          <div className="top">
                            <div className="spells">
                              <DataDragonImage
                                type="spell"
                                filename={summonerSpells[player.spellIds[0]].en}
                              />
                              <DataDragonImage
                                type="spell"
                                filename={summonerSpells[player.spellIds[1]].en}
                              />
                            </div>

                            <div
                              className="championProfile"
                              onClick={() => moveChampionDetailPage(player.championId)}
                            >
                              <ChampionProfileSmall championId={player.championId} />

                              <div className="laneIconContainer">
                                <LaneIcon laneId={player.laneId} />
                              </div>
                            </div>

                            <div className="summaryText">
                              <div className="summonerName">
                                <span onClick={() => openExternalSearchPage(player.summonerName)}>
                                  <i className="bx bx-link"></i>
                                  {player.summonerName}
                                </span>
                              </div>

                              <div className="championStat">
                                <div>
                                  {player.championStat.gameCount} 게임{' '}
                                  <span
                                    className={clsx(
                                      'winRate',
                                      player.championStat.winRate > 60 && 'high',
                                    )}
                                  >
                                    {player.championStat.winRate.toFixed(0)}%
                                  </span>
                                </div>

                                <Divider type="vertical" />

                                <div className="kda">
                                  KDA{' '}
                                  <span className={clsx('value', kdaClassName)}>
                                    {player.championStat.kda.toFixed(2)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="bottom">
                            <div className="recentMatches">
                              {player.recentMatches.map((match, index) => (
                                <div
                                  className={clsx('item', match.isWin && 'win')}
                                  key={`${index}.${match.championId}`}
                                >
                                  <ChampionImage championId={match.championId} />
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="seasonStat">
                          <div className="top">
                            <RankIcon rank={player.tier} />

                            <div className="tier">
                              {player.tier[0]}
                              {player.division} <span>-</span> {player.lp} LP
                            </div>
                          </div>

                          <div className="bottom">
                            <div className={clsx('winRate', seasonWinRateClassName)}>
                              {player.seasonStat.winRate.toFixed(0)}%
                            </div>
                            <div className="gameCount">{player.seasonStat.gameCount} 게임</div>
                          </div>
                        </div>

                        <div className={clsx('psScore', player.psScore > 50 && 'high')}>
                          {player.psScore.toFixed(0)}
                        </div>

                        <div className="runes">
                          <div className="main">
                            {player.runes.main.map((runeId, i) => (
                              <RuneIcon
                                key={runeId}
                                runeId={runeId}
                                size={i ? '26px' : '24px'}
                                largeImage={!i}
                                removeBorder
                              />
                            ))}
                          </div>

                          <div className="bottom">
                            <div className="sub">
                              {player.runes.sub.map(runeId => (
                                <RuneIcon key={runeId} runeId={runeId} size="26px" removeBorder />
                              ))}
                            </div>

                            <div className="shard">
                              {player.runes.shard.map((runeId, i) => (
                                <RuneIcon
                                  key={`${i}.${runeId}`}
                                  runeId={runeId}
                                  size="16px"
                                  imageOnly
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* <div className="tags">
                        <div className="left">
                          {player.tags &&
                            player.tags.map(tag => {
                              if (tag.tooltip) {
                                return (
                                  <Tooltip
                                    key={tag.label}
                                    title={tag.tooltip}
                                    placement="bottomLeft"
                                  >
                                    <Tag className={tag.color}>{tag.label}</Tag>
                                  </Tooltip>
                                )
                              } else {
                                return (
                                  <Tag key={tag.label} className={tag.color}>
                                    {tag.label}
                                  </Tag>
                                )
                              }
                            })}
                        </div>

                        <div className="right">
                          <Tag></Tag>
                        </div>
                      </div> */}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </>
      )}

      {!data && <InGameNotFound reload={reload} isLoading={isValidating} />}
    </InGameInfoStyled>
  )
}

export default InGameInfo
