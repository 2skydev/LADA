export interface Skill<Id extends SkillId> {
  id: Id
  image: string
}

export interface Skills {
  Q: Skill<'Q'>
  W: Skill<'W'>
  E: Skill<'E'>
  R: Skill<'R'>
}

export type SkillId = 'Q' | 'W' | 'E' | 'R'
export type SkillMasterList = [SkillId, SkillId, SkillId]
export type SkillLv15List = [
  SkillId,
  SkillId,
  SkillId,
  SkillId,
  SkillId,
  SkillId,
  SkillId,
  SkillId,
  SkillId,
  SkillId,
  SkillId,
  SkillId,
  SkillId,
  SkillId,
  SkillId,
]
