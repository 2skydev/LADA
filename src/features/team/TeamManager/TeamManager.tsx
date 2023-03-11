import { Fragment, useEffect, useMemo, useState } from 'react';

import { Button, Divider, Result } from 'antd';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { random } from 'lodash';

import DataDragonImage from '~/features/asset/DataDragonImage';
import RankIcon from '~/features/asset/RankIcon';
import useAPI from '~/hooks/useAPI';

import { TeamManagerStyled } from './styled';

export interface TeamManagerProps {
  className?: string;
}

const PICK_TYPE_LABEL = {
  SimulPickStrategy: '비공개 선택',
  TournamentPickStrategy: '토너먼트 드래프트',
  DraftModeSinglePickStrategy: '교차 선택',
  AllRandomPickStrategy: '모두 무작위',
};

const ANIMATE_DELAY = 0.1;

const createKey = (lobbyData: any) => {
  const members = [
    ...(lobbyData?.members || []),
    ...(lobbyData?.gameConfig?.customSpectators || []),
  ];

  return members
    .map((member: any) => member.summonerId)
    .sort()
    .join('.');
};

const TeamManager = ({ className }: TeamManagerProps) => {
  const [data, setData] = useState<any>(null);
  const [result, setResult] = useState<[any[], any[]] | null>(null);

  const key = createKey(data);

  const summonerNames = useMemo(
    () => (data?.members || []).map((member: any) => member.summonerName),
    [key],
  );

  const { data: lobbyData } = useAPI('league', '/lobby');
  const { data: summoners = [] } = useAPI('ps', '/summoners', {
    payload: { names: summonerNames },
  });

  const createRandomTeam = () => {
    const members = data.members;
    const teams: [any[], any[]] = [[], []];

    members.forEach((member: any) => {
      const teamIndex = random(0, 1);

      if (teams[teamIndex].length === 5) {
        teams[teamIndex === 0 ? 1 : 0].push(member);
        return;
      }

      teams[teamIndex].push(member);
    });

    setResult(teams);
  };

  const isCustomGame = data && data.gameConfig.gameMode === 'CLASSIC' && data.gameConfig.isCustom;

  useEffect(() => {
    if (lobbyData) {
      setData(lobbyData);
      setResult(null);
    }
  }, [lobbyData]);

  useEffect(() => {
    const onChangeLobbyData = (lobbyData: any) => {
      if (!result || (result && key !== createKey(lobbyData))) {
        setData(lobbyData);
        setResult(null);
      }
    };

    window.electron.subscribeLeague('lobby', onChangeLobbyData);

    return () => {
      window.electron.unsubscribeLeague('lobby');
    };
  }, [key, result]);

  return (
    <TeamManagerStyled className={clsx('TeamManager', className)}>
      {!isCustomGame && (
        <Result
          status="warning"
          title="사용자 설정 게임을 생성해주세요."
          extra="게임시작 > 사용자 설정 게임 생성 > 소환사의 협곡으로 생성해주세요."
        />
      )}

      {isCustomGame && (
        <>
          <header>
            <h2>{data.gameConfig.customLobbyName}</h2>
            <p>
              소환사의 협곡 · 5대5 ·{' '}
              {PICK_TYPE_LABEL[data.gameConfig.pickType as keyof typeof PICK_TYPE_LABEL]}
            </p>
          </header>

          <div className="teams">
            {[1, 2].map(teamNumber => {
              const teamMembers = result
                ? result[teamNumber - 1]
                : data.gameConfig[`customTeam${teamNumber}00`];

              return (
                <div className="team" key={teamNumber}>
                  <h3>{teamNumber}팀</h3>

                  <div className="members">
                    {teamMembers.map((member: any, i: number) => {
                      const psData = summoners.find(
                        (summoner: any) => summoner.summoner_name === member.summonerName,
                      );

                      // const latestSeason = psData;

                      console.log(psData);

                      return (
                        <Fragment key={member.summonerId}>
                          <motion.div
                            className="member"
                            key={`${member.summonerId}-${new Date().getTime()}`}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                              delay:
                                ANIMATE_DELAY * i +
                                ANIMATE_DELAY *
                                  Math.min(data.members.length - 1, 4) *
                                  (teamNumber - 1),
                            }}
                          >
                            <DataDragonImage
                              type="profileicon"
                              filename={member.summonerIconId}
                              size="40px"
                              circle
                            />
                            <span>{member.summonerName}</span>
                            <div className="rankProfile">
                              <span className="rank">{psData?.tier || 'UNRANKED'}</span>
                              <span className="tier">{psData?.rank}</span>
                              <RankIcon rank={psData?.tier || 'UNRANKED'} />
                            </div>
                          </motion.div>

                          <Divider />
                        </Fragment>
                      );
                    })}

                    {Array(5 - teamMembers.length)
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
              );
            })}
          </div>

          <div className="buttons">
            <Button onClick={createRandomTeam}>팀 추첨</Button>

            <Button
              danger
              onClick={() => {
                setResult(null);
              }}
            >
              초기화
            </Button>
          </div>
        </>
      )}
    </TeamManagerStyled>
  );
};

export default TeamManager;
