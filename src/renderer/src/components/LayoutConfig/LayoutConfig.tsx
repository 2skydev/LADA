import { useEffect } from 'react'

import { useAtom } from 'jotai'

import { layoutAtom } from '@renderer/stores/atoms/layout.atom'

export interface LayoutConfigProps {
  breadcrumbs: string[]
}

const LayoutConfig = ({ breadcrumbs }: LayoutConfigProps) => {
  const [layout, setLayout] = useAtom(layoutAtom)

  useEffect(() => {
    setLayout({
      ...layout,
      breadcrumbs,
    })
  }, [breadcrumbs])

  return null
}

export default LayoutConfig
