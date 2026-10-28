import React, { useState } from 'react';
import { DigitalProduct } from '../types';
import { X, Copy, Check, BarChart3, Link as LinkIcon } from 'lucide-react';

interface UtmBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: DigitalProduct[];
}

export const UtmBuilderModal: React.FC<UtmBuilderModalProps> = ({
  isOpen,
  onClose,
  products,
}) => {
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || '');
  const [baseUrl, setBaseUrl] = useState(products[0]?.salesPageUrl || 'https://creators.store/notion-os');
  const [source, setSource] = useState('twitter');
  const [medium, setMedium] = useState('social-thread');
  const [campaign, setCampaign] = useState('launch-q4');
  const [term, setTerm] = useState('solopreneur');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleProductSelect = (id: string) => {
    setSelectedProductId(id);
    const prod = products.find(p => p.id === id);
    if (prod && prod.salesPageUrl) {
      setBaseUrl(prod.salesPageUrl);
    }
  };

  const generateUtmUrl = () => {
    try {
      const url = new URL(baseUrl);
      if (source) url.searchParams.set('utm_source', source);
      if (medium) url.searchParams.set('utm_medium', medium);
      if (campaign) url.searchParams.set('utm_campaign', campaign);
      if (term) url.searchParams.set('utm_term', term);
      return url.toString();
    } catch {
      return `${baseUrl}?utm_source=${source}&utm_medium=${medium}&utm_campaign=${campaign}&utm_term=${term}`;
    }
  };

  const finalUrl = generateUtmUrl();

  const handleCopy = () => {
    navigator.clipboard.writeText(finalUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 overscroll-contain">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto modal-scroll">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-violet-950 border border-violet-800 rounded-lg text-violet-400">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Campaign UTM Link Builder</h3>
              <p className="text-xs text-slate-400">Track which automated posts & channels generate your digital sales</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-500 hover:text-slate-300 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Select Target Product</label>
            <select
              value={selectedProductId}
              onChange={(e) => handleProductSelect(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-violet-500 text-xs"
            >
              {products.map(p => (
                <option key={p.id} value={p.id}>{p.title} (${p.price})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Destination URL</label>
            <input
              type="url"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 font-mono text-xs focus:outline-none focus:border-violet-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">UTM Source (Platform)</label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-violet-500 text-xs"
              >
                <option value="twitter">twitter (X)</option>
                <option value="linkedin">linkedin</option>
                <option value="instagram">instagram</option>
                <option value="newsletter">newsletter / email</option>
                <option value="producthunt">producthunt</option>
                <option value="youtube">youtube</option>
                <option value="tiktok">tiktok</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">UTM Medium</label>
              <input
                type="text"
                value={medium}
                onChange={(e) => setMedium(e.target.value)}
                placeholder="e.g. social-thread, bio-link, reel"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-violet-500 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Campaign Name</label>
              <input
                type="text"
                value={campaign}
                onChange={(e) => setCampaign(e.target.value)}
                placeholder="e.g. black-friday, v2-launch"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-violet-500 text-xs"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Campaign Keyword / Term</label>
              <input
                type="text"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                placeholder="e.g. notion-template"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-violet-500 text-xs"
              />
            </div>
          </div>

          {/* Generated Link Box */}
          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block">
              Generated Tracking URL
            </span>
            <div className="p-2 bg-slate-900 rounded-lg border border-slate-800 font-mono text-[11px] text-emerald-400 break-all select-all">
              {finalUrl}
            </div>
            <button
              onClick={handleCopy}
              className="w-full py-2 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-lg text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied Tracking URL!' : 'Copy Tracking Link'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
