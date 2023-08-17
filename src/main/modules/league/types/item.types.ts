export interface GameItem {
  id: number
  name: string
  image: string
  isMythicalLevel: boolean
}

/**
 * 리그 오브 레전드 아이템 목록
 *
 * @description Key 값은 아이템의 ID 값입니다.
 */
export type GameItems = Record<number, GameItem>

export interface GameItemData {
  gameItems: GameItems
  mythicalLevelItemIds: number[]
}
