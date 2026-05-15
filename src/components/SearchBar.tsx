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
    <form
      className="space-y-2"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <label htmlFor="unit-search" className="text-sm font-semibold text-slate-700">
        유니트명 검색
      </label>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_auto_auto]">
        <input
          id="unit-search"
          type="search"
          inputMode="search"
          enterKeyHint="search"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onCompositionEnd={(e) => onChange(e.currentTarget.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.nativeEvent.isComposing) onSubmit();
          }}
          placeholder="예: SFP, AAU, 정류기"
          className="h-11 flex-1 rounded-md border border-slate-300 bg-white px-3 text-base outline-none ring-brand-600 focus:ring-1"
        />
        <button type="submit" className="h-11 rounded-md bg-brand-700 px-4 text-sm font-semibold text-white">
          검색
        </button>
        <button type="button" onClick={onClear} className="h-11 rounded-md border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700">
          초기화
        </button>
      </div>
      {recentKeywords.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {recentKeywords.map((keyword) => (
            <button
              key={keyword}
              onClick={() => onPickRecent(keyword)}
              className="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs font-semibold text-slate-600"
            >
              {keyword}
            </button>
          ))}
        </div>
      )}
    </form>
  );
}
