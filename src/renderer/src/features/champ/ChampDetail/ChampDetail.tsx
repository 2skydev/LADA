import { Fragment, useEffect, useState } from 'react'
import { Controller } from 'react-hook-form'

import clsx from 'clsx'
import deepEqual from 'fast-deep-equal'
import { motion } from 'framer-motion'
import { useAtomValue } from 'jotai'

import { LANE_ID_TO_LABEL_MAP } from '@main/modules/league/league.constants'
import { LaneId } from '@main/modules/league/types/lane.types'
import { RuneIdsGroupByType } from '@main/modules/league/types/rune.types'
import { CounterChampionsItem } from '@main/modules/league/types/stat.types'

import LoadingIcon from '@renderer/components/LoadingIcon'
import TierIcon, { HoneyIcon, OpIcon } from '@renderer/features/asset/TierIcon'
import ItemBuildGroups from '@renderer/features/item/ItemBuildGroups'
import LaneSelect from '@renderer/features/lane/LaneSelect'
import RankRangeSelect from '@renderer/features/rank/RankRangeSelect'
import { rankRangeIdAtom } from '@renderer/features/rank/RankRangeSelect/rankRangeId.atom'
import RuneBuildButtonRadioList from '@renderer/features/rune/RuneBuildButtonRadioList'
import RunePage from '@renderer/features/rune/RunePage'
import useAPI from '@renderer/hooks/useAPI'
import { useCustomForm } from '@renderer/hooks/useCustomForm'

import { ChampDetailStyled } from './styled'

export interface ChampDetailFormValue {
  laneId: LaneId | null
  runeBuildIndex: number
  customRuneIdsGroupByType: RuneIdsGroupByType | null
}

export interface ChampDetailProps {
  className?: string
  champId: number
  defaultLaneId?: LaneId
  autoRuneSetting?: boolean
}

const ChampDetail = ({ className, champId, defaultLaneId, autoRuneSetting }: ChampDetailProps) => {
  const [autoRuneSettingArguments, setAutoRuneSettingArguments] = useState<{
    runeIds: number[]
    name: string
  } | null>(null)

  const form = useCustomForm<ChampDetailFormValue>({
    defaultValues: {
      laneId: defaultLaneId ?? null,
      runeBuildIndex: 0,
      customRuneIdsGroupByType: null,
    },
    onSubmit: () => {},
  })

  const laneId = form.watch('laneId')
  const selectedRuneBuildIndex = form.watch('runeBuildIndex')
  const rankRangeId = useAtomValue(rankRangeIdAtom)
  const customRuneIdsGroupByType = form.watch('customRuneIdsGroupByType')

  const { data, isValidating } = useAPI('getChampionStats', {
    dedupingInterval: 1000 * 60 * 5,
    params: [
      champId,
      {
        laneId: laneId ?? undefined,
        rankRangeId,
      },
    ],
  })

  const isNoData = data && !data.summary.skillMasterList.length

  const selectedRuneBuild = data?.runeBuilds[selectedRuneBuildIndex]

  const handleRuneChange = autoRuneSetting
    ? (value: RuneIdsGroupByType) => form.setValue('customRuneIdsGroupByType', value)
    : undefined

  useEffect(() => {}, [])

  useEffect(() => {
    if (selectedRuneBuild && !isNoData) {
      form.setValue('customRuneIdsGroupByType', {
        mainRuneIds: selectedRuneBuild.mainRuneIds,
        subRuneIds: selectedRuneBuild.subRuneIds,
        shardRuneIds: selectedRuneBuild.shardRuneIds,
      })
    }
  }, [selectedRuneBuild, isNoData])

  useEffect(() => {
    if (autoRuneSetting && data && customRuneIdsGroupByType && !isNoData) {
      const runeIds = [
        ...customRuneIdsGroupByType.mainRuneIds,
        ...customRuneIdsGroupByType.subRuneIds,
        ...customRuneIdsGroupByType.shardRuneIds,
      ]

      const args = {
        runeIds,
        name: `${LANE_ID_TO_LABEL_MAP[data.summary.laneId]} ${data.champion.name}`,
      }

      if (!deepEqual(args, autoRuneSettingArguments)) {
        setAutoRuneSettingArguments(args)
      }
    }
  }, [autoRuneSetting, customRuneIdsGroupByType, data, isNoData, autoRuneSettingArguments])

  useEffect(() => {
    if (autoRuneSettingArguments) {
      window.electron.setRunePageByRuneIds(
        autoRuneSettingArguments.runeIds,
        autoRuneSettingArguments.name,
      )
    }
  }, [autoRuneSettingArguments])

  return (
    <ChampDetailStyled className={clsx('ChampDetail', className)}>
      {!data && (
        <div className="loadingArea">
          <LoadingIcon />
        </div>
      )}

      {data && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="arguments">
            <Controller
              control={form.control}
              name="laneId"
              render={({ field }) => (
                <LaneSelect
                  {...field}
                  value={field.value === null ? data.summary.laneId : field.value}
                  onChange={e => {
                    form.setValue('laneId', e.target.value)
                    form.setValue('runeBuildIndex', 0)
                  }}
                  hideLabel
                />
              )}
            />

            <RankRangeSelect />
          </div>

          <section className="summary">
            {isValidating && laneId !== data.summary.laneId && (
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
                  <TierIcon tier={data.summary.tier} />
                  {data.summary.isOp && <OpIcon />}
                  {data.summary.isHoney && <HoneyIcon />}

                  <div className="imageOverflowBox">
                    <img className="championImage" src={data.champion.imageFormats.loading} />
                  </div>
                </div>

                <div className="right">
                  <h2 className="championName">
                    {data.champion.name}
                    <span>
                      표본수: {data.summary.count.toLocaleString()} · 승률: {data.summary.winRate}%
                    </span>
                  </h2>

                  {!isNoData && (
                    <div className="spellAndSkill">
                      <div className="spell imageGroup">
                        <div className="title">스펠</div>
                        <div className="images">
                          <img src={data.summary.spells[0].image} />
                          <img src={data.summary.spells[1].image} />
                        </div>
                      </div>

                      <div className="skill imageGroup">
                        <div className="title">스킬 빌드</div>

                        <div className="images">
                          {data.summary.skillMasterList.map((skillId, i: number) => (
                            <Fragment key={skillId}>
                              <div className="skillImageContainer">
                                <img src={data.champion.skills[skillId].image} />
                                <div className="label">{skillId}</div>
                              </div>
                              {i !== 2 && <i className="bx bx-chevron-right" />}
                            </Fragment>
                          ))}
                        </div>

                        <div className="skillList">
                          {data.summary.skillLv15List.map((skillId, i: number) => (
                            <div key={i} className={`item ${skillId}`}>
                              <span>{skillId}</span>
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
                      {data.summary.startingItemList.map((item, i) => (
                        <img key={`${i}.${item.id}`} src={item.image} />
                      ))}
                    </div>
                  </div>

                  <div className="imageGroup">
                    <div className="title">신발</div>
                    <div className="images">
                      {data.summary.shoesItemList.map(item => (
                        <img key={item.id} src={item.image} />
                      ))}
                    </div>
                  </div>

                  <div className="imageGroup">
                    <div className="title">코어 아이템</div>
                    <div className="images">
                      {data.summary.coreItemList.map(item => (
                        <img key={item.id} src={item.image} />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {!isNoData && <ItemBuildGroups itemBuildGroups={data.itemBuildGroups} />}
            </div>

            {!isNoData && customRuneIdsGroupByType && (
              <div className="right runeContainer">
                <RuneBuildButtonRadioList
                  items={data.runeBuilds}
                  value={selectedRuneBuildIndex}
                  onChange={value => form.setValue('runeBuildIndex', value)}
                />

                <RunePage
                  mainRuneIds={customRuneIdsGroupByType.mainRuneIds}
                  subRuneIds={customRuneIdsGroupByType.subRuneIds}
                  shardRuneIds={customRuneIdsGroupByType.shardRuneIds}
                  onChange={handleRuneChange}
                />
              </div>
            )}
          </section>

          {!isNoData && (
            <>
              {['down', 'up'].map(counterType => (
                <section key={counterType} className="counter">
                  <div className="title">
                    상대하기 {counterType === 'up' ? '쉬운' : '어려운'} 챔피언
                  </div>

                  <div className="championList">
                    {data.counterChampions[counterType]
                      .slice(0, 10)
                      .map((counter: CounterChampionsItem) => (
                        <div className="item" key={counter.champion.id}>
                          <div className="imageMask">
                            <img src={counter.champion.imageFormats.small} />
                          </div>

                          <div className="texts">
                            <div className="label">승률</div>

                            <div className={`value ${counterType}`}>
                              {counter.winRate.toFixed(2)}%
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </section>
              ))}
            </>
          )}
        </motion.div>
      )}
    </ChampDetailStyled>
  )
}

export default ChampDetail
