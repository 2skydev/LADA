import { Fragment } from 'react'
import { Controller } from 'react-hook-form'
import { useLocation } from 'react-router-dom'

import clsx from 'clsx'
import { motion } from 'framer-motion'
import QueryString from 'qs'

import LoadingIcon from '@renderer/components/LoadingIcon'
import DataDragonImage from '@renderer/features/asset/DataDragonImage'
import TierIcon, { HoneyIcon, OpIcon } from '@renderer/features/asset/TierIcon'
import LaneSelect from '@renderer/features/lane/LaneSelect'
import RankRangeSelect from '@renderer/features/rank/RankRangeSelect'
import RunePage from '@renderer/features/rune/RunePage'
import RuneStyleButtonRadioList from '@renderer/features/rune/RuneStyleButtonRadioList'
import useAPI from '@renderer/hooks/useAPI'
import { useCustomForm } from '@renderer/hooks/useCustomForm'
import useDataDragonChampNames from '@renderer/hooks/useDataDragonChampNames'
import useDataDragonSummonerSpells from '@renderer/hooks/useDataDragonSummonerSpells'

import { ChampDetailStyled } from './styled'

export interface ChampDetailProps {
  className?: string
  champId: number
}

interface RuneStyle {
  mainRuneIds: [number, number, number, number]
  subRuneIds: [number, number]
  winRate: number
  pickRate: number
  count: number
}

const ChampDetail = ({ className, champId }: ChampDetailProps) => {
  const { search } = useLocation()
  const { laneId: defaultLaneId } = QueryString.parse(search, { ignoreQueryPrefix: true })

  const form = useCustomForm({
    defaultValues: {
      laneId: defaultLaneId ? Number(defaultLaneId) : null,
      rankRangeId: 2,
      runeStyleId: 0,
    },
    onSubmit: () => {},
  })

  const laneId = form.watch('laneId')
  const rankRangeId = form.watch('rankRangeId')
  const selectedRuneStyleId = form.watch('runeStyleId')

  const champNames = useDataDragonChampNames()
  const summonerSpells = useDataDragonSummonerSpells()

  const { data, isValidating } = useAPI('ps', `/champ/${champId}`, {
    payload: {
      laneId,
      rankRangeId,
    },
  })

  const champSummary = data ? data.summary[0] : null
  const isNoData = data && (champSummary.spell1Id === null || !champSummary.skillMasterList.length)
  const runeStyles: RuneStyle[] = data
    ? data.runestatperk.runeWinrates.total.reduce((acc, item) => {
        acc.push({
          mainRuneIds: item.category1RuneIdList,
          subRuneIds: item.category2RuneIdList,
          winRate: item.winRate,
          pickRate: item.pickRate,
          count: item.count,
        })

        return acc
      }, [])
    : []

  return (
    <ChampDetailStyled className={clsx('ChampDetail', className)}>
      {!data && (
        <div className="loadingArea">
          <LoadingIcon />
        </div>
      )}

      {data && champNames && summonerSpells && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="argments">
            <Controller
              control={form.control}
              name="laneId"
              render={({ field }) => (
                <LaneSelect
                  {...field}
                  value={field.value === null ? champSummary.laneId : field.value}
                  hideLabel
                />
              )}
            />

            <Controller
              control={form.control}
              name="rankRangeId"
              render={({ field }) => <RankRangeSelect {...field} />}
            />
          </div>

          <section className="summary">
            {isValidating && laneId !== champSummary.laneId && (
              <motion.div
                className="loadingOverlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <LoadingIcon />
              </motion.div>
            )}

            <div className="left">
              <div className="champion">
                <div className="championImageContainer">
                  <TierIcon tier={champSummary.psTier} />
                  {champSummary.isOp && <OpIcon />}
                  {champSummary.isHoney && <HoneyIcon />}

                  <div className="imageOverflowBox">
                    <DataDragonImage
                      className="championImage"
                      type="champion/loading"
                      filename={champNames[champSummary.championId].en + '_0'}
                    />
                  </div>
                </div>

                <div className="right">
                  <h2 className="championName">
                    {champNames[champSummary.championId].ko}
                    <span>
                      표본수: {champSummary.count.toLocaleString()} · 승률: {champSummary.winRate}%
                    </span>
                  </h2>

                  {!isNoData && (
                    <div className="spellskill">
                      <div className="spell imageGroup">
                        <div className="title">스펠</div>
                        <div className="images">
                          <DataDragonImage
                            type="spell"
                            filename={summonerSpells[champSummary.spell2Id].en}
                          />

                          <DataDragonImage
                            type="spell"
                            filename={summonerSpells[champSummary.spell1Id].en}
                          />
                        </div>
                      </div>

                      <div className="skill imageGroup">
                        <div className="title">스킬 빌드</div>
                        <div className="images">
                          {champSummary.skillMasterList.map((skill: string, i: number) => (
                            <Fragment key={skill}>
                              <div className="skillImageContainer">
                                {/* <DataDragonImage
                            key={skill}
                            type="spell"
                            filename={`${champNames[champSummary.championId].en}${skill}`}
                          /> */}
                                <img
                                  src={`https://cdn.lol.ps/assets/img/skills/${champId}_${skill.toLocaleLowerCase()}_40.webp`}
                                />
                                <div className="label">{skill}</div>
                              </div>
                              {i !== 2 && <i className="bx bx-chevron-right" />}
                            </Fragment>
                          ))}
                        </div>
                        <div className="skillList">
                          {champSummary.skillLv15List.map((skill: string, i: number) => (
                            <div key={i} className={`item ${skill}`}>
                              <span>{skill}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {isNoData && (
                    <div className="noData">
                      <i className="bx bx-message-error" />

                      <div className="texts">
                        <h3>표시할 데이터가 없습니다</h3>
                        <p>다른 라인을 선택해주세요</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {!isNoData && (
                <div className="itemGroups">
                  <div className="imageGroup">
                    <div className="title">시작 아이템</div>
                    <div className="images">
                      {champSummary.startingItemIdList.map((itemIds: number[]) =>
                        itemIds.map((itemId, i) => (
                          <DataDragonImage key={`${itemId}.${i}`} type="item" filename={itemId} />
                        )),
                      )}
                    </div>
                  </div>

                  <div className="imageGroup">
                    <div className="title">신발</div>
                    <div className="images">
                      {champSummary.shoesId !== null && (
                        <DataDragonImage type="item" filename={champSummary.shoesId} />
                      )}
                    </div>
                  </div>

                  <div className="imageGroup">
                    <div className="title">코어 아이템</div>
                    <div className="images">
                      {champSummary.coreItemIdList.map((itemId: number, i: number) => (
                        <DataDragonImage key={`${itemId}.${i}`} type="item" filename={itemId} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="right runeContainer">
              <RuneStyleButtonRadioList
                items={runeStyles.map(runeStyle => ({
                  mainRuneId: runeStyle.mainRuneIds[0],
                  subRuneId: runeStyle.subRuneIds[0],
                  winRate: runeStyle.winRate,
                  pickRate: runeStyle.pickRate,
                  count: runeStyle.count,
                }))}
                value={selectedRuneStyleId}
                onChange={value => form.setValue('runeStyleId', value)}
              />

              <RunePage
                mainRuneIds={runeStyles[selectedRuneStyleId].mainRuneIds}
                subRuneIds={runeStyles[selectedRuneStyleId].subRuneIds}
                shardRuneIds={[
                  champSummary.statperk1Id,
                  champSummary.statperk2Id,
                  champSummary.statperk3Id,
                ]}
              />
            </div>
          </section>

          {['down', 'up'].map(counterType => (
            <section key={counterType} className="counter">
              <div className="title">
                상대하기 {counterType === 'up' ? '쉬운' : '어려운'} 챔피언
              </div>

              <div className="championList">
                {data.counterChampions[counterType].slice(0, 10).map((counter: any) => (
                  <div className="item" key={counter.champId}>
                    <div className="imageMask">
                      <DataDragonImage type="champion" filename={champNames[counter.champId].en} />
                    </div>
                    <div className="texts">
                      <div className="label">승률</div>
                      <div className={`value ${counterType}`}>{counter.winrate.toFixed(2)}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </motion.div>
      )}
    </ChampDetailStyled>
  )
}

export default ChampDetail
