import { ChangeEvent, useCallback, useEffect } from 'react'
import { Controller } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { Input, Table } from 'antd'
import clsx from 'clsx'
import { includesByCho, correctByDistance } from 'hangul-util'
import { debounce } from 'lodash'
import { useRecoilState, useRecoilValue } from 'recoil'

import { LaneId } from '@main/modules/league/types/lane'

import ChampionProfileSmall from '@renderer/features/asset/ChampionProfileSmall'
import LaneIcon from '@renderer/features/asset/LaneIcon/LaneIcon'
import DuoLaneSelect, { DUO_OPTIONS, DuoId } from '@renderer/features/duo/DuoLaneSelect'
import { duoSynergyTableDuoIdAtom } from '@renderer/features/duo/DuoSynergyTable/duoSynergyTableDuoId.atom'
import { LANE_LABELS } from '@renderer/features/lane/LaneSelect'
import RankRangeSelect from '@renderer/features/rank/RankRangeSelect'
import { rankRangeIdAtom } from '@renderer/features/rank/RankRangeSelect/rankRangeId.atom'
import useAPI from '@renderer/hooks/useAPI'
import { useCustomForm } from '@renderer/hooks/useCustomForm'
import useDataDragonChampNames from '@renderer/hooks/useDataDragonChampNames'
import { useDidUpdateEffect } from '@renderer/hooks/useDidUpdateEffect'

import {
  DuoSynergyTableChampProfileStyled,
  DuoSynergyTableLaneTitleStyled,
  DuoSynergyTableStyled,
} from './styled'

const CHAMP_NAME_ALIAS_MAP: Record<string, string[]> = {
  트리스타나: ['트타'],
  트위스티드페이트: ['트페'],
  트린다미어: ['트린', '트란'],
  블리츠크랭크: ['블츠', '깡통'],
  하이머딩거: ['하딩'],
  볼리베어: ['볼베'],
  마스터이: ['마이'],
  그레이브즈: ['그브'],
  아우렐리온솔: ['아솔', '아우솔'],
  케이틀린: ['케틀'],
  그라가스: ['글가'],
  유미: ['고양이', '라면'],
  미스포츈: ['미포'],
  드레이븐: ['드븐'],
  워윅: ['워웍'],
  말파이트: ['돌'],
  블라디미르: ['모기'],
  모르가나: ['몰가'],
  그웬: ['궨'],
  문도박사: ['문박'],
  뽀삐: ['삐뽀'],
}

export interface DuoSynergyTableProps {
  className?: string
}

export interface DuoSynergyItemChampion {
  championId: number
  championName: string
  winrate: number
}

export interface DuoSynergyItem {
  ranking: number
  champion1: DuoSynergyItemChampion
  champion2: DuoSynergyItemChampion
  synergyScore: number
  duoWinrate: number
  pickrate: number
  count: number
}

export interface DuoSynergyForm {
  duoId: DuoId
  rankRangeId: number
  criterion: string
  order: string
  championId: number | null
  search: string
}

export interface FilteredChampItem {
  id: number
  name: string
  normalizedName: string
  alias: string[]
}

const DuoSynergyTable = ({ className }: DuoSynergyTableProps) => {
  const [duoSynergyTableDuoId, setDuoSynergyTableDuoId] = useRecoilState(duoSynergyTableDuoIdAtom)

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
  const rankRangeId = useRecoilValue(rankRangeIdAtom)

  const { data = [], isLoading: isLoadingAPI } = useAPI<any[]>('ps', `/duo/${duoId}`, {
    dedupingInterval: 1000 * 60 * 5,
    payload: {
      rankRangeId,
      criterion,
      order,
      championId,
    },
  })

  const champNames = useDataDragonChampNames()

  const isLoading = isLoadingAPI || !champNames

  const list: DuoSynergyItem[] = isLoading
    ? []
    : data.map(item => {
        return {
          ranking: item.ranking,
          champion1: {
            championId: item.championId1,
            championName: champNames[item.championId1].ko,
            winrate: +item.winrate1,
          },
          champion2: {
            championId: item.championId2,
            championName: champNames[item.championId2].ko,
            winrate: +item.winrate2,
          },
          synergyScore: +item.synergyScore,
          duoWinrate: +item.duoWinrate,
          pickrate: +item.pickrate,
          count: +item.count,
        }
      })

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
    const filteredChamps =
      !champNames || !search.trim().length
        ? []
        : Object.keys(champNames).reduce<FilteredChampItem[]>((acc, id) => {
            const name = champNames[id].ko
            const normalizedName = name.replaceAll(' ', '')
            const alias = CHAMP_NAME_ALIAS_MAP[normalizedName] ?? []

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

    const distanceChampNames: string[] = correctByDistance(
      search,
      filteredChamps.map(x => x.normalizedName),
    )

    const filteredChampId: number | null = distanceChampNames.length
      ? filteredChamps.find(x => x.normalizedName === distanceChampNames[0])!.id
      : filteredChamps.length === 1
      ? filteredChamps[0].id
      : null

    if (championId !== filteredChampId) {
      form.setValue('championId', filteredChampId)
    } else if (!filteredChamps.length && championId !== null) {
      form.setValue('championId', null)
    }
  }, [champNames, search, championId])

  return (
    <DuoSynergyTableStyled className={clsx('DuoSynergyTable', className)}>
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
        dataSource={list}
        rowKey={record => `${record.champion1.championId}.${record.champion2.championId}`}
        loading={isLoading}
        pagination={false}
        scroll={{ y: 600 }}
        sortDirections={['descend', 'ascend']}
        onChange={(_, __, sorter) => {
          console.log(sorter)
          if (!Array.isArray(sorter)) {
            form.setValue('criterion', sorter.columnKey as string)
            form.setValue('order', sorter.order === 'ascend' ? 'asc' : 'desc')
          }
        }}
      />
    </DuoSynergyTableStyled>
  )
}

export const DuoSynergyTableChampProfile = ({
  championId,
  winrate,
  championName,
}: DuoSynergyItemChampion) => {
  const navigate = useNavigate()

  return (
    <DuoSynergyTableChampProfileStyled
      onClick={() => {
        navigate(`/champ/${championId}`)
      }}
    >
      <ChampionProfileSmall championId={championId} />

      <div className="texts">
        <div className="winRate">{winrate}%</div>
        <div className="name">{championName}</div>
      </div>
    </DuoSynergyTableChampProfileStyled>
  )
}

export const DuoSynergyTableLaneTitle = ({ laneId }: { laneId: LaneId }) => {
  return (
    <DuoSynergyTableLaneTitleStyled>
      <LaneIcon laneId={laneId} /> {LANE_LABELS[laneId]} 승률
    </DuoSynergyTableLaneTitleStyled>
  )
}

export default DuoSynergyTable
