import { Controller } from 'react-hook-form';

import { Table } from 'antd';
import clsx from 'clsx';
import useSWR from 'swr';

import ChampionProfileSmall from '~/components/ChampionProfileSmall';
import LaneSelect from '~/components/LaneSelect';
import RankingVariation from '~/components/RankingVariation';
import { useCustomForm } from '~/hooks/useCustomForm';

import { TierTableStyled } from './styled';

export interface TierTableProps {
  className?: string;
}

const TierTable = ({ className }: TierTableProps) => {
  const form = useCustomForm({
    defaultValues: {
      lane: 0,
    },
    onSubmit: () => {},
  });

  const lane = form.watch('lane');

  const { data = [], isLoading } = useSWR<any[]>(`/tiers/${lane}`, {
    keepPreviousData: true,
  });

  return (
    <TierTableStyled className={clsx('TierTable', className)}>
      <Controller
        control={form.control}
        name="lane"
        render={({ field }) => <LaneSelect {...field} />}
      />

      <br />

      <Table
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
          },
          {
            key: 'honeyScore',
            dataIndex: 'honeyScore',
            title: '꿀챔 점수',
            align: 'right',
            sorter: (a, b) => a.honeyScore - b.honeyScore,
          },
          {
            key: 'winRate',
            dataIndex: 'winRate',
            title: '승률',
            align: 'right',
            sorter: (a, b) => a.winRate - b.winRate,
            render: (value: number) => value + '%',
          },
          {
            key: 'pickRate',
            dataIndex: 'pickRate',
            title: '픽률',
            align: 'right',
            sorter: (a, b) => a.pickRate - b.pickRate,
            render: (value: number) => value + '%',
          },
          {
            key: 'banRate',
            dataIndex: 'banRate',
            title: '밴률',
            align: 'right',
            sorter: (a, b) => a.banRate - b.banRate,
            render: (value: number) => value + '%',
          },
          {
            key: 'count',
            dataIndex: 'count',
            title: '표본수',
            align: 'right',
            sorter: (a, b) => a.count - b.count,
            render: (value: number) => Number(value).toLocaleString(),
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
