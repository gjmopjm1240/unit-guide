import { useState } from 'react';
import type { UnitProcess } from '../types/unit';
import { classifyRequirement } from '../utils/rules';

type UnitCardProps = {
  unit: UnitProcess;
  isFavorite: boolean;
  onToggleFavorite: (unitName: string) => void;
  onUpdate: (index: number, next: Partial<UnitProcess>) => void;
};

type EditableFields = Pick<UnitProcess, '반납지' | '배송방법' | '비고' | 'ACTA' | '인수인계서' | 'BOX스티커' | 'ACTA 절차'>;

function badgeClass(value: string) {
  const status = classifyRequirement(value);
  if (status === 'checkNeeded') return 'bg-amber-100 text-amber-700';
  if (status === 'required') return 'bg-blue-100 text-blue-700';
  if (status === 'notRequired') return 'bg-slate-200 text-slate-600';
  return 'bg-slate-100 text-slate-700';
}

function Row({ label, value, asBadge = false }: { label: string; value: string; asBadge?: boolean }) {
  return (
    <div className="grid grid-cols-[6rem_1fr] gap-2 border-b border-slate-100 py-2 last:border-b-0">
      <p className="text-sm font-semibold text-slate-500">{label}</p>
      {asBadge ? (
        <span className={`inline-flex w-fit rounded-full px-2.5 py-1 text-xs font-semibold ${badgeClass(value)}`}>{value}</span>
      ) : (
        <p className="whitespace-pre-line text-sm text-slate-800">{value}</p>
      )}
    </div>
  );
}

export default function UnitCard({ unit, isFavorite, onToggleFavorite, onUpdate }: UnitCardProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<EditableFields>({
    반납지: unit.반납지,
    배송방법: unit.배송방법,
    비고: unit.비고,
    ACTA: unit.ACTA,
    인수인계서: unit.인수인계서,
    BOX스티커: unit.BOX스티커,
    'ACTA 절차': unit['ACTA 절차']
  });

  const syncFromUnit = () => {
    setDraft({
      반납지: unit.반납지,
      배송방법: unit.배송방법,
      비고: unit.비고,
      ACTA: unit.ACTA,
      인수인계서: unit.인수인계서,
      BOX스티커: unit.BOX스티커,
      'ACTA 절차': unit['ACTA 절차']
    });
  };

  const saveEdit = () => {
    onUpdate(unit.__index, draft);
    setEditing(false);
  };

  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="mb-3 flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
        <div>
          <p className="text-xs font-semibold text-slate-500">{unit.구분}</p>
          <h3 className="text-lg font-bold text-slate-900">{unit.유니트}</h3>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onToggleFavorite(unit.유니트)}
            className={`rounded-md border px-2.5 py-1.5 text-xs font-semibold ${
              isFavorite ? 'border-amber-300 bg-amber-50 text-amber-700' : 'border-slate-300 bg-white text-slate-700'
            }`}
          >
            {isFavorite ? '★ 즐겨찾기' : '☆ 즐겨찾기'}
          </button>
          {!editing ? (
            <button onClick={() => setEditing(true)} className="rounded-md bg-brand-700 px-3 py-1.5 text-xs font-semibold text-white">
              수정
            </button>
          ) : (
            <>
              <button onClick={saveEdit} className="rounded-md bg-brand-700 px-3 py-1.5 text-xs font-semibold text-white">
                저장
              </button>
              <button
                onClick={() => {
                  syncFromUnit();
                  setEditing(false);
                }}
                className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700"
              >
                취소
              </button>
            </>
          )}
        </div>
      </div>

      {!editing ? (
        <div className="divide-y divide-slate-100">
          <Row label="반납지" value={unit.반납지} />
          <Row label="배송방법" value={unit.배송방법} />
          <Row label="비고" value={unit.비고} />
          <Row label="ACTA" value={unit.ACTA} asBadge />
          <Row label="인수인계서" value={unit.인수인계서} asBadge />
          <Row label="BOX스티커" value={unit.BOX스티커} asBadge />
          <Row label="ACTA 절차" value={unit['ACTA 절차']} />
        </div>
      ) : (
        <div className="space-y-2">
          <Field label="반납지" value={draft.반납지} onChange={(v) => setDraft((prev) => ({ ...prev, 반납지: v }))} />
          <Field label="배송방법" value={draft.배송방법} onChange={(v) => setDraft((prev) => ({ ...prev, 배송방법: v }))} />
          <Field label="비고" value={draft.비고} onChange={(v) => setDraft((prev) => ({ ...prev, 비고: v }))} multiline />
          <Field label="ACTA" value={draft.ACTA} onChange={(v) => setDraft((prev) => ({ ...prev, ACTA: v }))} />
          <Field label="인수인계서" value={draft.인수인계서} onChange={(v) => setDraft((prev) => ({ ...prev, 인수인계서: v }))} />
          <Field label="BOX스티커" value={draft.BOX스티커} onChange={(v) => setDraft((prev) => ({ ...prev, BOX스티커: v }))} />
          <Field
            label="ACTA 절차"
            value={draft['ACTA 절차']}
            onChange={(v) => setDraft((prev) => ({ ...prev, 'ACTA 절차': v }))}
            multiline
          />
        </div>
      )}
    </article>
  );
}

function Field({
  label,
  value,
  onChange,
  multiline = false
}: {
  label: string;
  value: string;
  onChange: (next: string) => void;
  multiline?: boolean;
}) {
  return (
    <label className="grid gap-1">
      <span className="text-xs font-semibold text-slate-600">{label}</span>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="min-h-20 rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none ring-brand-600 focus:ring-2"
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-11 rounded-xl border border-slate-300 px-3 text-sm outline-none ring-brand-600 focus:ring-2"
        />
      )}
    </label>
  );
}
