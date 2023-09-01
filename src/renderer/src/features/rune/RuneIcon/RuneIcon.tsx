import clsx from 'clsx'

import useAPI from '@renderer/hooks/useAPI'

import * as Styled from './RuneIcon.styled'

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
  const { data } = useAPI('getRuneData', {
    revalidateIfStale: false,
  })

  if (!data) return null

  const imageOnly = _imageOnly || useCategoryImage
  const categoryData = data.categories[data.categoryFindMap[runeId]]
  const src = useCategoryImage ? categoryData.icon : data.icons[runeId]

  return (
    <Styled.Root
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
      <img src={src} />

      {!imageOnly && (
        <>
          <div className="ring" />
          <div className="ring hover" />
        </>
      )}
    </Styled.Root>
  )
}

export default RuneIcon
