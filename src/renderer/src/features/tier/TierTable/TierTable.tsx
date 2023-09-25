import { useEffect } from 'react'
import { Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { Table, Tooltip } from 'antd'
import clsx from 'clsx'
import dayjs from 'dayjs'
import { useAtom, useAtomValue } from 'jotai'

import { LaneId } from '@main/modules/league/types/lane.types'

import RankingVariation from '@renderer/components/RankingVariation'
import ChampionProfileSmall from '@renderer/features/champion/ChampionProfileSmall'
import LaneSelect from '@renderer/features/lane/LaneSelect'
import RankRangeSelect from '@renderer/features/rank/RankRangeSelect'
import { rankRangeIdAtom } from '@renderer/features/rank/RankRangeSelect/atoms/rankRangeId.atom'
import { tierTableLaneIdAtom } from '@renderer/features/tier/TierTable/atoms/tierTableLaneId.atom'
import useAPI from '@renderer/hooks/useAPI'
import useCustomForm from '@renderer/hooks/useCustomForm'
import useDidUpdateEffect from '@renderer/hooks/useDidUpdateEffect'
import useQS from '@renderer/hooks/useQS'

import * as Styled from './TierTable.styled'

export interface TierTableProps {
  className?: string
}

const TierTable = ({ className }: TierTableProps) => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'renderer.stats',
  })

  const navigate = useNavigate()
  const query = useQS<{ laneId?: string }>()
  const [tierTableLaneId, setTierTableLaneIdId] = useAtom(tierTableLaneIdAtom)

  const form = useCustomForm({
    defaultValues: {
      laneId: Number(query.laneId || tierTableLaneId) as LaneId,
    },
    onSubmit: () => {},
  })

  const laneId = form.watch('laneId')
  const rankRangeId = useAtomValue(rankRangeIdAtom)

  const { data = [], isLoading } = useAPI('getChampionTierList', {
    dedupingInterval: 1000 * 60 * 5,
    params: [laneId, rankRangeId],
  })

  const updatedAt = data[0]?.updatedAt

  useDidUpdateEffect(() => {
    if (query.laneId) {
      form.setValue('laneId', Number(query.laneId) as LaneId)
    }
  }, [query.laneId])

  useEffect(() => {
    setTierTableLaneIdId(laneId)
  }, [laneId])

  return (
    <Styled.Root className={clsx('TierTable', className)}>
      <header>
        <h2>{t('championTier.title')}</h2>

        <div className="updatedAt">
          {!updatedAt && t('championTier.loading')}
          {updatedAt && (
            <Tooltip title={dayjs(updatedAt).format('YYYY.MM.DD a h:m')}>
              {dayjs(updatedAt).fromNow()} {t('championTier.timezone')}
            </Tooltip>
          )}
        </div>

        <div className="info">{t('championTier.minPickRateInfo')}</div>
      </header>

      <div className="arguments">
        <Controller
          control={form.control}
          name="laneId"
          render={({ field }) => <LaneSelect {...field} />}
        />

        <RankRangeSelect />
      </div>

      <br />

      <Table
        onRow={record => ({
          onClick: () => {
            navigate(`/champions/${record.championId}?laneId=${laneId}`)
          },
        })}
        components={{
          body: {
            row: ({ className, children, ...props }: any) => {
              const item = data[props['data-row-key'] - 1]

              return (
                <tr className={clsx(className, item && `tier${item.opTier}`)} {...props}>
                  {children}
                </tr>
              )
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
              )
            },
          },
          {
            key: 'opScore',
            dataIndex: 'opScore',
            title: t('championTier.tableColumns.score'),
            align: 'right',
            sorter: (a, b) => a.opScore - b.opScore,
            defaultSortOrder: 'descend',
            width: 120,
          },
          {
            key: 'honeyScore',
            dataIndex: 'honeyScore',
            title: t('championTier.tableColumns.honeyScore'),
            align: 'right',
            sorter: (a, b) => a.honeyScore - b.honeyScore,
            width: 120,
          },
          {
            key: 'winRate',
            dataIndex: 'winRate',
            title: t('winRate'),
            align: 'right',
            sorter: (a, b) => a.winRate - b.winRate,
            render: (value: number) => value + '%',
            width: 100,
          },
          {
            key: 'pickRate',
            dataIndex: 'pickRate',
            title: t('pickRate'),
            align: 'right',
            sorter: (a, b) => a.pickRate - b.pickRate,
            render: (value: number) => value + '%',
            width: 100,
          },
          {
            key: 'banRate',
            dataIndex: 'banRate',
            title: t('banRate'),
            align: 'right',
            sorter: (a, b) => a.banRate - b.banRate,
            render: (value: number) => value + '%',
            width: 100,
          },
          {
            key: 'count',
            dataIndex: 'count',
            title: t('sampledCount'),
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
    </Styled.Root>
  )
}

export default TierTable
