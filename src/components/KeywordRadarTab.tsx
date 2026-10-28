import React, { useState } from 'react';
import { DigitalProduct, KeywordItem, KeywordAnalysisResult } from '../types';
import { 
  Search, 
  TrendingUp, 
  Sparkles, 
  BarChart2, 
  Check, 
  ArrowRight, 
  Compass, 
  Layers, 
  Hash, 
  ShieldAlert, 
  Bookmark, 
  BookmarkCheck,
  RefreshCw,
  Zap,
  Globe,
  Filter
} from 'lucide-react';

interface KeywordRadarTabProps {
  products: DigitalProduct[];
  trackedKeywords: KeywordItem[];
  onToggleTrackKeyword: (item: KeywordItem) => void;
  onSendToMarketingGenerator: (selectedKeywords: string[]) => void;
}

export const KeywordRadarTab: React.FC<KeywordRadarTabProps> = ({
  products,
  trackedKeywords,
  onToggleTrackKeyword,
  onSendToMarketingGenerator,
}) => {
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || 'custom');
  const [customTitle, setCustomTitle] = useState('');
  const [customNiche, setCustomNiche] = useState('Solopreneur, Creator Tools & Agency Growth');
  const [targetAudience, setTargetAudience] = useState('Founders, Freelancers & Solo Creators');
  const [intentFilter, setIntentFilter] = useState<'All' | 'Transactional' | 'Commercial' | 'Informational'>('All');
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<KeywordAnalysisResult | null>(null);
  const [selectedForMarketing, setSelectedForMarketing] = useState<string[]>([]);

  const handleRunAnalysis = async () => {
    setIsLoading(true);
    setErrorMsg(null);

    let titleToAnalyze = customTitle;
    let categoryToAnalyze = 'Digital Product';
    let nicheToAnalyze = customNiche;
    let audienceToAnalyze = targetAudience;

    if (selectedProductId !== 'custom') {
      const prod = products.find(p => p.id === selectedProductId);
      if (prod) {
        titleToAnalyze = prod.title;
        categoryToAnalyze = prod.category;
        nicheToAnalyze = `${prod.category} for ${prod.targetAudience}`;
        audienceToAnalyze = prod.targetAudience;
      }
    }

    try {
      const response = await fetch('/api/keywords/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productTitle: titleToAnalyze || 'Digital Product Asset',
          category: categoryToAnalyze,
          niche: nicheToAnalyze,
          targetAudience: audienceToAnalyze,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}: ${response.statusText}`);
      }

      const data: KeywordAnalysisResult = await response.json();
      setAnalysisResult(data);
      // Pre-select the top 2 keywords
      if (data.keywords && data.keywords.length > 0) {
        setSelectedForMarketing(data.keywords.slice(0, 3).map(k => k.keyword));
      }
    } catch (err: any) {
      console.error('Keyword analysis failed:', err);
      setErrorMsg(err.message || 'Failed to fetch trending keywords. Please verify connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSelectForMarketing = (kw: string) => {
    if (selectedForMarketing.includes(kw)) {
      setSelectedForMarketing(selectedForMarketing.filter(k => k !== kw));
    } else {
      setSelectedForMarketing([...selectedForMarketing, kw]);
    }
  };

  const currentDisplayKeywords = analysisResult?.keywords || trackedKeywords;
  const filteredKeywords = currentDisplayKeywords.filter(k => {
    if (intentFilter === 'All') return true;
    return k.intent === intentFilter;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner & Control Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-violet-950/80 text-violet-300 border border-violet-800/60 mb-2">
              <Compass className="w-3.5 h-3.5 text-violet-400" />
              <span>Search Intelligence & Keyword Radar</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Track High-Intent Demand & Buyer Angles
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1">
              Discover what target customers search for on Google, YouTube, and X before spending days on marketing. Uncover search volume, difficulty, and copy angles.
            </p>
          </div>

          {selectedForMarketing.length > 0 && (
            <button
              onClick={() => onSendToMarketingGenerator(selectedForMarketing)}
              className="px-4 py-2 bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-sm flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap self-start md:self-auto"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Generate Content for ({selectedForMarketing.length}) Keywords</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Form to run analysis */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-slate-950/70 p-4 rounded-xl border border-slate-800 text-xs">
          <div>
            <label className="block text-slate-400 font-medium mb-1">Target Product</label>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-violet-500 cursor-pointer"
            >
              {products.map(p => (
                <option key={p.id} value={p.id}>{p.title} (${p.price} · {p.category})</option>
              ))}
              <option value="custom">+ Enter Custom Product / Topic</option>
            </select>
          </div>

          {selectedProductId === 'custom' ? (
            <div>
              <label className="block text-slate-400 font-medium mb-1">Product Title</label>
              <input
                type="text"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                placeholder="e.g. 3D Blender Asset Pack"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500"
              />
            </div>
          ) : (
            <div>
              <label className="block text-slate-400 font-medium mb-1">Market Niche</label>
              <input
                type="text"
                value={customNiche}
                onChange={(e) => setCustomNiche(e.target.value)}
                placeholder="e.g. Design systems, agency growth"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500"
              />
            </div>
          )}

          <div>
            <label className="block text-slate-400 font-medium mb-1">Target Audience</label>
            <input
              type="text"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              placeholder="e.g. Freelancers, agency owners"
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={handleRunAnalysis}
              disabled={isLoading}
              className={`w-full py-2 px-4 rounded-lg font-bold text-white flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer ${
                isLoading
                  ? 'bg-violet-800 text-violet-200 cursor-not-allowed'
                  : 'bg-violet-600 hover:bg-violet-500'
              }`}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Analyzing Radar...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-amber-300" />
                  <span>Analyze Market Keywords</span>
                </>
              )}
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="mt-3 p-3 bg-rose-950/80 border border-rose-800 text-rose-300 rounded-lg text-xs">
            {errorMsg}
          </div>
        )}
      </div>

      {/* Strategic Insights Cards if analysis available */}
      {analysisResult && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
              <ShieldAlert className="w-4 h-4" />
              <span>Competitor Gap Analysis</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {analysisResult.competitorGap}
            </p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 text-violet-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" />
              <span>High-Converting Angles</span>
            </div>
            <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
              {analysisResult.contentAngles.map((angle, i) => (
                <li key={i} className="line-clamp-2">{angle}</li>
              ))}
            </ul>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 text-pink-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Hash className="w-4 h-4" />
              <span>Trending Social Hashtags</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {analysisResult.trendingHashtags.map((tag, i) => (
                <span key={i} className="px-2 py-0.5 bg-slate-800 text-slate-300 border border-slate-700/80 rounded-md text-[11px] font-mono">
                  {tag.startsWith('#') ? tag : `#${tag}`}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Keyword Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        {/* Filter bar */}
        <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950/40">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-300">
              {analysisResult ? 'Live Search Intelligence' : 'Tracked High-Intent Keywords'} ({filteredKeywords.length})
            </span>
            {analysisResult && (
              <span className="text-[11px] text-emerald-400 font-medium">
                · Verified Gemini Intelligence
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 bg-slate-800/80 p-1 rounded-lg border border-slate-700/60 text-xs">
            {(['All', 'Transactional', 'Commercial', 'Informational'] as const).map((intent) => (
              <button
                key={intent}
                onClick={() => setIntentFilter(intent)}
                className={`px-2.5 py-1 rounded font-medium transition-all cursor-pointer ${
                  intentFilter === intent
                    ? 'bg-slate-200 text-slate-900 font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {intent}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-950/70 text-slate-400 font-semibold uppercase text-[11px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4 w-12 text-center">Select</th>
                <th className="py-3 px-4">Search Query</th>
                <th className="py-3 px-4">Est. Search Volume</th>
                <th className="py-3 px-4">Difficulty (KD)</th>
                <th className="py-3 px-4">Search Intent</th>
                <th className="py-3 px-4">MoM Growth</th>
                <th className="py-3 px-4">Recommended Angle</th>
                <th className="py-3 px-4">Best Platforms</th>
                <th className="py-3 px-4 text-right">Track</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {filteredKeywords.map((item, idx) => {
                const isSelected = selectedForMarketing.includes(item.keyword);
                const isTracked = trackedKeywords.some(tk => tk.keyword.toLowerCase() === item.keyword.toLowerCase());

                return (
                  <tr key={idx} className={`hover:bg-slate-800/40 transition-colors ${isSelected ? 'bg-violet-950/20' : ''}`}>
                    <td className="py-3 px-4 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectForMarketing(item.keyword)}
                        className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-violet-600 focus:ring-violet-500 cursor-pointer"
                        title="Select to generate marketing content"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-white">{item.keyword}</span>
                    </td>
                    <td className="py-3 px-4 font-mono tabular-nums font-medium text-slate-200">
                      {item.volume}
                    </td>
                    <td className="py-3 px-4 font-mono tabular-nums">
                      <span className={`font-semibold ${
                        item.difficulty < 35 
                          ? 'text-emerald-400' 
                          : item.difficulty < 60
                          ? 'text-amber-400'
                          : 'text-rose-400'
                      }`}>
                        KD {item.difficulty}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-xs text-slate-300">
                        {item.intent}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono tabular-nums font-semibold text-emerald-400">
                      {item.growth}
                    </td>
                    <td className="py-3 px-4 max-w-xs text-xs text-slate-300 leading-snug">
                      {item.topAngle}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1 text-[11px] text-slate-400">
                        {item.suggestedPlatforms?.join(', ')}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => onToggleTrackKeyword(item)}
                        className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                          isTracked
                            ? 'bg-violet-900/60 text-violet-300 border-violet-700 hover:bg-violet-800'
                            : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                        }`}
                        title={isTracked ? "Tracked in CRM" : "Save to Tracked Keywords"}
                      >
                        {isTracked ? <BookmarkCheck className="w-4 h-4 text-violet-400" /> : <Bookmark className="w-4 h-4" />}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
