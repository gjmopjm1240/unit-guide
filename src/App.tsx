import { useEffect, useMemo, useState } from 'react';
import FilterChips from './components/FilterChips';
import QuickFilters, { type QuickFilterKey } from './components/QuickFilters';
import SearchBar from './components/SearchBar';
import Toast from './components/Toast';
import UnitCard from './components/UnitCard';
import type { UnitProcess } from './types/unit';
import { loadUnitCsv } from './utils/csv';
import { includesNormalized } from './utils/normalize';
import { classifyRequirement } from './utils/rules';

type SortKey = '원본순' | '구분순' | '유니트명순';
type CopyMode = '상세형' | '요약형';

type ToastState = { message: string; type: 'success' | 'error' } | null;

const RECENT_KEY = 'unit-guide-recent-keywords';
const FAVORITES_KEY = 'unit-guide-favorites';

function formatCopyText(unit: UnitProcess) {
  return `[유니트 불량처리 기준]\n구분: ${unit.구분}\n유니트: ${unit.유니트}\n반납지: ${unit.반납지}\n배송방법: ${unit.배송방법}\n비고: ${unit.비고}\nACTA: ${unit.ACTA}\n인수인계서: ${unit.인수인계서}\nBOX스티커: ${unit.BOX스티커}\nACTA 절차: ${unit['ACTA 절차']}`;
}

export default function App() {
  const [allData, setAllData] = useState<UnitProcess[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('전체');
  const [quickFilter, setQuickFilter] = useState<QuickFilterKey>('all');
  const [sortKey, setSortKey] = useState<SortKey>('원본순');
  const [returnPlace, setReturnPlace] = useState('전체');
  const [copyMode, setCopyMode] = useState<CopyMode>('상세형');
  const [toast, setToast] = useState<ToastState>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [recentKeywords, setRecentKeywords] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const recent = localStorage.getItem(RECENT_KEY);
    const fav = localStorage.getItem(FAVORITES_KEY);
    if (recent) setRecentKeywords(JSON.parse(recent));
    if (fav) setFavorites(JSON.parse(fav));
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setToast(null), 1800);
    return () => clearTimeout(timer);
  }, [toast]);

  async function refreshCsv() {
    setLoading(true);
    setError('');
    const csvPath = `${import.meta.env.BASE_URL}유니트 최종.csv`;
    const result = await loadUnitCsv(csvPath);
    if (result.ok) setAllData(result.data);
    else setError(result.error);
    setLoading(false);
  }

  useEffect(() => {
    refreshCsv();
  }, []);

  const categories = useMemo(() => {
    return [...new Set(allData.map((item) => item.구분).filter((item) => item !== '-'))];
  }, [allData]);

  const filtered = useMemo(() => {
    const keyword = search.trim();
    const searched = allData.filter((item) => {
      const categoryMatch = category === '전체' || item.구분 === category;
      if (!categoryMatch) return false;
      const returnPlaceMatch = returnPlace === '전체' || item.반납지 === returnPlace;
      if (!returnPlaceMatch) return false;
      const quickMatch =
        quickFilter === 'all'
          ? true
          : quickFilter === 'favorites'
            ? favorites.includes(item.유니트)
            : quickFilter === 'actaRequired'
              ? classifyRequirement(item.ACTA) === 'required'
              : quickFilter === 'actaCheck'
                ? classifyRequirement(item.ACTA) === 'checkNeeded'
                : quickFilter === 'handoverRequired'
                  ? classifyRequirement(item.인수인계서) === 'required'
                  : classifyRequirement(item.BOX스티커) === 'required';
      if (!quickMatch) return false;
      const searchableText = [
        item.유니트,
        item.구분,
        item.반납지,
        item.배송방법,
        item.비고,
        item.ACTA,
        item.인수인계서,
        item.BOX스티커,
        item['ACTA 절차']
      ].join(' ');
      return includesNormalized(searchableText, keyword);
    });

    if (sortKey === '원본순') return [...searched].sort((a, b) => a.__index - b.__index);
    if (sortKey === '구분순') return [...searched].sort((a, b) => a.구분.localeCompare(b.구분, 'ko'));
    return [...searched].sort((a, b) => a.유니트.localeCompare(b.유니트, 'ko'));
  }, [allData, search, category, sortKey, quickFilter, favorites, returnPlace]);

  const stats = useMemo(() => {
    const actaRequired = allData.filter((item) => classifyRequirement(item.ACTA) === 'required').length;
    const actaCheck = allData.filter((item) => classifyRequirement(item.ACTA) === 'checkNeeded').length;
    const favoriteCount = favorites.length;
    return { actaRequired, actaCheck, favoriteCount };
  }, [allData, favorites]);

  const returnPlaces = useMemo(() => {
    return [...new Set(allData.map((item) => item.반납지).filter((item) => item !== '-'))];
  }, [allData]);

  const pinnedFavorites = useMemo(() => {
    return filtered.filter((item) => favorites.includes(item.유니트));
  }, [filtered, favorites]);

  const nonFavoriteResults = useMemo(() => {
    return filtered.filter((item) => !favorites.includes(item.유니트));
  }, [filtered, favorites]);

  function saveRecent(value: string) {
    if (!value.trim()) return;
    const next = [value.trim(), ...recentKeywords.filter((v) => v !== value.trim())].slice(0, 5);
    setRecentKeywords(next);
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  }

  async function handleCopy(unit: UnitProcess) {
    const text =
      copyMode === '상세형'
        ? formatCopyText(unit)
        : `[유니트 불량처리 기준]\n유니트: ${unit.유니트}\n반납지: ${unit.반납지}\n배송방법: ${unit.배송방법}\nACTA: ${unit.ACTA}\n인수인계서: ${unit.인수인계서}\nBOX스티커: ${unit.BOX스티커}`;
    try {
      await navigator.clipboard.writeText(text);
      setToast({ message: '처리 기준이 복사되었습니다.', type: 'success' });
    } catch {
      setToast({ message: '복사에 실패했습니다. 다시 시도해주세요.', type: 'error' });
    }
  }

  function toggleFavorite(unitName: string) {
    const next = favorites.includes(unitName) ? favorites.filter((item) => item !== unitName) : [...favorites, unitName];
    setFavorites(next);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
  }

  return (
    <div className="min-h-screen bg-slate-100 pb-24">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 px-4 py-4 backdrop-blur">
        <h1 className="text-xl font-black text-brand-800">유니트 불량처리 가이드</h1>
        <p className="mt-1 text-sm text-slate-600">반납지 · 배송방법 · ACTA · 인수인계서 기준 조회</p>
        <div className="mt-2 flex gap-3 text-xs font-semibold text-slate-600">
          <span>전체 {allData.length}건</span>
          <span>결과 {filtered.length}건</span>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl space-y-4 px-4 py-4">
        <section className="space-y-3 rounded-2xl bg-white p-4 shadow-card">
          <SearchBar
            value={search}
            onChange={setSearch}
            onSubmit={() => saveRecent(search)}
            onClear={() => setSearch('')}
            recentKeywords={recentKeywords}
            onPickRecent={(value) => {
              setSearch(value);
              saveRecent(value);
            }}
          />

          <FilterChips categories={categories} selected={category} onSelect={setCategory} />
          <QuickFilters active={quickFilter} onChange={setQuickFilter} />

          <div className="flex flex-wrap gap-2">
            <select
              value={returnPlace}
              onChange={(e) => setReturnPlace(e.target.value)}
              className="h-11 rounded-xl border border-slate-300 px-3 text-sm"
            >
              <option>전체</option>
              {returnPlaces.map((place) => (
                <option key={place}>{place}</option>
              ))}
            </select>
            <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value as SortKey)}
              className="h-11 rounded-xl border border-slate-300 px-3 text-sm"
            >
              <option>원본순</option>
              <option>구분순</option>
              <option>유니트명순</option>
            </select>
            <select
              value={copyMode}
              onChange={(e) => setCopyMode(e.target.value as CopyMode)}
              className="h-11 rounded-xl border border-slate-300 px-3 text-sm"
            >
              <option>상세형</option>
              <option>요약형</option>
            </select>
            <button
              onClick={() => {
                setCategory('전체');
                setQuickFilter('all');
                setReturnPlace('전체');
                setSearch('');
                setSortKey('원본순');
                setCopyMode('상세형');
              }}
              className="h-11 rounded-xl bg-slate-200 px-4 text-sm font-semibold text-slate-700"
            >
              필터 초기화
            </button>
            <button onClick={refreshCsv} className="h-11 rounded-xl bg-brand-50 px-4 text-sm font-semibold text-brand-700">
              데이터 새로고침
            </button>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <article className="rounded-xl bg-white p-3 shadow-card">
            <p className="text-xs font-semibold text-slate-500">전체 데이터</p>
            <p className="text-xl font-black text-brand-800">{allData.length}</p>
          </article>
          <article className="rounded-xl bg-white p-3 shadow-card">
            <p className="text-xs font-semibold text-slate-500">ACTA 필요</p>
            <p className="text-xl font-black text-blue-700">{stats.actaRequired}</p>
          </article>
          <article className="rounded-xl bg-white p-3 shadow-card">
            <p className="text-xs font-semibold text-slate-500">ACTA 확인필요</p>
            <p className="text-xl font-black text-amber-700">{stats.actaCheck}</p>
          </article>
          <article className="rounded-xl bg-white p-3 shadow-card">
            <p className="text-xs font-semibold text-slate-500">즐겨찾기</p>
            <p className="text-xl font-black text-brand-700">{stats.favoriteCount}</p>
          </article>
        </section>

        {loading && <p className="rounded-2xl bg-white p-5 text-center text-sm text-slate-600 shadow-card">CSV를 불러오는 중입니다...</p>}
        {error && <p className="rounded-2xl bg-amber-50 p-5 text-center text-sm font-semibold text-amber-700 shadow-card">{error}</p>}
        {!loading && !error && filtered.length === 0 && (
          <p className="rounded-2xl bg-white p-5 text-center text-sm text-slate-600 shadow-card">조건에 맞는 유니트가 없습니다.</p>
        )}

        {pinnedFavorites.length > 0 && (
          <section className="space-y-3">
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-bold text-amber-700">
              즐겨찾기 유니트 ({pinnedFavorites.length})
            </div>
            {pinnedFavorites.map((unit) => (
              <UnitCard
                key={`fav-${unit.__index}-${unit.유니트}`}
                unit={unit}
                isFavorite={favorites.includes(unit.유니트)}
                onToggleFavorite={toggleFavorite}
                onCopy={handleCopy}
              />
            ))}
          </section>
        )}

        <section className="space-y-3">
          {nonFavoriteResults.map((unit) => (
            <UnitCard
              key={`${unit.__index}-${unit.유니트}`}
              unit={unit}
              isFavorite={favorites.includes(unit.유니트)}
              onToggleFavorite={toggleFavorite}
              onCopy={handleCopy}
            />
          ))}
        </section>
      </main>

      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-4 right-4 rounded-full bg-brand-700 px-4 py-3 text-xs font-bold text-white shadow-lg"
      >
        맨 위로
      </button>

      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}
