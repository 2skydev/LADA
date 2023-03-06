import clsx from 'clsx';

import { LoadingIconStyled } from './styled';

export interface LoadingIconProps {
  className?: string;
}

const LoadingIcon = ({ className }: LoadingIconProps) => {
  return (
    <LoadingIconStyled className={clsx('LoadingIcon', className)}>
      <div />
      <div />
      <div />
    </LoadingIconStyled>
  );
};

export default LoadingIcon;
