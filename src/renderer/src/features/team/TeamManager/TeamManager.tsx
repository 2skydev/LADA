import { Fragment, useEffect, useMemo, useState } from 'react'

import { Button, Divider, Result } from 'antd'
import clsx from 'clsx'
import { motion } from 'framer-motion'
import { random } from 'lodash'

import { PICK_TYPE_TO_LABEL_MAP } from '@main/modules/league/league.constants'
import { Lobby } from '@main/modules/league/types/lobby.types'

import RankIcon from '@renderer/features/asset/RankIcon'
import useAPI from '@renderer/hooks/useAPI'

import { TeamManagerStyled } from './styled'

export interface TeamManagerProps {
  className?: string
}

const ANIMATE_DELAY = 0.1

const createKey = (lobby: Lobby | null | undefined) => {
  if (!lobby) return ''

  const allSummoners = [...lobby.summoners, ...lobby.spectators]

  return allSummoners
    .map(summoner => summoner.id)
    .sort()
    .join('.')
}

const TeamManager = ({ className }: TeamManagerProps) => {
  const [result, setResult] = useState<Lobby['teams'] | null>(null)

  const { data: lobby, mutate } = useAPI('getLobby')

  const key = createKey(lobby)

  const summonerNames = useMemo(
    () => (lobby ? lobby.summoners.map(summoner => summoner.name) : []),
    [key],
  )

  const { data: summoners = [] } = useAPI('getSummonerStatsListByNames', {
    params: [summonerNames],
  })

  const createRandomTeam = () => {
    const summoners = lobby!.summoners
    const teams: Lobby['teams'] = [[], []]

    summoners.forEach(summoner => {
      const teamIndex = random(0, 1)

      if (teams[teamIndex].length === 5) {
        teams[teamIndex === 0 ? 1 : 0].push(summoner)
        return
      }

      teams[teamIndex].push(summoner)
    })

    setResult(teams)
  }

  useEffect(() => {
    if (lobby) {
      setResult(null)
    }
  }, [lobby])

  useEffect(() => {
    const unsubscribe = window.electron.onChangeLobby(data => {
      if (!result || (result && key !== createKey(data))) {
        mutate()
      }
    })

    return () => {
      unsubscribe()
    }
  }, [key, result])

  return (
    <TeamManagerStyled className={clsx('TeamManager', className)}>
      {(!lobby || !lobby.isCustom) && (
        <Result
          status="warning"
          title="사용자 설정 게임을 생성해주세요."
          extra="게임시작 > 사용자 설정 게임 생성 > 소환사의 협곡으로 생성해주세요."
        />
      )}

      {lobby?.isCustom && (
        <>
          <header>
            <h2>{lobby.title}</h2>
            <p>소환사의 협곡 · 5대5 · {PICK_TYPE_TO_LABEL_MAP[lobby.pickType!]}</p>
          </header>

          <div className="teams">
            {[0, 1].map(teamNumber => {
              const teamSummoners = result ? result[teamNumber] : lobby.teams[teamNumber]

              return (
                <div className="team" key={teamNumber}>
                  <h3>{teamNumber + 1}팀</h3>

                  <div className="members">
                    {teamSummoners.map((summoner, i: number) => {
                      const summonerStats = summoners.find(
                        summonerStats => summonerStats?.name === summoner.name,
                      )

                      return (
                        <Fragment key={summoner.id}>
                          <motion.div
                            className="member"
                            key={`${summoner.id}-${Date.now()}`}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                              delay:
                                ANIMATE_DELAY * i +
                                ANIMATE_DELAY *
                                  Math.min(lobby.summoners.length - 1, 4) *
                                  teamNumber,
                            }}
                          >
                            <img src={summoner.profileIcon} />

                            <span>{summoner.name}</span>

                            {summonerStats && (
                              <div className="rankProfile">
                                <span className="tier">{summonerStats.tier}</span>
                                <span className="division">{summonerStats.division}</span>
                                <RankIcon tier={summonerStats.tier} />
                              </div>
                            )}
                          </motion.div>

                          <Divider />
                        </Fragment>
                      )
                    })}

                    {Array(5 - teamSummoners.length)
                      .fill('')
                      .map((_, i) => (
                        <Fragment key={i}>
                          <div className="member">
                            <span className="emptyText">비어있음</span>
                          </div>

                          <Divider />
                        </Fragment>
                      ))}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="buttons">
            <Button onClick={createRandomTeam}>팀 추첨</Button>

            <Button
              danger
              onClick={() => {
                setResult(null)
              }}
            >
              초기화
            </Button>
          </div>
        </>
      )}
    </TeamManagerStyled>
  )
}

export default TeamManager
