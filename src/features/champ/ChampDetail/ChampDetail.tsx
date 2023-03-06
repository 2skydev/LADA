import { Fragment } from 'react';

import clsx from 'clsx';
import { motion } from 'framer-motion';

import LoadingIcon from '~/components/LoadingIcon';
import DataDragonImage from '~/features/asset/DataDragonImage';
import LaneIcon from '~/features/asset/LaneIcon';
import TierIcon, { HoneyIcon, OpIcon } from '~/features/asset/TierIcon';
import LaneSelect, { LANE_LABELS } from '~/features/lane/LaneSelect';
import useAPI from '~/hooks/useAPI';
import useChampNames from '~/hooks/useChampNames';
import useSummonerSpells from '~/hooks/useSummonerSpells';

import { ChampDetailStyled } from './styled';

export interface ChampDetailProps {
  className?: string;
  champId: number;
}

const ChampDetail = ({ className, champId }: ChampDetailProps) => {
  const { data } = useAPI('ps', `/champ/${champId}`);
  const champNames = useChampNames();
  const summonerSpells = useSummonerSpells();

  const champSummary = data ? data.champ.champSummary[0] : null;

  console.log(champId, data, champNames?.[champSummary?.championId]);

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
            <LaneSelect value={champSummary.laneId} hideLabel />
          </div>

          <section className="championSection">
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
            </div>
          </section>
        </motion.div>
      )}
    </ChampDetailStyled>
  );
};

export default ChampDetail;
