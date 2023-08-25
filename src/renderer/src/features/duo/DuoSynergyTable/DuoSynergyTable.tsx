import { ChangeEvent, useCallback, useEffect } from 'react'
import { Controller } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { Input, Table } from 'antd'
import clsx from 'clsx'
import { includesByCho, correctByDistance } from 'hangul-util'
import { useAtom, useAtomValue } from 'jotai'
import { debounce } from 'lodash'

import { CHAMPION_NAME_ALIAS_MAP } from '@main/modules/league/league.constants'
import { LaneId } from '@main/modules/league/types/lane.types'
import {
  DuoSynergyItem,
  DuoSynergyItemChampion,
  GetDuoSynergyListOptions,
} from '@main/modules/ps/types/duo.types'

import ChampionProfileSmall from '@renderer/features/asset/ChampionProfileSmall'
import LaneIcon from '@renderer/features/asset/LaneIcon/LaneIcon'
import DuoLaneSelect, { DUO_OPTIONS, DuoId } from '@renderer/features/duo/DuoLaneSelect'
import { duoSynergyTableDuoIdAtom } from '@renderer/features/duo/DuoSynergyTable/atoms/duoSynergyTableDuoId.atom'
import { LANE_LABELS } from '@renderer/features/lane/LaneSelect'
import RankRangeSelect from '@renderer/features/rank/RankRangeSelect'
import { rankRangeIdAtom } from '@renderer/features/rank/RankRangeSelect/atoms/rankRangeId.atom'
import useAPI from '@renderer/hooks/useAPI'
import useCustomForm from '@renderer/hooks/useCustomForm'
import useDidUpdateEffect from '@renderer/hooks/useDidUpdateEffect'

import * as Styled from './DuoSynergyTable.styled'

export interface DuoSynergyTableProps {
  className?: string
}

export interface DuoSynergyForm extends Omit<GetDuoSynergyListOptions, 'championId'> {
  duoId: DuoId
  championId: number | null
  search: string
}

export interface FilteredChampionItem {
  id: number
  name: string
  normalizedName: string
  alias: string[]
}

const DuoSynergyTable = ({ className }: DuoSynergyTableProps) => {
  const [duoSynergyTableDuoId, setDuoSynergyTableDuoId] = useAtom(duoSynergyTableDuoIdAtom)

  const form = useCustomForm<DuoSynergyForm>({
    defaultValues: {
      duoId: duoSynergyTableDuoId,
      criterion: 'synergyScore',
      order: 'desc',
      championId: null,
      search: '',
    },
    onSubmit: () => {},
  })

  const duoId = form.watch('duoId')
  const criterion = form.watch('criterion')
  const order = form.watch('order')
  const championId = form.watch('championId')
  const search = form.watch('search')
  const rankRangeId = useAtomValue(rankRangeIdAtom)

  const { data: championNames, isLoading: isChampionNamesLoading } = useAPI('getChampionNames', {
    revalidateIfStale: false,
  })

  const { data = [], isLoading: isDuoSynergyListLoading } = useAPI('getDuoSynergyList', {
    dedupingInterval: 1000 * 60 * 5,
    params: [
      duoId,
      {
        rankRangeId,
        criterion,
        order,
        championId: championId ?? undefined,
      },
    ],
  })

  const isLoading = isDuoSynergyListLoading || isChampionNamesLoading

  const handleChangeSearch = useCallback(
    debounce((e: ChangeEvent<HTMLInputElement>) => {
      form.setValue('search', e.target.value)
    }, 200),
    [],
  )

  useDidUpdateEffect(() => {
    setDuoSynergyTableDuoId(duoId)
  }, [duoId])

  useEffect(() => {
    const filteredChampions =
      !championNames || !search.trim().length
        ? []
        : Object.keys(championNames).reduce<FilteredChampionItem[]>((acc, id) => {
            const name = championNames[id].ko
            const normalizedName = name.replaceAll(' ', '')
            const alias = CHAMPION_NAME_ALIAS_MAP[normalizedName] ?? []

            if (
              includesByCho(search, normalizedName) ||
              alias.some(x => includesByCho(search, x))
            ) {
              acc.push({
                id: +id,
                name,
                normalizedName,
                alias,
              })
            }

            return acc
          }, [])

    const distanceChampionNames: string[] = correctByDistance(
      search,
      filteredChampions.map(x => x.normalizedName),
    )

    const filteredChampionId: number | null = distanceChampionNames.length
      ? filteredChampions.find(x => x.normalizedName === distanceChampionNames[0])!.id
      : filteredChampions.length === 1
      ? filteredChampions[0].id
      : null

    if (championId !== filteredChampionId) {
      form.setValue('championId', filteredChampionId)
    } else if (!filteredChampions.length && championId !== null) {
      form.setValue('championId', null)
    }
  }, [championNames, search, championId])

  return (
    <Styled.Root className={clsx('DuoSynergyTable', className)}>
      <header>
        <h2>듀오 시너지</h2>
      </header>

      <div className="arguments">
        <Controller
          control={form.control}
          name="duoId"
          render={({ field }) => <DuoLaneSelect {...field} />}
        />

        <Input
          className="search"
          placeholder="챔피언 이름으로 검색"
          onChange={handleChangeSearch}
        />

        <RankRangeSelect />
      </div>

      <br />

      <Table
        columns={[
          {
            key: 'ranking',
            dataIndex: 'ranking',
            title: '순위',
            align: 'center',
            width: 80,
          },
          {
            key: 'champion',
            title: <DuoSynergyTableLaneTitle laneId={DUO_OPTIONS[duoId][0]} />,
            render: (record: DuoSynergyItem) => {
              return <DuoSynergyTableChampProfile {...record.champion1} />
            },
          },
          {
            key: 'champion',
            title: <DuoSynergyTableLaneTitle laneId={DUO_OPTIONS[duoId][1]} />,
            render: (record: DuoSynergyItem) => {
              return <DuoSynergyTableChampProfile {...record.champion2} />
            },
          },
          {
            key: 'synergyScore',
            dataIndex: 'synergyScore',
            title: '시너지 점수',
            align: 'right',
            sorter: (a, b) => a.synergyScore - b.synergyScore,
            sortOrder:
              criterion === 'synergyScore' ? (order === 'desc' ? 'descend' : 'ascend') : null,
            width: 200,
          },
          {
            key: 'duoWinrate',
            dataIndex: 'duoWinrate',
            title: '듀오 승률',
            align: 'right',
            sorter: (a, b) => a.duoWinrate - b.duoWinrate,
            sortOrder:
              criterion === 'duoWinrate' ? (order === 'desc' ? 'descend' : 'ascend') : null,
            render: (value: number) => value + '%',
            width: 140,
          },
          {
            key: 'pickrate',
            dataIndex: 'pickrate',
            title: '듀오 픽률',
            align: 'right',
            sorter: (a, b) => a.pickrate - b.pickrate,
            sortOrder: criterion === 'pickrate' ? (order === 'desc' ? 'descend' : 'ascend') : null,
            render: (value: number) => value + '%',
            width: 140,
          },
          {
            key: 'count',
            dataIndex: 'count',
            title: '표본수',
            align: 'right',
            sorter: (a, b) => a.count - b.count,
            sortOrder: criterion === 'count' ? (order === 'desc' ? 'descend' : 'ascend') : null,
            render: (value: number) => value.toLocaleString(),
            width: 140,
          },
        ]}
        dataSource={data}
        rowKey={record => `${record.champion1.championId}.${record.champion2.championId}`}
        loading={isLoading}
        pagination={false}
        scroll={{ y: 600 }}
        sortDirections={['descend', 'ascend']}
        onChange={(_, __, sorter) => {
          if (!Array.isArray(sorter)) {
            form.setValue('criterion', sorter.columnKey as DuoSynergyForm['criterion'])
            form.setValue('order', sorter.order === 'ascend' ? 'asc' : 'desc')
          }
        }}
      />
    </Styled.Root>
  )
}

export const DuoSynergyTableChampProfile = ({
  championId,
  winrate,
  championName,
}: DuoSynergyItemChampion) => {
  const navigate = useNavigate()

  return (
    <Styled.ChampionProfile
      onClick={() => {
        navigate(`/champ/${championId}`)
      }}
    >
      <ChampionProfileSmall championId={championId} />

      <div className="texts">
        <div className="winRate">{winrate}%</div>
        <div className="name">{championName}</div>
      </div>
    </Styled.ChampionProfile>
  )
}

export const DuoSynergyTableLaneTitle = ({ laneId }: { laneId: LaneId }) => {
  return (
    <Styled.LaneTitle>
      <LaneIcon laneId={laneId} /> {LANE_LABELS[laneId]} 승률
    </Styled.LaneTitle>
  )
}

export default DuoSynergyTable
