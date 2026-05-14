import type { UnitProcess } from '../types/unit';

type UnitCardProps = {
  unit: UnitProcess;
  isFavorite: boolean;
  onToggleFavorite: (unitName: string) => void;
  onCopy: (unit: UnitProcess) => void;
};

function badgeClass(value: string) {
  const normalized = value.replace(/\s+/g, '').toLowerCase();
  if (normalized.includes('확인')) return 'bg-amber-100 text-amber-700';
  if (normalized.includes('필요') || normalized === 'o' || normalized.includes('등록')) return 'bg-blue-100 text-blue-700';
  if (normalized.includes('불필요') || normalized === 'x') return 'bg-slate-200 text-slate-600';
  return 'bg-slate-100 text-slate-700';
}

function Row({ label, value, asBadge = false }: { label: string; value: string; asBadge?: boolean }) {
  return (
    <div className="grid grid-cols-[6rem_1fr] gap-2 border-b border-slate-100 py-2 last:border-b-0">
      <p className="text-sm font-semibold text-slate-500">{label}</p>
      {asBadge ? (
        <span className={`inline-flex w-fit rounded-full px-2.5 py-1 text-xs font-semibold ${badgeClass(value)}`}>{value}</span>
      ) : (
        <p className="text-sm text-slate-800 whitespace-pre-line">{value}</p>
      )}
    </div>
  );
}

export default function UnitCard({ unit, isFavorite, onToggleFavorite, onCopy }: UnitCardProps) {
  return (
    <article className="rounded-2xl bg-white p-4 shadow-card">
      <div className="mb-3 flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-bold text-brand-700">{unit.구분}</p>
          <h3 className="text-lg font-extrabold text-slate-900">{unit.유니트}</h3>
        </div>
        <button
          onClick={() => onToggleFavorite(unit.유니트)}
          className={`rounded-lg px-3 py-2 text-xs font-semibold ${
            isFavorite ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'
          }`}
        >
          {isFavorite ? '★ 즐겨찾기' : '☆ 즐겨찾기'}
        </button>
      </div>

      <div className="divide-y divide-slate-100">
        <Row label="반납지" value={unit.반납지} />
        <Row label="배송방법" value={unit.배송방법} />
        <Row label="비고" value={unit.비고} />
        <Row label="ACTA" value={unit.ACTA} asBadge />
        <Row label="인수인계서" value={unit.인수인계서} asBadge />
        <Row label="BOX스티커" value={unit.BOX스티커} asBadge />
        <details className="py-2">
          <summary className="cursor-pointer list-none text-sm font-semibold text-brand-700">ACTA 절차 보기</summary>
          <p className="mt-2 whitespace-pre-line text-sm text-slate-800">{unit['ACTA 절차']}</p>
        </details>
      </div>

      <button
        onClick={() => onCopy(unit)}
        className="mt-3 h-12 w-full rounded-xl bg-brand-700 text-sm font-bold text-white active:bg-brand-800"
      >
        처리 기준 복사
      </button>
    </article>
  );
}
