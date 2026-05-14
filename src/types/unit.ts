export const DISPLAY_COLUMNS = [
  '구분',
  '유니트',
  '반납지',
  '배송방법',
  '비고',
  'ACTA',
  '인수인계서',
  'BOX스티커',
  'ACTA 절차'
] as const;

export type DisplayColumn = (typeof DISPLAY_COLUMNS)[number];

export type UnitProcess = {
  구분: string;
  유니트: string;
  반납지: string;
  배송방법: string;
  비고: string;
  ACTA: string;
  인수인계서: string;
  BOX스티커: string;
  'ACTA 절차': string;
  __index: number;
};
