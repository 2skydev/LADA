import clsx from 'clsx'

import * as Styled from './LoadingIcon.styled'

export interface LoadingIconProps {
  className?: string
}

const LoadingIcon = ({ className }: LoadingIconProps) => {
  return (
    <Styled.Root className={clsx('LoadingIcon', className)}>
      <div />
      <div />
      <div />
    </Styled.Root>
  )
}

export default LoadingIcon
