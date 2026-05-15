type FilterChipsProps = {
  categories: string[];
  selected: string;
  onSelect: (value: string) => void;
};

export default function FilterChips({ categories, selected, onSelect }: FilterChipsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {['전체', ...categories].map((category) => {
        const active = selected === category;
        return (
          <button
            key={category}
            onClick={() => onSelect(category)}
            className={`rounded-md border px-3 py-1.5 text-sm font-semibold ${
              active ? 'border-brand-700 bg-brand-700 text-white' : 'border-slate-300 bg-white text-slate-700'
            }`}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}
