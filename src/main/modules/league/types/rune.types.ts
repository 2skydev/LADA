export interface Rune {
  id: number
  icon: string
  name: string
  key: string
}

export interface RuneCategory {
  id: number
  icon: string
  name: string
  slots: Rune[][]
  runes: Record<number, Rune>
  key: string
}

export type RuneCategories = Record<number, RuneCategory>
export type RuneCategoryFindMap = Record<number, number>
export type RuneIcons = Record<number, string>

export interface RuneData {
  categories: RuneCategories
  categoryFindMap: RuneCategoryFindMap
  icons: RuneIcons
}
