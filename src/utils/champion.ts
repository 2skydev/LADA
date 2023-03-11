import { compareTwoStrings } from 'string-similarity';

// TODO: 초성검색
export const isEqualChampionName = (target: string, reference: string) => {
  return target.toLowerCase().includes(reference.toLowerCase());
};

// TODO: 한글
const THRESHOLD = 0.8;
export const compareChampionName = (a: string, b: string, threshold = THRESHOLD) => {
  if (a === b) {
    return 0;
  }
  return compareTwoStrings(a, b) > threshold ? 1 : -1;
};
