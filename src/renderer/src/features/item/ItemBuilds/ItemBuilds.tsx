import { Fragment, ReactNode, useEffect, useMemo, useState } from 'react'

import clsx from 'clsx'

import ButtonRadioList from '@renderer/components/ButtonRadioList'
import LoadingIcon from '@renderer/components/LoadingIcon/LoadingIcon'
import PickWinRate from '@renderer/components/PickWinRate'
import DataDragonImage from '@renderer/features/asset/DataDragonImage'
import useDataDragonItems from '@renderer/hooks/useDataDragonItems'

import { ItemBuildsStyled } from './styled'

interface ItemBuildData {
  itemIdList: string[]
  pickRate: number
  winRate: number
  count: number
}

interface ItemBuildGroup {
  id: string
  pickRate: number
  winRate: number
  count: number
  length: number
  isMythicalLevel: boolean
}

export interface ItemBuildsProps {
  className?: string
  children?: ReactNode
  itemBuilds: ItemBuildData[]
}

const ItemBuilds = ({ className, itemBuilds }: ItemBuildsProps) => {
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null)
  const leagueItems = useDataDragonItems()

  const itemBuildGroups: ItemBuildGroup[] = useMemo(() => {
    if (!leagueItems) return []
    const groups: Record<string, ItemBuildGroup> = {}

    itemBuilds.forEach(itemBuild => {
      let mythicalItemId = itemBuild.itemIdList.find(itemId =>
        leagueItems.mythicalLevelItemIds.includes(itemId),
      )
      let isMythicalLevel = true

      if (!mythicalItemId) {
        mythicalItemId = itemBuild.itemIdList[0]
        isMythicalLevel = false
      }

      groups[mythicalItemId] ||= {
        id: mythicalItemId,
        pickRate: 0,
        winRate: 0,
        count: 0,
        length: 0,
        isMythicalLevel,
      }

      groups[mythicalItemId].pickRate += Number(itemBuild.pickRate)
      groups[mythicalItemId].winRate += Number(itemBuild.winRate)
      groups[mythicalItemId].count += itemBuild.count
      groups[mythicalItemId].length++
    })

    const groupsArray = Object.values(groups).map(group => ({
      ...group,
      pickRate: Number((group.pickRate / group.length).toFixed(1)),
      winRate: Number((group.winRate / group.length).toFixed(1)),
    }))

    groupsArray.sort((a, b) => b.count - a.count)

    return groupsArray
  }, [itemBuilds, leagueItems])

  const filteredItemBuilds = leagueItems
    ? itemBuilds.filter(itemBuild => {
        for (const itemId of itemBuild.itemIdList) {
          if (itemId === selectedItemId) {
            return true
          }
        }

        return false
      })
    : []

  useEffect(() => {
    if (leagueItems) {
      setSelectedItemId(itemBuildGroups[0].id)
    }
  }, [leagueItems])

  return (
    <ItemBuildsStyled className={clsx('ItemBuilds', className)}>
      <div className="title">추천 아이템 빌드</div>

      {!leagueItems && <LoadingIcon />}

      {leagueItems && (
        <div className="content">
          <ButtonRadioList
            value={selectedItemId}
            onChange={value => setSelectedItemId(value)}
            options={itemBuildGroups.map(group => {
              return {
                value: group.id,
                label: (
                  <>
                    <div className={clsx('image', group.isMythicalLevel && 'mythical')}>
                      <DataDragonImage
                        type="item"
                        filename={leagueItems.items[group.id].image}
                        size="34px"
                        circle
                      />
                    </div>

                    <PickWinRate winRate={group.winRate} count={group.count} />
                  </>
                ),
              }
            })}
          />

          <div className="list">
            {filteredItemBuilds.map((itemBuild, i) => (
              <div className="item" key={i}>
                <div className="images">
                  {itemBuild.itemIdList.map((itemId: string, i: number) => (
                    <Fragment key={itemId}>
                      <div
                        className={clsx(
                          'image',
                          leagueItems.items[itemId].isMythicalLevel && 'mythical',
                        )}
                      >
                        <DataDragonImage
                          type="item"
                          filename={leagueItems.items[itemId].image}
                          size="30px"
                          circle
                        />
                      </div>

                      {i !== itemBuild.itemIdList.length - 1 && (
                        <i className="bx bx-chevron-right" />
                      )}
                    </Fragment>
                  ))}
                </div>

                <PickWinRate
                  winRate={itemBuild.winRate}
                  pickRate={itemBuild.pickRate}
                  count={itemBuild.count}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </ItemBuildsStyled>
  )
}

export default ItemBuilds
