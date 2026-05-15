export type QuickFilterKey =
  | 'all'
  | 'favorites'
  | 'actaRequired'
  | 'actaCheck'
  | 'handoverRequired'
  | 'boxRequired';

type QuickFiltersProps = {
  active: QuickFilterKey;
  onChange: (key: QuickFilterKey) => void;
};

const OPTIONS: { key: QuickFilterKey; label: string }[] = [
  { key: 'all', label: '전체' },
  { key: 'favorites', label: '즐겨찾기' },
  { key: 'actaRequired', label: 'ACTA 필요' },
  { key: 'actaCheck', label: 'ACTA 확인필요' },
  { key: 'handoverRequired', label: '인수인계서 필요' },
  { key: 'boxRequired', label: 'BOX스티커 필요' }
];

export default function QuickFilters({ active, onChange }: QuickFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {OPTIONS.map((option) => {
        const isActive = active === option.key;
        return (
          <button
            key={option.key}
            onClick={() => onChange(option.key)}
            className={`rounded-md border px-3 py-1.5 text-xs font-semibold ${
              isActive ? 'border-brand-700 bg-brand-50 text-brand-800' : 'border-slate-300 bg-white text-slate-700'
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
