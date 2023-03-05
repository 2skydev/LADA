import clsx from 'clsx';

import useDataDragonAsset from '~/hooks/useDataDragonAsset';

import { DataDragonImageStyled } from './styled';

export type DataDragonImageType = 'champion' | 'item' | 'profileicon' | 'summoner' | 'passive';

export interface DataDragonImageProps {
  className?: string;
  type: DataDragonImageType;
  filename: string;
  size?: string;
  circle?: boolean;
}

const DataDragonImage = ({ className, type, filename, size, circle }: DataDragonImageProps) => {
  const url = useDataDragonAsset(type, filename);

  return (
    <DataDragonImageStyled
      className={clsx('DataDragonImage', className)}
      src={url}
      size={size}
      circle={circle}
    />
  );
};

export default DataDragonImage;
