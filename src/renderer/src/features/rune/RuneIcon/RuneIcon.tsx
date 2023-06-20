import clsx from 'clsx'

import DataDragonImage from '@renderer/features/asset/DataDragonImage'
import { RuneIconStyled } from '@renderer/features/rune/RuneIcon/styled'
import useDataDragonRunes from '@renderer/hooks/useDataDragonRunes'

export interface RuneIconProps {
  className?: string
  runeId: number
  active?: boolean
  size?: string
  imageOnly?: boolean
  removeBorder?: boolean
  largeImage?: boolean
  useCategoryImage?: boolean
  onClick?: (runeId: number) => void
}

const RuneIcon = ({
  className,
  runeId,
  active = true,
  size = '38px',
  imageOnly: _imageOnly,
  removeBorder,
  largeImage,
  useCategoryImage,
  onClick,
}: RuneIconProps) => {
  const data = useDataDragonRunes()
  if (!data) return null

  const imageOnly = _imageOnly || useCategoryImage
  const categoryData = data.categories[data.categoryFindMap[runeId]]
  const filename = useCategoryImage ? categoryData.icon : data.icons[runeId]

  return (
    <RuneIconStyled
      className={clsx(
        'RuneIcon',
        className,
        { active, imageOnly, largeImage, removeBorder },
        onClick && 'clickable',
      )}
      data-category={categoryData.key}
      size={size}
      onClick={() => onClick && onClick(runeId)}
    >
      <DataDragonImage type="perk-images" filename={filename} circle />
      {!imageOnly && (
        <>
          <div className="ring" />
          <div className="ring hover" />
        </>
      )}
    </RuneIconStyled>
  )
}

export default RuneIcon
