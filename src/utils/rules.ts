export type RequirementStatus = 'required' | 'notRequired' | 'checkNeeded' | 'other';

export function classifyRequirement(value: string): RequirementStatus {
  const normalized = value.replace(/\s+/g, '').toLowerCase();

  if (!normalized || normalized === '-') return 'other';
  if (normalized.includes('확인')) return 'checkNeeded';
  if (normalized.includes('불필요') || normalized === 'x' || normalized === 'n' || normalized === 'no') return 'notRequired';
  if (normalized.includes('필요') || normalized === 'o' || normalized === 'y' || normalized === 'yes') return 'required';
  if (normalized.includes('등록')) return 'required';

  return 'other';
}
