import { atom } from 'jotai'

export interface LayoutAtomValues {
  breadcrumbs: string[]
}

export const layoutAtom = atom<LayoutAtomValues>({
  breadcrumbs: [],
})
