import { ReactNode } from 'react';

import clsx from 'clsx';

import { DuoSynergyTableStyled } from './styled';

export interface DuoSynergyTableProps {
  className?: string;
  children?: ReactNode;
}

const DuoSynergyTable = ({ className, children }: DuoSynergyTableProps) => {
  return (
    <DuoSynergyTableStyled className={clsx('DuoSynergyTable', className)}>
      {children}
    </DuoSynergyTableStyled>
  );
};

export default DuoSynergyTable;
