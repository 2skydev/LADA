import clsx from 'clsx'

import DataDragonImage, {
  DataDragonImageProps,
} from '@renderer/features/asset/DataDragonImage/DataDragonImage'
import useDataDragonChampNames from '@renderer/hooks/useDataDragonChampNames'

export interface ChampionImageProps extends Pick<DataDragonImageProps, 'size' | 'circle'> {
  className?: string
  championId: number
}

const ChampionImage = ({ className, championId, ...props }: ChampionImageProps) => {
  const champNames = useDataDragonChampNames()

  if (!champNames) return null

  return (
    <DataDragonImage
      className={clsx('ChampionImage', className)}
      type="champion"
      filename={champNames[championId].en}
      {...props}
    />
  )
}

export default ChampionImage
