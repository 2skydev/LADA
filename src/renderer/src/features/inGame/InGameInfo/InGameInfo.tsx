import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { Button, Divider, Result, Space, Tag } from 'antd'
import clsx from 'clsx'
import dayjs from 'dayjs'
import { useAtomValue } from 'jotai'
import { match, P } from 'ts-pattern'

import { NO_DIVISION_TIERS } from '@main/modules/league/league.constants'

import ChampionProfileSmall from '@renderer/features/champion/ChampionProfileSmall'
import LaneIcon from '@renderer/features/lane/LaneIcon'
import RankIcon from '@renderer/features/rank/RankIcon'
import RuneIcon from '@renderer/features/rune/RuneIcon'
import useAPI from '@renderer/hooks/useAPI'
import { currentSummonerAtom } from '@renderer/stores/atoms/currentSummoner.atom'
import { leagueAtom } from '@renderer/stores/atoms/league.atom'

import * as Styled from './InGameInfo.styled'

export interface InGameInfoProps {
  className?: string
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

const InGameInfo = ({ className }: InGameInfoProps) => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'renderer.stats.inGame',
  })

  const summoner = useAtomValue(currentSummonerAtom)
  const { isInGame } = useAtomValue(leagueAtom)

  const {
    data,
    isValidating,
    mutate: reload,
  } = useAPI('getInGameByCurrentSummoner', {
    disabled: !summoner || !isInGame,
  })

  const navigate = useNavigate()

  const openExternalSearchPage = (summonerName: string) => {
    window.open(`https://lol.ps/summoner/${encodeURIComponent(summonerName)}?region=kr`)
  }

  const moveChampionDetailPage = (championId: number) => {
    navigate(`/champions/${championId}`)
  }

  return (
    <Styled.Root className={clsx('InGameInfo', className)}>
      {data && summoner && (
        <>
          <header>
            <h2>{t('title')}</h2>

            <Space className="summaryProperties">
              <Tag>{t('tags.gameType')}</Tag>

              <Tag>
                {data.avgRankInfo.tier && (
                  <>
                    {t('tags.avg')} {data.avgRankInfo.tier}{' '}
                    {!NO_DIVISION_TIERS.includes(data.avgRankInfo.tier) &&
                      data.avgRankInfo.division}{' '}
                    <span style={{ opacity: 0.6 }}>-</span> {data.avgRankInfo.lp}LP
                  </>
                )}

                {!data.avgRankInfo.tier && t('tags.avgNotFound')}
              </Tag>

              <Tag>
                <GameTime gameStartTime={data.gameStartTime} /> {t('tags.playing')}
              </Tag>
            </Space>
          </header>

          <div className="teams">
            {[data.myTeam, data.enemyTeam].map(team => (
              <div className={clsx('team', team === data.myTeam && 'myTeam')} key={team}>
                <div className="header">
                  <div className="title">{team === data.myTeam ? t('myTeam') : t('enemyTeam')}</div>
                  <div className="title">{t('rankStats')}</div>
                  <div className="title">{t('score')}</div>
                  <div className="title">{t('runeBuild')}</div>
                </div>

                {data[team].players.map(player => {
                  const kdaClassName = match(player.championStats.kda)
                    .with(
                      P.when(kda => kda >= 3),
                      () => 'green',
                    )
                    .otherwise(() => '')

                  const seasonWinRateClassName = match(+player.seasonStats.winRate.toFixed(0))
                    .with(
                      P.when(winRate => winRate >= 55),
                      () => 'green',
                    )
                    .otherwise(() => '')

                  return (
                    <div className="item" key={player.summonerPsId}>
                      <div
                        className={clsx('player', player.summonerName === summoner.name && 'self')}
                      >
                        <div className="playerSummary">
                          <div className="top">
                            <div className="spells">
                              <img src={player.spells[0].image} />
                              <img src={player.spells[1].image} />
                            </div>

                            <div
                              className="championProfile"
                              onClick={() => moveChampionDetailPage(player.champion.id)}
                            >
                              <ChampionProfileSmall championId={player.champion.id} />

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

                              <div className="championStats">
                                <div>
                                  {player.championStats.gameCount} {t('game')}{' '}
                                  <span
                                    className={clsx(
                                      'winRate',
                                      player.championStats.winRate > 60 && 'high',
                                    )}
                                  >
                                    {player.championStats.winRate.toFixed(0)}%
                                  </span>
                                </div>

                                <Divider type="vertical" />

                                <div className="kda">
                                  KDA{' '}
                                  <span className={clsx('value', kdaClassName)}>
                                    {player.championStats.kda.toFixed(2)}
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
                                  key={`${index}.${match.champion.id}`}
                                >
                                  <img src={match.champion.imageFormats.small} />
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="seasonStats">
                          <div className="top">
                            <RankIcon tier={player.tier} />

                            <div className="tier">
                              {player.tier[0]}
                              {player.division} <span>-</span> {player.lp} LP
                            </div>
                          </div>

                          <div className="bottom">
                            <div className={clsx('winRate', seasonWinRateClassName)}>
                              {player.seasonStats.winRate.toFixed(0)}%
                            </div>
                            <div className="gameCount">
                              {player.seasonStats.gameCount} {t('game')}
                            </div>
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

      {!data && (
        <Result
          status="warning"
          title={t('notFound.title')}
          extra={
            <>
              {t('notFound.description')}
              <br />
              <br />
              <Button onClick={() => reload()} loading={isValidating}>
                {t('notFound.reload')}
              </Button>
            </>
          }
        />
      )}
    </Styled.Root>
  )
}

export default InGameInfo
