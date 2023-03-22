export interface ChampionStats {
  count: number;
  pickRate: number;
  banRate: number;
  winRate: number;
  opScore: number;
  opTier: number;
  isHoney: boolean;
  isOp: boolean;
  ranking: number;
  rankingVariation: number;
  updatedAt: string;
  championId: number;
  laneId: number;
  honeyScore: number;
  overallRanking: number;
  overallRankingVariation: number;
  championInfo: {
    nameKr: string;
    nameUs: string;
    nameCn: string;
  };
}
