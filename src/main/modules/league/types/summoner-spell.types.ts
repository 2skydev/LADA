export interface SummonerSpell {
  id: number
  name: string
  image: string
}

/**
 * 소환사 스펠 목록
 *
 * @description Key 값은 소환사 스펠 ID 값입니다.
 */
export type SummonerSpells = Record<number, SummonerSpell>
