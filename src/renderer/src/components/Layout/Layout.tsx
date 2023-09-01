import clsx from 'clsx'

import Content from '../Content'
import Sidebar from '../Sidebar'
import * as Styled from './Layout.styled'

export interface LayoutProps {
  className?: string
  children: React.ReactNode
}

const Layout = ({ className, children }: LayoutProps) => {
  return (
    <Styled.Root className={clsx('Layout', className)}>
      <Sidebar />
      <Content>{children}</Content>
    </Styled.Root>
  )
}

export default Layout
