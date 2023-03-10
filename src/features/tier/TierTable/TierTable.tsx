import { Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { Table, Tooltip } from 'antd';
import clsx from 'clsx';
import dayjs from 'dayjs';

import RankingVariation from '~/components/RankingVariation';
import ChampionProfileSmall from '~/features/asset/ChampionProfileSmall';
import LaneSelect from '~/features/lane/LaneSelect';
import useAPI from '~/hooks/useAPI';
import { useCustomForm } from '~/hooks/useCustomForm';

import { TierTableStyled } from './styled';

export interface TierTableProps {
  className?: string;
}

const TierTable = ({ className }: TierTableProps) => {
  const navigate = useNavigate();

  const form = useCustomForm({
    defaultValues: {
      lane: 0,
    },
    onSubmit: () => {},
  });

  const lane = form.watch('lane');

  const { data = [], isLoading } = useAPI<any[]>('ps', `/tiers/${lane}`, {
    dedupingInterval: 1000 * 60 * 5,
  });

  const updatedAt = data[0]?.updatedAt;

  return (
    <TierTableStyled className={clsx('TierTable', className)}>
      <header>
        <h2>라인별 챔피언 티어</h2>

        <div className="updatedAt">
          {!updatedAt && '불러오는 중...'}
          {updatedAt && (
            <Tooltip title={dayjs(updatedAt).format('YYYY.MM.DD a h:m')}>
              {dayjs(updatedAt).fromNow()} KST 기준
            </Tooltip>
          )}
        </div>

        <div className="info">라인별 픽률 0.5% 이상만 표시</div>
      </header>

      <Controller
        control={form.control}
        name="lane"
        render={({ field }) => <LaneSelect {...field} />}
      />

      <br />

      <Table
        onRow={record => ({
          onClick: () => {
            navigate(`/champ/${record.championId}`);
          },
        })}
        components={{
          body: {
            row: ({ className, children, ...props }: any) => {
              const item = data[props['data-row-key'] - 1];

              return (
                <tr className={clsx(className, item && `tier${item.opTier}`)} {...props}>
                  {children}
                </tr>
              );
            },
          },
        }}
        columns={[
          {
            key: 'ranking',
            dataIndex: 'ranking',
            align: 'center',
            width: 50,
          },
          {
            key: 'updown',
            dataIndex: 'rankingVariation',
            render: (value: number) => <RankingVariation value={value} max={data.length} />,
            width: 100,
          },
          {
            key: 'champion',
            render: record => {
              return (
                <ChampionProfileSmall
                  championId={record.championId}
                  championNameKr={record.championInfo.nameKr}
                  tier={record.opTier}
                  isHoney={record.isHoney}
                  isOp={record.isOp}
                />
              );
            },
          },
          {
            key: 'opScore',
            dataIndex: 'opScore',
            title: 'PS 스코어',
            align: 'right',
            sorter: (a, b) => a.opScore - b.opScore,
            defaultSortOrder: 'descend',
            width: 120,
          },
          {
            key: 'honeyScore',
            dataIndex: 'honeyScore',
            title: '꿀챔 점수',
            align: 'right',
            sorter: (a, b) => a.honeyScore - b.honeyScore,
            width: 120,
          },
          {
            key: 'winRate',
            dataIndex: 'winRate',
            title: '승률',
            align: 'right',
            sorter: (a, b) => a.winRate - b.winRate,
            render: (value: number) => value + '%',
            width: 100,
          },
          {
            key: 'pickRate',
            dataIndex: 'pickRate',
            title: '픽률',
            align: 'right',
            sorter: (a, b) => a.pickRate - b.pickRate,
            render: (value: number) => value + '%',
            width: 100,
          },
          {
            key: 'banRate',
            dataIndex: 'banRate',
            title: '밴률',
            align: 'right',
            sorter: (a, b) => a.banRate - b.banRate,
            render: (value: number) => value + '%',
            width: 100,
          },
          {
            key: 'count',
            dataIndex: 'count',
            title: '표본수',
            align: 'right',
            sorter: (a, b) => a.count - b.count,
            render: (value: number) => Number(value).toLocaleString(),
            width: 100,
          },
        ]}
        dataSource={data}
        rowKey={record => record.ranking}
        loading={isLoading}
        pagination={false}
        scroll={{ y: 600 }}
        sortDirections={['descend', 'ascend']}
      />
    </TierTableStyled>
  );
};

export default TierTable;
