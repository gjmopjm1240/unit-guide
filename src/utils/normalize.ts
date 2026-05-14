export const EMPTY_PLACEHOLDER = '-';

export function cleanText(value: unknown): string {
  if (value == null) return EMPTY_PLACEHOLDER;
  const text = String(value).replace(/\uFEFF/g, '').trim();
  return text.length > 0 ? text : EMPTY_PLACEHOLDER;
}

export function normalizeSearchText(value: string): string {
  return value
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[()\-_/.,]/g, '');
}

export function includesNormalized(haystack: string, needle: string): boolean {
  if (!needle) return true;
  return normalizeSearchText(haystack).includes(normalizeSearchText(needle));
}
