import { Fragment, useEffect } from 'react';
import { Controller } from 'react-hook-form';

import { Result } from 'antd';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useTheme } from 'styled-components';

import LoadingIcon from '~/components/LoadingIcon';
import DataDragonImage from '~/features/asset/DataDragonImage';
import TierIcon, { HoneyIcon, OpIcon } from '~/features/asset/TierIcon';
import LaneSelect from '~/features/lane/LaneSelect';
import RankRangeSelect from '~/features/rank/RankRangeSelect';
import useAPI from '~/hooks/useAPI';
import useChampNames from '~/hooks/useChampNames';
import { useCustomForm } from '~/hooks/useCustomForm';
import { useDidUpdateEffect } from '~/hooks/useDidUpdateEffect';
import useSummonerSpells from '~/hooks/useSummonerSpells';

import { ChampDetailStyled } from './styled';

export interface ChampDetailProps {
  className?: string;
  champId: number;
}

const ChampDetail = ({ className, champId }: ChampDetailProps) => {
  const theme = useTheme();
  const form = useCustomForm({
    defaultValues: {
      laneId: null,
      rankRangeId: 2,
    },
    onSubmit: () => {},
  });

  const laneId = form.watch('laneId');
  const rankRangeId = form.watch('rankRangeId');

  const champNames = useChampNames();
  const summonerSpells = useSummonerSpells();

  const { data, isValidating } = useAPI('ps', `/champ/${champId}`, {
    payload: {
      laneId,
      rankRangeId,
    },
  });

  const champSummary = data ? data.summary[0] : null;
  const isNoData = data && (champSummary.spell1Id === null || !champSummary.skillMasterList.length);

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

            <div className="right timelineWinrate">
              <div className="title">시간대별 예측 승률</div>

              <div className="chartContainer">
                {!isNoData && (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={data.timelineWinrates.map((winRate: number, min: number) => ({
                        time: min + '분',
                        winRate,
                      }))}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.borderColor} />
                      <XAxis dataKey="time" minTickGap={10} tickMargin={5} />
                      <YAxis type="number" domain={['auto', 'auto']} />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="winRate"
                        stroke={theme.colors.primary}
                        fill={theme.colors.primary}
                        dot={false}
                        name="예측 승률"
                        unit="%"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
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
  );
};

export default ChampDetail;
