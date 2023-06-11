import { useEffect, useState } from 'react'

import { Space, Tag } from 'antd'
import clsx from 'clsx'
import dayjs from 'dayjs'
import { match, P } from 'ts-pattern'

import { NO_DIVISION_TIERS } from '@main/modules/league/constants/rank'
import { PSInGame } from '@main/modules/ps/types/stat'

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

const InGameInfo = ({ className }: InGameInfoProps) => {
  const id = `WCAHmkojm4tAo62gOjGBn-DfMoAp4e47xM5ElrI4zaajex3b1oBZrl_5bg`
  // const { data, isValidating, mutate: reload } = useAPI<PSInGame>('ps', `/in-game/${summonerPsId}`)
  const { data, isValidating, mutate: reload } = useAPI<PSInGame>('ps', `/in-game/${id}`)

  const summonerSpells = useDataDragonSummonerSpells()
  const champNames = useDataDragonChampNames()

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
                {NO_DIVISION_TIERS.includes(data.avgRankInfo.tier) && `${data.avgRankInfo.lp}LP`}
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
                  <div className="title">아군</div>
                  <div className="title">랭크 통계</div>
                  <div className="title">최근 통계</div>
                  <div className="title">룬 빌드</div>
                </div>

                {data[team].players.map(player => {
                  const kdaClassName = match(player.championStat.kda)
                    .with(
                      P.when(kda => kda >= 3 && kda < 5),
                      () => 'green',
                    )
                    .with(
                      P.when(kda => kda >= 5),
                      () => 'orange',
                    )
                    .otherwise(() => '')

                  return (
                    <div
                      className={clsx('player', player.summonerPsId === id && 'self')}
                      key={player.summonerPsId}
                    >
                      <div className="playerSummary">
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

                        <div className="championProfile">
                          <ChampionProfileSmall championId={player.championId} />

                          <div className="laneIconContainer">
                            <LaneIcon laneId={player.laneId} />
                          </div>
                        </div>

                        <div className="summaryText">
                          <div className="summonerName">{player.summonerName}</div>
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

                            <div className="kda">
                              KDA{' '}
                              <span className={clsx('value', kdaClassName)}>
                                {player.championStat.kda.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="seasonStat">
                        <div className="left">
                          <RankIcon rank={player.tier} />

                          <div className="tier">
                            {player.tier[0]}
                            {player.division}
                          </div>
                        </div>

                        <div className="right">
                          <div className="winRate">{player.seasonStat.winRate.toFixed(0)}%</div>
                          <div className="gameCount">{player.seasonStat.gameCount} 게임</div>
                        </div>
                      </div>

                      <div className="psScore">{player.psScore.toFixed(0)}</div>

                      <div className="runes">
                        <div className="main">
                          {player.runes.main.map(runeId => (
                            <RuneIcon key={runeId} runeId={runeId} size="20px" removeBorder />
                          ))}
                        </div>

                        <div className="sub">
                          {player.runes.sub.map(runeId => (
                            <RuneIcon key={runeId} runeId={runeId} size="20px" removeBorder />
                          ))}
                        </div>

                        <div className="shard">
                          {player.runes.shard.map((runeId, i) => (
                            <RuneIcon
                              key={`${i}.${runeId}`}
                              runeId={runeId}
                              size="20px"
                              removeBorder
                            />
                          ))}
                        </div>
                      </div>
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
