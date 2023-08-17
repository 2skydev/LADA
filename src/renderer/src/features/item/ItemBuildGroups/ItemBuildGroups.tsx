import { Fragment, ReactNode, useState } from 'react'

import clsx from 'clsx'

import { ItemBuildGroup } from '@main/modules/league/types/stat.types'

import ButtonRadioList from '@renderer/components/ButtonRadioList'
import PickWinRate from '@renderer/components/PickWinRate'

import { ItemBuildGroupsStyled } from './styled'

export interface ItemBuildGroupsProps {
  className?: string
  children?: ReactNode
  itemBuildGroups: ItemBuildGroup[]
}

const ItemBuildGroups = ({ className, itemBuildGroups }: ItemBuildGroupsProps) => {
  const [selectedGroupIndex, setSelectedGroupIndex] = useState(0)

  const selectedGroup = itemBuildGroups[selectedGroupIndex]

  return (
    <ItemBuildGroupsStyled className={clsx('ItemBuildGroups', className)}>
      <div className="title">추천 아이템 빌드</div>

      <div className="content">
        <ButtonRadioList
          value={selectedGroupIndex}
          onChange={value => setSelectedGroupIndex(value)}
          options={itemBuildGroups.map((group, i) => {
            return {
              value: i,
              label: (
                <>
                  <img
                    className={clsx(group.isMythicalLevel && 'mythical')}
                    src={group.mainItem.image}
                  />

                  <PickWinRate winRate={group.winRate} count={group.count} />
                </>
              ),
            }
          })}
        />

        <div className="list">
          {selectedGroup.children.map((itemBuild, i) => (
            <div className="item" key={i}>
              <div className="images">
                {itemBuild.items.map((item, i: number) => (
                  <Fragment key={item.id}>
                    <img className={clsx(item.isMythicalLevel && 'mythical')} src={item.image} />
                    {i !== itemBuild.items.length - 1 && <i className="bx bx-chevron-right" />}
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
    </ItemBuildGroupsStyled>
  )
}

export default ItemBuildGroups
