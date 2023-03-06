import { Fragment, useEffect } from 'react';
import { Controller } from 'react-hook-form';

import { Result } from 'antd';
import clsx from 'clsx';
import { motion } from 'framer-motion';

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

  console.log(champSummary);

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

          <section className="championSection">
            {isValidating && laneId !== champSummary.laneId && (
              <motion.div
                className="loadingOverlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <LoadingIcon />
              </motion.div>
            )}

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
                  <div className="spell">
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

                  <div className="skill">
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
          </section>
        </motion.div>
      )}
    </ChampDetailStyled>
  );
};

export default ChampDetail;
