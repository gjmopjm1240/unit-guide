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
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              active ? 'bg-brand-700 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}
