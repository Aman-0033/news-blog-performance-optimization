import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import {
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  Clock,
  Command,
  Database,
  HardDrive,
  Layers,
  Moon,
  PlusCircle,
  Radio,
  RefreshCw,
  Search,
  Sparkles,
  Sun,
  Terminal,
  Trash2,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { sanitizeInput } from './utils/sanitize';
import {
  trackInteraction,
  subscribeTelemetry,
  clearTelemetryHistory,
  getTelemetryHistory,
} from './utils/telemetry';

/**
 * Ticket: ENG-84718
 * Stretch Assignment: Performance Optimization for News Blog
 * Flagship Enterprise Command Center Architecture
 * Inspired by Linear, Vercel, and Raycast
 * Assignee: Aman Saini (PDIT-INT-1252)
 * Tech Lead: Deepika Kumari
 * Reporter: Amit Sharma
 */

const INITIAL_ARTICLES = [
  {
    id: 'art-1',
    headline: 'Next-Gen AI Microchips Announced for High-Throughput Edge Devices',
    slug: 'next-gen-ai-chips-edge',
    category: 'Technology',
    payloadKb: 340,
    loadTimeMs: 420,
    status: 'Optimized',
  },
  {
    id: 'art-2',
    headline: 'Breaking News: Global Economic Forum Ratifies Digital Trade Treaty',
    slug: 'global-economic-trade-treaty',
    category: 'Breaking News',
    payloadKb: 820,
    loadTimeMs: 1350,
    status: 'Needs Optimization',
  },
  {
    id: 'art-3',
    headline: 'Autonomous Cloud Infrastructure Lowers Server Carbon Footprint',
    slug: 'autonomous-cloud-infrastructure',
    category: 'Tech',
    payloadKb: 410,
    loadTimeMs: 480,
    status: 'Optimized',
  },
  {
    id: 'art-4',
    headline: 'Central Bank Releases Annual Digital Asset & Currency Framework',
    slug: 'central-bank-digital-currency-framework',
    category: 'Finance',
    payloadKb: 960,
    loadTimeMs: 1520,
    status: 'Needs Optimization',
  },
  {
    id: 'art-5',
    headline: 'Multimedia Feature: Deep Ocean Exploration Captured in Ultra-HD',
    slug: 'multimedia-deep-ocean-exploration',
    category: 'Multimedia',
    payloadKb: 1680,
    loadTimeMs: 2450,
    status: 'Needs Optimization',
  },
];

const INITIAL_FORM = {
  headline: '',
  slug: '',
  category: 'Technology',
  payloadKb: '',
  loadTimeMs: '',
};

const CATEGORIES = [
  'All',
  'Technology',
  'Tech',
  'Breaking News',
  'Finance',
  'Multimedia',
];

/* =========================================================================
 * REACT.MEMO CHILD PRESENTATION COMPONENTS
 * ========================================================================= */

const KpiCard = React.memo(function KpiCard({
  title,
  value,
  unit,
  description,
  trend,
  trendType = 'neutral',
  progressPercent = 0,
  icon: Icon,
  theme,
}) {
  const isCyber = theme === 'cyber';

  return (
    <div
      className={`relative overflow-hidden rounded-2xl p-4 sm:p-6 transition-all duration-200 ${
        isCyber
          ? 'bg-[#121216] border border-neutral-800/90 shadow-xl shadow-black/40 hover:border-neutral-700'
          : 'bg-white border border-slate-200/90 shadow-sm hover:shadow-md'
      }`}
    >
      {/* Subtle top ambient glow in cyber dark mode */}
      {isCyber && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#007BA7]/60 to-transparent" />
      )}

      <div className="flex items-center justify-between gap-4">
        <span
          className={`text-xs font-bold uppercase tracking-wider ${
            isCyber ? 'text-neutral-400' : 'text-slate-500'
          }`}
        >
          {title}
        </span>
        {Icon && (
          <div
            className={`p-2 rounded-xl flex items-center justify-center shrink-0 ${
              isCyber
                ? 'bg-neutral-800/80 text-[#007BA7] border border-neutral-700/50'
                : 'bg-slate-100 text-slate-800 border border-slate-200/60'
            }`}
          >
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="mt-4 flex items-baseline gap-2">
        <span
          className={`font-mono tracking-tight text-3xl font-bold tabular-nums ${
            isCyber ? 'text-white' : 'text-slate-950'
          }`}
        >
          {value}
        </span>
        {unit && (
          <span
            className={`text-sm font-semibold ${
              isCyber ? 'text-neutral-400' : 'text-slate-500'
            }`}
          >
            {unit}
          </span>
        )}
      </div>

      {/* Sleek horizontal progress bar that animates smoothly */}
      <div className="mt-4">
        <div
          className={`w-full h-1.5 rounded-full overflow-hidden ${
            isCyber ? 'bg-neutral-800' : 'bg-slate-100'
          }`}
        >
          <div
            className={`h-full rounded-full transition-all duration-500 ease-out ${
              isCyber ? 'bg-[#007BA7]' : 'bg-slate-900'
            }`}
            style={{ width: `${Math.min(100, Math.max(4, progressPercent))}%` }}
          />
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-2 text-xs">
        {description && (
          <span className={`truncate ${isCyber ? 'text-neutral-400' : 'text-slate-500'}`}>
            {description}
          </span>
        )}
        {trend && (
          <span
            className={`shrink-0 px-2 py-0.5 rounded-md font-mono text-[11px] font-semibold border ${
              trendType === 'positive'
                ? isCyber
                  ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800/40'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : trendType === 'alert'
                ? isCyber
                  ? 'bg-[#FF2D95]/15 text-[#FF2D95] border-[#FF2D95]/30'
                  : 'bg-rose-50 text-rose-700 border-rose-200'
                : isCyber
                ? 'bg-neutral-800/70 text-neutral-300 border-neutral-700/50'
                : 'bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            {trend}
          </span>
        )}
      </div>
    </div>
  );
});

const ArticleTableRow = React.memo(function ArticleTableRow({
  article,
  onOptimize,
  isProcessing,
  theme,
}) {
  const isCyber = theme === 'cyber';
  const isOptimized = article.status === 'Optimized';

  // Relative visual metrics utilization
  const payloadPercent = Math.min(100, Math.round((article.payloadKb / 2000) * 100));
  const loadTimePercent = Math.min(100, Math.round((article.loadTimeMs / 2500) * 100));

  return (
    <tr
      data-testid="article-row"
      className={`border-b transition-colors ${
        isCyber
          ? 'border-neutral-800/80 hover:bg-neutral-800/30 text-slate-200'
          : 'border-slate-200/90 hover:bg-slate-50/80 text-slate-900'
      }`}
    >
      {/* Headline */}
      <td className="p-4 max-w-xs">
        <div className="font-semibold truncate text-sm" title={article.headline}>
          {article.headline}
        </div>
        <div
          className={`text-[11px] font-mono mt-0.5 ${
            isCyber ? 'text-neutral-500' : 'text-slate-400'
          }`}
        >
          ID: {article.id}
        </div>
      </td>

      {/* Slug */}
      <td className="p-4 max-w-[150px]">
        <span
          className={`inline-block font-mono text-xs px-2 py-1 rounded truncate max-w-full ${
            isCyber
              ? 'bg-neutral-900 text-neutral-300 border border-neutral-800'
              : 'bg-slate-100 text-slate-700 border border-slate-200/60'
          }`}
          title={article.slug}
        >
          {article.slug}
        </span>
      </td>

      {/* Category */}
      <td className="p-4 text-xs font-medium">
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-full ${
            isCyber
              ? 'bg-neutral-800 text-neutral-300'
              : 'bg-slate-100 text-slate-700'
          }`}
        >
          {article.category}
        </span>
      </td>

      {/* Payload KB with horizontal utilization bar */}
      <td className="p-4 text-xs font-mono">
        <div className="font-bold">{article.payloadKb} KB</div>
        <div
          className={`w-20 h-1 mt-1.5 rounded-full overflow-hidden ${
            isCyber ? 'bg-neutral-800' : 'bg-slate-200'
          }`}
        >
          <div
            className={`h-full rounded-full ${
              article.payloadKb > 1000
                ? isCyber
                  ? 'bg-[#FF2D95]'
                  : 'bg-amber-600'
                : isCyber
                ? 'bg-[#007BA7]'
                : 'bg-slate-800'
            }`}
            style={{ width: `${payloadPercent}%` }}
          />
        </div>
      </td>

      {/* Load Time ms with horizontal latency bar */}
      <td className="p-4 text-xs font-mono">
        <div className="font-bold">{article.loadTimeMs} ms</div>
        <div
          className={`w-20 h-1 mt-1.5 rounded-full overflow-hidden ${
            isCyber ? 'bg-neutral-800' : 'bg-slate-200'
          }`}
        >
          <div
            className={`h-full rounded-full ${
              article.loadTimeMs > 1000
                ? isCyber
                  ? 'bg-[#FF2D95]'
                  : 'bg-rose-600'
                : isCyber
                ? 'bg-[#007BA7]'
                : 'bg-emerald-600'
            }`}
            style={{ width: `${loadTimePercent}%` }}
          />
        </div>
      </td>

      {/* Status Badge */}
      <td className="p-4">
        <span
          data-testid="article-status"
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold ${
            isOptimized
              ? isCyber
                ? 'bg-[#007BA7]/20 text-[#38bdf8] border border-[#007BA7]/40 font-mono'
                : 'bg-slate-900 text-white'
              : isCyber
              ? 'bg-[#FF2D95]/15 text-[#FF2D95] border border-[#FF2D95]/30 font-mono'
              : 'bg-slate-200 text-slate-800'
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isOptimized
                ? isCyber
                  ? 'bg-[#007BA7]'
                  : 'bg-emerald-400'
                : isCyber
                ? 'bg-[#FF2D95]'
                : 'bg-amber-500'
            }`}
          />
          {article.status}
        </span>
      </td>

      {/* Action Button */}
      <td className="p-4">
        <button
          type="button"
          onClick={() => onOptimize(article.id)}
          disabled={isProcessing}
          aria-label={`Optimize article: ${article.headline}`}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold active:scale-95 transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed ${
            isOptimized
              ? isCyber
                ? 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700 border border-neutral-700'
                : 'bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-300'
              : isCyber
              ? 'bg-[#007BA7] text-white hover:bg-[#006e96] shadow-md shadow-[#007BA7]/30'
              : 'bg-slate-900 text-white hover:bg-slate-800 shadow-sm'
          }`}
        >
          {isOptimized ? 'Re-optimize' : 'Optimize Asset'}
        </button>
      </td>
    </tr>
  );
});

const EmptyState = React.memo(function EmptyState({ onReset, theme }) {
  const isCyber = theme === 'cyber';

  return (
    <div
      className={`p-8 text-center rounded-2xl border transition-all duration-200 ${
        isCyber
          ? 'bg-[#121216] border-neutral-800 text-slate-200'
          : 'bg-white border-slate-200 text-slate-900'
      }`}
    >
      <div className="flex justify-center">
        <div
          className={`w-16 h-16 rounded-2xl flex items-center justify-center border ${
            isCyber
              ? 'bg-neutral-900 text-[#007BA7] border-neutral-800 shadow-inner'
              : 'bg-slate-100 text-slate-700 border-slate-200 shadow-inner'
          }`}
        >
          <Radio className="w-8 h-8 animate-pulse" />
        </div>
      </div>
      <div
        className={`mt-4 font-bold text-lg tracking-tight ${
          isCyber ? 'text-white' : 'text-slate-950'
        }`}
      >
        No data found
      </div>
      <p
        className={`text-sm mt-1 max-w-sm mx-auto ${
          isCyber ? 'text-neutral-400' : 'text-slate-500'
        }`}
      >
        No news articles match your current search query or category filter.
      </p>
      <div className="mt-6">
        <button
          type="button"
          onClick={onReset}
          aria-label="Reset filters"
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider active:scale-95 transition-all duration-150 ${
            isCyber
              ? 'bg-[#007BA7] text-white hover:bg-[#006e96] shadow-lg shadow-[#007BA7]/30'
              : 'bg-slate-900 text-white hover:bg-slate-800 shadow-sm'
          }`}
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
});

const TelemetryActivityLog = React.memo(function TelemetryActivityLog({
  logs,
  onClear,
  theme,
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isCyber = theme === 'cyber';

  return (
    <section
      className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
        isCyber
          ? 'bg-slate-950 text-slate-100 font-mono text-xs p-4 border-slate-800 shadow-2xl'
          : 'bg-slate-950 text-slate-100 font-mono text-xs p-4 border-slate-800 shadow-xl'
      }`}
    >
      {/* Terminal Title Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-xs uppercase tracking-wider text-slate-200">
              Developer Telemetry Terminal
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-emerald-400 border border-slate-700">
              Live NFR Stream
            </span>
            <span className="text-[11px] text-slate-400">
              ({logs.length} logged)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onClear}
            aria-label="Clear telemetry logs"
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white rounded-md border border-slate-700 transition-colors active:scale-95"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Logs</span>
          </button>
          <button
            type="button"
            onClick={() => setIsCollapsed((prev) => !prev)}
            aria-label="Toggle developer telemetry terminal"
            className="p-1.5 text-slate-400 hover:text-slate-200 bg-slate-800/60 hover:bg-slate-800 rounded-md transition-colors"
          >
            {isCollapsed ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronUp className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Terminal Output Body */}
      {!isCollapsed && (
        <div className="mt-3">
          <div className="text-[11px] text-slate-400 mb-2 flex items-center gap-2">
            <span className="text-emerald-400">root@command-center:~$</span>
            <span>telemetry --tail -f --nfr=ENG-84718</span>
            <span className="w-2 h-4 bg-emerald-400 animate-pulse inline-block" />
          </div>

          <div className="max-h-52 overflow-y-auto space-y-1.5 pr-1">
            {logs.length === 0 ? (
              <div className="p-3 text-slate-400 italic bg-slate-900/60 rounded-lg border border-slate-800">
                No telemetry recorded yet. Live interaction audit stream active.
              </div>
            ) : (
              logs.map((log) => (
                <div
                  key={log.id}
                  className="p-2.5 bg-slate-900/80 rounded-lg border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-start gap-2 truncate">
                    <span className="text-emerald-400 text-[10px] shrink-0 font-bold bg-slate-800 px-1.5 py-0.5 rounded">
                      AUDIT
                    </span>
                    <span className="truncate text-slate-200">
                      {log.message}
                    </span>
                  </div>
                  <span className="text-slate-400 text-[10px] shrink-0 ml-auto font-mono">
                    {log.timestamp}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </section>
  );
});

/* =========================================================================
 * MAIN PORTAL COMPONENT
 * ========================================================================= */

export default function App() {
  const [articles, setArticles] = useState(INITIAL_ARTICLES);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('loadTimeAsc');
  const [isSlow3G, setIsSlow3G] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [telemetryLogs, setTelemetryLogs] = useState([]);
  const [theme, setTheme] = useState('corporate'); // 'corporate' | 'cyber'

  const searchInputRef = useRef(null);

  // Subscribe to telemetry state
  useEffect(() => {
    setTelemetryLogs(getTelemetryHistory());
    const unsubscribe = subscribeTelemetry((updatedLogs) => {
      setTelemetryLogs([...updatedLogs]);
    });
    return unsubscribe;
  }, []);

  // Keyboard shortcut: Ctrl + K or / to focus search input
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (
        e.key === '/' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'SELECT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  /* =========================================================================
   * 1. REACT PERFORMANCE ARCHITECTURE: useMemo
   * ========================================================================= */

  // 1a) Filtering and sorting articles dataset
  const filteredAndSortedArticles = useMemo(() => {
    let result = [...articles];

    // Category filter
    if (selectedCategory !== 'All') {
      result = result.filter((item) => item.category === selectedCategory);
    }

    // Search query filter (search across headline, slug, category)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        (item) =>
          item.headline.toLowerCase().includes(query) ||
          item.slug.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query)
      );
    }

    // Sort order
    result.sort((a, b) => {
      if (sortBy === 'loadTimeAsc') return a.loadTimeMs - b.loadTimeMs;
      if (sortBy === 'loadTimeDesc') return b.loadTimeMs - a.loadTimeMs;
      if (sortBy === 'payloadAsc') return a.payloadKb - b.payloadKb;
      if (sortBy === 'payloadDesc') return b.payloadKb - a.payloadKb;
      if (sortBy === 'title') return a.headline.localeCompare(b.headline);
      return 0;
    });

    return result;
  }, [articles, selectedCategory, searchQuery, sortBy]);

  // 1b) Calculating top KPI summary cards
  const kpiMetrics = useMemo(() => {
    const total = articles.length;
    if (total === 0) {
      return {
        totalArticles: 0,
        avgLoadTime: 0,
        totalPayload: 0,
        optimizedRatio: 0,
      };
    }
    const totalLoadTime = articles.reduce((acc, curr) => acc + curr.loadTimeMs, 0);
    const totalPayload = articles.reduce((acc, curr) => acc + curr.payloadKb, 0);
    const optimizedCount = articles.filter((a) => a.status === 'Optimized').length;

    return {
      totalArticles: total,
      avgLoadTime: Math.round(totalLoadTime / total),
      totalPayload: Math.round(totalPayload),
      optimizedRatio: Math.round((optimizedCount / total) * 100),
    };
  }, [articles]);

  /* =========================================================================
   * 2. REACT PERFORMANCE ARCHITECTURE: useCallback
   * ========================================================================= */

  const handleSearchChange = useCallback((e) => {
    const val = e.target.value;
    setSearchQuery(val);
    trackInteraction('Search Filter Changed', { query: val });
  }, []);

  const handleCategoryChange = useCallback((e) => {
    const val = e.target.value;
    setSelectedCategory(val);
    trackInteraction('Category Filter Changed', { category: val });
  }, []);

  const handleCategorySelectDirect = useCallback((category) => {
    setSelectedCategory(category);
    trackInteraction('Category Filter Changed', { category });
  }, []);

  const handleSortChange = useCallback((e) => {
    const val = e.target.value;
    setSortBy(val);
    trackInteraction('Sort Order Changed', { sortBy: val });
  }, []);

  const handleResetFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSortBy('loadTimeAsc');
    trackInteraction('Filters Reset');
  }, []);

  const handleToggleNetworkMode = useCallback(() => {
    setIsSlow3G((prev) => {
      const nextMode = !prev;
      trackInteraction('Network Simulation Toggled', { slow3G: nextMode });
      return nextMode;
    });
  }, []);

  const handleToggleTheme = useCallback(() => {
    setTheme((prev) => {
      const nextTheme = prev === 'corporate' ? 'cyber' : 'corporate';
      trackInteraction('UI Theme Switched', { theme: nextTheme });
      return nextTheme;
    });
  }, []);

  const handleOptimizeArticle = useCallback(
    (id) => {
      setIsLoading(true);
      setLoadingMessage('Simulating slow 3G asset payload compression & cache warming...');
      trackInteraction('Optimize Article Initiated', { articleId: id });

      setTimeout(
        () => {
          setArticles((prev) =>
            prev.map((art) => {
              if (art.id === id) {
                return {
                  ...art,
                  payloadKb: Math.max(90, Math.round(art.payloadKb * 0.45)),
                  loadTimeMs: Math.max(120, Math.round(art.loadTimeMs * 0.4)),
                  status: 'Optimized',
                };
              }
              return art;
            })
          );
          setIsLoading(false);
          setLoadingMessage('');
          trackInteraction('Optimize Article Completed', { articleId: id });
        },
        isSlow3G ? 1200 : 400
      );
    },
    [isSlow3G]
  );

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleAuditSubmit = useCallback(
    (e) => {
      e.preventDefault();

      const sanitizedHeadline = sanitizeInput(formData.headline);
      const sanitizedSlug = sanitizeInput(formData.slug);
      const numPayload = Number(formData.payloadKb);
      const numLoadTime = Number(formData.loadTimeMs);

      const errors = {};

      if (!sanitizedHeadline) {
        errors.headline = 'Article headline is required.';
      }

      if (!sanitizedSlug) {
        errors.slug = 'Article slug is required.';
      }

      if (!formData.payloadKb || isNaN(numPayload) || numPayload <= 0) {
        errors.payloadKb = 'Payload must be greater than 0 KB.';
      }

      if (!formData.loadTimeMs || isNaN(numLoadTime) || numLoadTime <= 0) {
        errors.loadTimeMs = 'Load time must be greater than 0 ms.';
      }

      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        trackInteraction('Audit Form Validation Failed', { errors });
        return;
      }

      // Input is valid
      setFormErrors({});

      const newArticle = {
        id: `art-${Date.now()}`,
        headline: sanitizedHeadline,
        slug: sanitizedSlug,
        category: formData.category,
        payloadKb: numPayload,
        loadTimeMs: numLoadTime,
        status: numPayload <= 500 && numLoadTime <= 500 ? 'Optimized' : 'Needs Optimization',
      };

      setArticles((prev) => [newArticle, ...prev]);
      setFormData(INITIAL_FORM);

      trackInteraction('Article Audit Logged', {
        headline: sanitizedHeadline,
        slug: sanitizedSlug,
        category: formData.category,
      });

      if (isSlow3G) {
        setIsLoading(true);
        setLoadingMessage('Uploading article audit telemetry over slow 3G simulation...');
        setTimeout(() => {
          setIsLoading(false);
          setLoadingMessage('');
        }, 1200);
      }
    },
    [formData, isSlow3G]
  );

  const handleClearLogs = useCallback(() => {
    clearTelemetryHistory();
    trackInteraction('Telemetry Logs Cleared');
  }, []);

  const isCyber = theme === 'cyber';

  return (
    <div
      className={`min-h-screen transition-colors duration-300 font-sans ${
        isCyber
          ? 'bg-[#0A0A0A] text-slate-100 bg-dot-grid-dark'
          : 'bg-slate-50 text-slate-900 bg-dot-grid-light'
      }`}
    >
      {/* =========================================================================
       * 2. GLASSMORPHIC COMMAND HEADER & LIVE NETWORK CAPSULE
       * ========================================================================= */}
      <header
        className={`sticky top-0 z-30 backdrop-blur-md border-b transition-colors duration-300 ${
          isCyber
            ? 'bg-[#0A0A0A]/85 border-neutral-800 shadow-xl shadow-black/40'
            : 'bg-white/85 border-slate-200 shadow-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Executive Brand Badge */}
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-all ${
                isCyber
                  ? 'bg-neutral-900 border-neutral-700 text-[#007BA7] shadow-lg shadow-[#007BA7]/20'
                  : 'bg-slate-950 border-slate-800 text-white shadow-sm'
              }`}
            >
              <Command className="w-5 h-5" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-0.5 text-[11px] font-mono font-bold rounded ${
                    isCyber
                      ? 'bg-neutral-800 text-[#38bdf8] border border-neutral-700'
                      : 'bg-slate-900 text-white'
                  }`}
                >
                  ENG-84718
                </span>
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    isCyber
                      ? 'bg-neutral-800 text-neutral-300'
                      : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}
                >
                  Stretch Assignment
                </span>

                {/* Live System Status Indicator */}
                <div className="flex items-center gap-1.5 ml-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span
                    className={`text-[10px] font-mono uppercase tracking-wider font-semibold ${
                      isCyber ? 'text-emerald-400' : 'text-emerald-700'
                    }`}
                  >
                    SYSTEM READY
                  </span>
                </div>
              </div>

              <h1
                className={`text-lg md:text-xl font-bold tracking-tight mt-0.5 ${
                  isCyber ? 'text-white' : 'text-slate-950'
                }`}
              >
                Performance Optimization
              </h1>
              <p
                className={`text-xs mt-0.5 hidden sm:block ${
                  isCyber ? 'text-neutral-400' : 'text-slate-500'
                }`}
              >
                Assignee: Aman Saini (PDIT-INT-1252) | Tech Lead: Deepika Kumari |
                Reporter: Amit Sharma
              </p>
            </div>
          </div>

          {/* Right Header Controls: Network Mode Capsule & UI Theme Switcher */}
          <div className="flex items-center flex-wrap gap-2.5">
            {/* Segmented Tactile Switch for Slow 3G / Fast Wi-Fi */}
            <div
              className={`p-1 rounded-xl border flex items-center gap-1 ${
                isCyber
                  ? 'bg-neutral-900/90 border-neutral-800'
                  : 'bg-slate-100/90 border-slate-200'
              }`}
            >
              <button
                type="button"
                onClick={handleToggleNetworkMode}
                aria-label="Toggle 3G slow network simulation"
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all duration-150 active:scale-95 ${
                  isSlow3G
                    ? isCyber
                      ? 'bg-[#FF2D95] text-white shadow-md shadow-[#FF2D95]/40'
                      : 'bg-slate-900 text-white shadow-sm'
                    : isCyber
                    ? 'bg-neutral-800 text-neutral-300 hover:text-white'
                    : 'bg-white text-slate-700 shadow-sm hover:bg-slate-50'
                }`}
              >
                {isSlow3G ? (
                  <>
                    <WifiOff className="w-3.5 h-3.5 animate-pulse" />
                    <span>3G Slow Network: Active</span>
                  </>
                ) : (
                  <>
                    <Wifi className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Network: Normal</span>
                  </>
                )}
              </button>
            </div>

            {/* 1-Click UI Theme Switcher Pill */}
            <button
              type="button"
              onClick={handleToggleTheme}
              aria-label="Toggle UI Theme"
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-150 active:scale-95 ${
                isCyber
                  ? 'bg-neutral-900 text-[#007BA7] border-neutral-700 hover:bg-neutral-800 shadow-md shadow-[#007BA7]/20'
                  : 'bg-white text-slate-900 border-slate-200 hover:bg-slate-100 shadow-sm'
              }`}
            >
              {isCyber ? (
                <>
                  <Moon className="w-3.5 h-3.5 text-[#007BA7]" />
                  <span className="text-slate-200">Cyber Dark Mode</span>
                </>
              ) : (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  <span className="text-slate-800">Corporate Monochrome</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace Canvas with TRD Spacing Scale (32px / p-8) */}
      <main className="max-w-7xl mx-auto p-4 sm:p-8 space-y-8">
        {/* Async Loading Status Indicator (role="status" & aria-busy="true") */}
        {isLoading && (
          <div
            role="status"
            aria-live="polite"
            aria-busy="true"
            className={`flex items-center gap-4 p-4 rounded-2xl border transition-all animate-in fade-in duration-200 ${
              isCyber
                ? 'bg-neutral-900/90 border-[#007BA7]/60 text-slate-100 shadow-xl shadow-[#007BA7]/20'
                : 'bg-white border-slate-300 text-slate-900 shadow-md'
            }`}
          >
            <div
              className={`w-5 h-5 border-2 rounded-full animate-spin shrink-0 ${
                isCyber
                  ? 'border-[#007BA7] border-t-transparent'
                  : 'border-slate-900 border-t-transparent'
              }`}
            />
            <div className="flex flex-col">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-500">
                Network Operation In Flight
              </span>
              <span className="text-sm font-medium">
                {loadingMessage || 'Processing network operation...'}
              </span>
            </div>
          </div>
        )}

        {/* =========================================================================
         * 3. INTERACTIVE BENTO KPI CARDS WITH VISUAL METERS (4-Card Grid)
         * ========================================================================= */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
          <KpiCard
            title="Total Articles Audited"
            value={kpiMetrics.totalArticles}
            description="Catalog volume monitored"
            trend="+100% active"
            trendType="positive"
            progressPercent={Math.min(100, kpiMetrics.totalArticles * 20)}
            icon={Database}
            theme={theme}
          />
          <KpiCard
            title="Avg Latency"
            value={kpiMetrics.avgLoadTime}
            unit="ms"
            description="Target threshold: <500ms"
            trend={kpiMetrics.avgLoadTime <= 500 ? '-34% Fast' : '+18% High'}
            trendType={kpiMetrics.avgLoadTime <= 500 ? 'positive' : 'alert'}
            progressPercent={Math.min(100, (kpiMetrics.avgLoadTime / 1500) * 100)}
            icon={Clock}
            theme={theme}
          />
          <KpiCard
            title="Total Byte Footprint"
            value={kpiMetrics.totalPayload}
            unit="KB"
            description="Compressed asset footprint"
            trend="-42% gzip"
            trendType="neutral"
            progressPercent={Math.min(100, (kpiMetrics.totalPayload / 4000) * 100)}
            icon={HardDrive}
            theme={theme}
          />
          <KpiCard
            title="Optimized Ratio"
            value={kpiMetrics.optimizedRatio}
            unit="%"
            description="Core Web Vitals compliance"
            trend={kpiMetrics.optimizedRatio >= 80 ? 'SLA Passed' : 'Needs Action'}
            trendType={kpiMetrics.optimizedRatio >= 80 ? 'positive' : 'alert'}
            progressPercent={kpiMetrics.optimizedRatio}
            icon={Sparkles}
            theme={theme}
          />
        </section>

        {/* =========================================================================
         * 4. ASYMMETRIC SPLIT WORKSPACE (8-COL EXPLORER + 4-COL STICKY STUDIO)
         * ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left 8 Columns (Interactive Data Explorer) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Search, Segmented Filters, and Sort Console Card */}
            <section
              className={`p-6 sm:p-8 rounded-2xl border transition-all duration-200 ${
                isCyber
                  ? 'bg-[#121216] border-neutral-800 shadow-xl shadow-black/40'
                  : 'bg-white border-slate-200/90 shadow-sm'
              }`}
            >
              <div className="space-y-4">
                {/* Command-Style Search Bar with Keyboard Shortcut */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="search-articles-input"
                      className={`text-xs font-bold uppercase tracking-wider ${
                        isCyber ? 'text-neutral-400' : 'text-slate-600'
                      }`}
                    >
                      Search Articles
                    </label>
                    <span
                      className={`text-[11px] font-mono hidden sm:inline-block ${
                        isCyber ? 'text-neutral-500' : 'text-slate-400'
                      }`}
                    >
                      Press <kbd className="px-1.5 py-0.5 rounded bg-slate-200/50 dark:bg-neutral-800 border dark:border-neutral-700">Ctrl + K</kbd> or <kbd className="px-1.5 py-0.5 rounded bg-slate-200/50 dark:bg-neutral-800 border dark:border-neutral-700">/</kbd>
                    </span>
                  </div>

                  <div className="relative flex items-center">
                    <div
                      className={`absolute left-3.5 pointer-events-none ${
                        isCyber ? 'text-neutral-400' : 'text-slate-400'
                      }`}
                    >
                      <Search className="w-4 h-4" />
                    </div>
                    <input
                      ref={searchInputRef}
                      id="search-articles-input"
                      type="text"
                      value={searchQuery}
                      onChange={handleSearchChange}
                      aria-label="Search articles"
                      placeholder="Search articles by headline, slug, or category..."
                      className={`w-full pl-10 pr-20 py-2.5 rounded-xl text-sm font-medium border transition-colors focus:outline-none focus:ring-2 ${
                        isCyber
                          ? 'bg-neutral-900/90 text-white border-neutral-700 placeholder-neutral-500 focus:ring-[#007BA7] focus:border-[#007BA7]'
                          : 'bg-slate-50 text-slate-900 border-slate-300 placeholder-slate-400 focus:ring-slate-900 focus:border-slate-900'
                      }`}
                    />
                    <div className="absolute right-3 hidden sm:flex items-center gap-1 pointer-events-none">
                      <span
                        className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded border ${
                          isCyber
                            ? 'bg-neutral-800 text-neutral-400 border-neutral-700'
                            : 'bg-slate-200/60 text-slate-500 border-slate-300'
                        }`}
                      >
                        ⌘K
                      </span>
                    </div>
                  </div>
                </div>

                {/* Filter and Sort Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  {/* Category Filter Select */}
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="filter-category-select"
                      className={`text-xs font-bold uppercase tracking-wider ${
                        isCyber ? 'text-neutral-400' : 'text-slate-600'
                      }`}
                    >
                      Filter by Topic Section
                    </label>
                    <div className="relative">
                      <select
                        id="filter-category-select"
                        value={selectedCategory}
                        onChange={handleCategoryChange}
                        aria-label="Filter by category"
                        className={`w-full p-2.5 rounded-xl text-sm font-medium border appearance-none focus:outline-none focus:ring-2 cursor-pointer ${
                          isCyber
                            ? 'bg-neutral-900 text-white border-neutral-700 focus:ring-[#007BA7]'
                            : 'bg-slate-50 text-slate-900 border-slate-300 focus:ring-slate-900'
                        }`}
                      >
                        <option value="All">All Categories</option>
                        <option value="Technology">Technology</option>
                        <option value="Tech">Tech</option>
                        <option value="Breaking News">Breaking News</option>
                        <option value="Finance">Finance</option>
                        <option value="Multimedia">Multimedia</option>
                        <option value="EmptyCategory">Empty Division</option>
                      </select>
                      <div
                        className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${
                          isCyber ? 'text-neutral-400' : 'text-slate-400'
                        }`}
                      >
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  {/* Sort Control Select */}
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="sort-articles-select"
                      className={`text-xs font-bold uppercase tracking-wider ${
                        isCyber ? 'text-neutral-400' : 'text-slate-600'
                      }`}
                    >
                      Sort Articles
                    </label>
                    <div className="relative">
                      <select
                        id="sort-articles-select"
                        value={sortBy}
                        onChange={handleSortChange}
                        aria-label="Sort articles"
                        className={`w-full p-2.5 rounded-xl text-sm font-medium border appearance-none focus:outline-none focus:ring-2 cursor-pointer ${
                          isCyber
                            ? 'bg-neutral-900 text-white border-neutral-700 focus:ring-[#007BA7]'
                            : 'bg-slate-50 text-slate-900 border-slate-300 focus:ring-slate-900'
                        }`}
                      >
                        <option value="loadTimeAsc">Load Time (Fastest)</option>
                        <option value="loadTimeDesc">Load Time (Slowest)</option>
                        <option value="payloadAsc">Payload (Smallest)</option>
                        <option value="payloadDesc">Payload (Largest)</option>
                        <option value="title">Title (A-Z)</option>
                      </select>
                      <div
                        className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${
                          isCyber ? 'text-neutral-400' : 'text-slate-400'
                        }`}
                      >
                        <ArrowUpDown className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  {/* One-Click Reset Filters Button */}
                  <div className="flex flex-col justify-end">
                    <button
                      type="button"
                      onClick={handleResetFilters}
                      aria-label="Reset filters"
                      className={`w-full p-2.5 rounded-xl text-xs font-bold uppercase tracking-wider border active:scale-95 transition-all duration-150 flex items-center justify-center gap-1.5 ${
                        isCyber
                          ? 'bg-neutral-900 text-neutral-300 hover:text-white border-neutral-700 hover:bg-neutral-800'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-300'
                      }`}
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Reset Filters</span>
                    </button>
                  </div>
                </div>

                {/* Quick Segmented Filter Pills */}
                <div className="pt-2 flex items-center gap-1.5 flex-wrap">
                  <span
                    className={`text-[11px] font-mono mr-1 ${
                      isCyber ? 'text-neutral-500' : 'text-slate-400'
                    }`}
                  >
                    Quick Tags:
                  </span>
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => handleCategorySelectDirect(cat)}
                      aria-label={`Topic tag: ${cat}`}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all duration-150 active:scale-95 ${
                        selectedCategory === cat
                          ? isCyber
                            ? 'bg-[#007BA7] text-white shadow-sm'
                            : 'bg-slate-900 text-white shadow-sm'
                          : isCyber
                          ? 'bg-neutral-800/80 text-neutral-300 hover:bg-neutral-700 border border-neutral-700/60'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* Structured News Blog Article Performance Metrics Table Card */}
            <section
              className={`rounded-2xl border overflow-hidden transition-all duration-200 ${
                isCyber
                  ? 'bg-[#121216] border-neutral-800 shadow-xl shadow-black/40'
                  : 'bg-white border-slate-200/90 shadow-sm'
              }`}
            >
              <div
                className={`p-4 sm:p-6 border-b flex items-center justify-between gap-4 ${
                  isCyber ? 'border-neutral-800/90' : 'border-slate-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`p-2 rounded-xl shrink-0 ${
                      isCyber
                        ? 'bg-neutral-900 text-[#007BA7]'
                        : 'bg-slate-100 text-slate-900'
                    }`}
                  >
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <h2
                      className={`text-sm font-bold uppercase tracking-wide ${
                        isCyber ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      Article Performance Audits ({filteredAndSortedArticles.length})
                    </h2>
                    <p
                      className={`text-xs ${
                        isCyber ? 'text-neutral-400' : 'text-slate-500'
                      }`}
                    >
                      Real-time Core Web Vitals telemetry table
                    </p>
                  </div>
                </div>

                <span
                  className={`text-xs font-mono px-2.5 py-1 rounded-full ${
                    isCyber
                      ? 'bg-neutral-900 text-neutral-300 border border-neutral-800'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {filteredAndSortedArticles.length} / {articles.length} Loaded
                </span>
              </div>

              {filteredAndSortedArticles.length === 0 ? (
                <EmptyState onReset={handleResetFilters} theme={theme} />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr
                        className={`border-b text-xs font-bold uppercase tracking-wider ${
                          isCyber
                            ? 'border-neutral-800 bg-neutral-900/80 text-neutral-400'
                            : 'border-slate-200 bg-slate-100 text-slate-700'
                        }`}
                      >
                        <th scope="col" className="p-4">
                          Headline
                        </th>
                        <th scope="col" className="p-4">
                          Slug
                        </th>
                        <th scope="col" className="p-4">
                          Category
                        </th>
                        <th scope="col" className="p-4">
                          Payload KB
                        </th>
                        <th scope="col" className="p-4">
                          Load Time ms
                        </th>
                        <th scope="col" className="p-4">
                          Status
                        </th>
                        <th scope="col" className="p-4">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAndSortedArticles.map((article) => (
                        <ArticleTableRow
                          key={article.id}
                          article={article}
                          onOptimize={handleOptimizeArticle}
                          isProcessing={isLoading}
                          theme={theme}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </div>

          {/* Right 4 Columns (Sticky Action & Audit Studio Form) */}
          <div className="lg:col-span-4">
            <section
              className={`sticky top-24 rounded-2xl border p-6 sm:p-8 space-y-6 transition-all duration-200 ${
                isCyber
                  ? 'bg-[#121216] border-neutral-800 shadow-xl shadow-black/50'
                  : 'bg-white border-slate-200/90 shadow-sm'
              }`}
            >
              <div
                className={`pb-4 border-b ${
                  isCyber ? 'border-neutral-800' : 'border-slate-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`p-2 rounded-xl shrink-0 ${
                      isCyber
                        ? 'bg-neutral-900 text-[#007BA7] border border-neutral-800'
                        : 'bg-slate-100 text-slate-900'
                    }`}
                  >
                    <PlusCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <h2
                      className={`text-base font-bold tracking-tight ${
                        isCyber ? 'text-white' : 'text-slate-950'
                      }`}
                    >
                      Log Article Performance Audit
                    </h2>
                    <p
                      className={`text-xs mt-0.5 ${
                        isCyber ? 'text-neutral-400' : 'text-slate-500'
                      }`}
                    >
                      Submit fresh article metrics into the Core Web Vitals monitoring pipeline.
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleAuditSubmit} noValidate className="space-y-4">
                {/* Headline Input */}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="article-headline-input"
                    className="text-xs font-bold uppercase tracking-wider text-slate-500"
                  >
                    Article Title
                  </label>
                  <input
                    id="article-headline-input"
                    type="text"
                    name="headline"
                    value={formData.headline}
                    onChange={handleInputChange}
                    aria-label="Article headline"
                    aria-invalid={formErrors.headline ? 'true' : 'false'}
                    placeholder="e.g. Breaking News: Global Market Update"
                    className={`p-2.5 border rounded-xl text-sm font-medium focus:outline-none focus:ring-2 ${
                      formErrors.headline
                        ? 'border-red-600 bg-red-50/40 text-red-700 focus:ring-red-500'
                        : isCyber
                        ? 'border-neutral-700 bg-neutral-900 text-white placeholder-neutral-500 focus:ring-[#007BA7]'
                        : 'border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:ring-slate-900'
                    }`}
                  />
                  {formErrors.headline && (
                    <span className="text-xs text-red-600 font-medium">
                      {formErrors.headline}
                    </span>
                  )}
                </div>

                {/* Slug Input */}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="article-slug-input"
                    className="text-xs font-bold uppercase tracking-wider text-slate-500"
                  >
                    Article Path Identifier
                  </label>
                  <input
                    id="article-slug-input"
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    aria-label="Article slug"
                    aria-invalid={formErrors.slug ? 'true' : 'false'}
                    placeholder="e.g. breaking-news-global-market"
                    className={`p-2.5 border rounded-xl text-sm font-medium focus:outline-none focus:ring-2 ${
                      formErrors.slug
                        ? 'border-red-600 bg-red-50/40 text-red-700 focus:ring-red-500'
                        : isCyber
                        ? 'border-neutral-700 bg-neutral-900 text-white placeholder-neutral-500 focus:ring-[#007BA7]'
                        : 'border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:ring-slate-900'
                    }`}
                  />
                  {formErrors.slug && (
                    <span className="text-xs text-red-600 font-medium">
                      {formErrors.slug}
                    </span>
                  )}
                </div>

                {/* Category Select */}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="article-category-input"
                    className="text-xs font-bold uppercase tracking-wider text-slate-500"
                  >
                    Article Topic
                  </label>
                  <div className="relative">
                    <select
                      id="article-category-input"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      aria-label="Article category"
                      className={`w-full p-2.5 border rounded-xl text-sm font-medium appearance-none focus:outline-none focus:ring-2 cursor-pointer ${
                        isCyber
                          ? 'border-neutral-700 bg-neutral-900 text-white focus:ring-[#007BA7]'
                          : 'border-slate-300 bg-white text-slate-900 focus:ring-slate-900'
                      }`}
                    >
                      <option value="Technology">Technology</option>
                      <option value="Tech">Tech</option>
                      <option value="Breaking News">Breaking News</option>
                      <option value="Finance">Finance</option>
                      <option value="Multimedia">Multimedia</option>
                    </select>
                    <div
                      className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${
                        isCyber ? 'text-neutral-400' : 'text-slate-400'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* Payload KB Input */}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="payload-kb-input"
                    className="text-xs font-bold uppercase tracking-wider text-slate-500"
                  >
                    Asset Payload (KB)
                  </label>
                  <input
                    id="payload-kb-input"
                    type="text"
                    inputMode="numeric"
                    name="payloadKb"
                    value={formData.payloadKb}
                    onChange={handleInputChange}
                    aria-label="Payload in KB"
                    aria-invalid={formErrors.payloadKb ? 'true' : 'false'}
                    placeholder="e.g. 450"
                    className={`p-2.5 border rounded-xl text-sm font-medium focus:outline-none focus:ring-2 ${
                      formErrors.payloadKb
                        ? 'border-red-600 bg-red-50/40 text-red-700 focus:ring-red-500'
                        : isCyber
                        ? 'border-neutral-700 bg-neutral-900 text-white placeholder-neutral-500 focus:ring-[#007BA7]'
                        : 'border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:ring-slate-900'
                    }`}
                  />
                  {formErrors.payloadKb && (
                    <span className="text-xs text-red-600 font-medium">
                      {formErrors.payloadKb}
                    </span>
                  )}
                </div>

                {/* Load Time ms Input */}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="load-time-ms-input"
                    className="text-xs font-bold uppercase tracking-wider text-slate-500"
                  >
                    Render Latency (ms)
                  </label>
                  <input
                    id="load-time-ms-input"
                    type="text"
                    inputMode="numeric"
                    name="loadTimeMs"
                    value={formData.loadTimeMs}
                    onChange={handleInputChange}
                    aria-label="Load Time in ms"
                    aria-invalid={formErrors.loadTimeMs ? 'true' : 'false'}
                    placeholder="e.g. 520"
                    className={`p-2.5 border rounded-xl text-sm font-medium focus:outline-none focus:ring-2 ${
                      formErrors.loadTimeMs
                        ? 'border-red-600 bg-red-50/40 text-red-700 focus:ring-red-500'
                        : isCyber
                        ? 'border-neutral-700 bg-neutral-900 text-white placeholder-neutral-500 focus:ring-[#007BA7]'
                        : 'border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:ring-slate-900'
                    }`}
                  />
                  {formErrors.loadTimeMs && (
                    <span className="text-xs text-red-600 font-medium">
                      {formErrors.loadTimeMs}
                    </span>
                  )}
                </div>

                {/* Submit Audit Button with Inline Loading Spinner */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    aria-label="Submit audit"
                    className={`w-full py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-150 active:scale-95 flex items-center justify-center gap-2 ${
                      isCyber
                        ? 'bg-[#007BA7] text-white hover:bg-[#006e96] shadow-lg shadow-[#007BA7]/30 disabled:opacity-50'
                        : 'bg-slate-900 text-white hover:bg-slate-800 shadow-sm disabled:opacity-50'
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Submitting Audit...</span>
                      </>
                    ) : (
                      <>
                        <PlusCircle className="w-4 h-4" />
                        <span>Submit Audit</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </section>
          </div>
        </div>

        {/* =========================================================================
         * 5. COLLAPSIBLE DEVELOPER TELEMETRY TERMINAL DOCK
         * ========================================================================= */}
        <TelemetryActivityLog
          logs={telemetryLogs}
          onClear={handleClearLogs}
          theme={theme}
        />
      </main>
    </div>
  );
}
