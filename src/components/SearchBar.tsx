type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onClear: () => void;
  recentKeywords: string[];
  onPickRecent: (value: string) => void;
};

export default function SearchBar({ value, onChange, onSubmit, onClear, recentKeywords, onPickRecent }: SearchBarProps) {
  return (
    <div className="space-y-2">
      <label htmlFor="unit-search" className="text-sm font-semibold text-slate-700">
        유니트명 검색
      </label>
      <div className="flex items-center gap-2">
        <input
          id="unit-search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onSubmit();
          }}
          placeholder="예: SFP, AAU, 정류기"
          className="h-12 flex-1 rounded-xl border border-slate-300 px-4 text-base outline-none ring-brand-600 focus:ring-2"
        />
        <button onClick={onSubmit} className="h-12 rounded-xl bg-brand-700 px-4 text-sm font-semibold text-white">
          검색
        </button>
        <button onClick={onClear} className="h-12 rounded-xl bg-slate-200 px-4 text-sm font-semibold text-slate-700">
          초기화
        </button>
      </div>
      {recentKeywords.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {recentKeywords.map((keyword) => (
            <button
              key={keyword}
              onClick={() => onPickRecent(keyword)}
              className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700"
            >
              {keyword}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
