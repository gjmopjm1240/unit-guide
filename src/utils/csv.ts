import Papa from 'papaparse';
import type { UnitProcess } from '../types/unit';
import { cleanText } from './normalize';

const REQUIRED_DISPLAY_HEADERS = ['구분', '유니트', '반납지', '배송방법', '비고', 'ACTA', '인수인계서', 'BOX스티커', 'ACTA 절차'] as const;

type RawRow = Record<string, string | undefined>;

const HEADER_ALIASES: Record<(typeof REQUIRED_DISPLAY_HEADERS)[number], string[]> = {
  구분: ['구분'],
  유니트: ['유니트'],
  반납지: ['반납지', '불량반납(배송지)'],
  배송방법: ['배송방법'],
  비고: ['비고'],
  ACTA: ['ACTA', 'ACTA 수리등록'],
  인수인계서: ['인수인계서'],
  BOX스티커: ['BOX스티커', 'BOX 스티커', 'BOX \n스티커부착'],
  'ACTA 절차': ['ACTA 절차', 'ACTA 수리등록 절차']
};

export type CsvLoadResult =
  | { ok: true; data: UnitProcess[] }
  | { ok: false; error: string };

function normalizeHeaderName(header: string): string {
  return header.replace(/\uFEFF/g, '').replace(/\s+/g, ' ').trim();
}

function findHeader(actualHeaders: string[], candidates: string[]): string | undefined {
  const normalizedMap = new Map(actualHeaders.map((h) => [normalizeHeaderName(h), h]));
  for (const candidate of candidates) {
    const found = normalizedMap.get(normalizeHeaderName(candidate));
    if (found) return found;
  }
  return undefined;
}

function decodeCsv(bytes: Uint8Array): string {
  const utf8 = new TextDecoder('utf-8', { fatal: false }).decode(bytes);
  if (utf8.includes('구분') || utf8.includes('유니트')) return utf8;
  try {
    return new TextDecoder('euc-kr', { fatal: false }).decode(bytes);
  } catch {
    return utf8;
  }
}

export async function loadUnitCsv(path: string): Promise<CsvLoadResult> {
  try {
    const response = await fetch(path);
    if (!response.ok) {
      return { ok: false, error: `CSV 파일을 불러오지 못했습니다. (HTTP ${response.status})` };
    }

    const bytes = new Uint8Array(await response.arrayBuffer());
    const csvText = decodeCsv(bytes).replace(/^\uFEFF/, '');

    const parsed = Papa.parse<RawRow>(csvText, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.replace(/\uFEFF/g, '').trim()
    });

    if (parsed.errors.length > 0) {
      return { ok: false, error: `CSV 파싱 오류: ${parsed.errors[0].message}` };
    }

    const fields = parsed.meta.fields ?? [];
    const headerMap = new Map<string, string>();
    const missing: string[] = [];

    REQUIRED_DISPLAY_HEADERS.forEach((displayHeader) => {
      const found = findHeader(fields, HEADER_ALIASES[displayHeader]);
      if (!found) {
        missing.push(displayHeader);
        return;
      }
      headerMap.set(displayHeader, found);
    });

    if (missing.length > 0) {
      return { ok: false, error: `필수 컬럼이 누락되었습니다: ${missing.join(', ')}` };
    }

    const data: UnitProcess[] = parsed.data.map((row, index) => ({
      구분: cleanText(row[headerMap.get('구분')!]),
      유니트: cleanText(row[headerMap.get('유니트')!]),
      반납지: cleanText(row[headerMap.get('반납지')!]),
      배송방법: cleanText(row[headerMap.get('배송방법')!]),
      비고: cleanText(row[headerMap.get('비고')!]),
      ACTA: cleanText(row[headerMap.get('ACTA')!]),
      인수인계서: cleanText(row[headerMap.get('인수인계서')!]),
      BOX스티커: cleanText(row[headerMap.get('BOX스티커')!]),
      'ACTA 절차': cleanText(row[headerMap.get('ACTA 절차')!]),
      __index: index
    }));

    return { ok: true, data };
  } catch (error) {
    return {
      ok: false,
      error: `CSV 로딩 중 오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`
    };
  }
}
