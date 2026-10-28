import React, { useState } from 'react';
import { DigitalProduct, ProductCategory, SocialPlatform } from '../types';
import { 
  X, 
  Sparkles, 
  FileText, 
  Link as LinkIcon, 
  Check, 
  Send, 
  Copy, 
  RefreshCw, 
  Zap, 
  CheckCircle2, 
  BookOpen,
  DollarSign,
  Tag,
  Share2,
  ExternalLink
} from 'lucide-react';

interface WorkspaceImporterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductImported: (product: Omit<DigitalProduct, 'id' | 'createdAt' | 'salesCount' | 'revenue'>, marketingCopy?: any) => void;
  onOpenDirectPublishModal: (post: { productTitle: string; title: string; content: string; platform: SocialPlatform }) => void;
}

const sampleWorkspaceDocs = [
  {
    name: 'Notion Second Brain & Agency OS',
    content: `# Agency Second Brain & Operations Hub v3.0

## Overview
A complete system to run a solo marketing or design agency without dropping client deliverables or losing invoice receipts.

## Target Users
Solo freelancers, creative agency owners, and consultant teams (1-5 members) struggling with scattered Slack messages and Google Sheets.

## Core Databases & Architecture
- **Client Pipeline**: Automated lead stage tracker with deal probability score and last contact date reminders.
- **Project Deliverables Kanban**: Sprint boards with client review checklist and auto-archiving.
- **SOP & Knowledge Base**: 25+ pre-written standard operating procedures for client onboarding, invoice follow-ups, and contractor hand-offs.
- **Financial & MRR Dashboard**: Monthly recurring revenue calculator, contractor expenses, and profit margin formulas.
- **Client Portal Templates**: Shareable read-only dashboard links for clients to view milestone progress without emailing "Any updates?".

## Pricing Idea
Selling on Gumroad & LemonSqueezy for $69 with lifetime updates.`,
  },
  {
    name: 'Figma UI Design System Notes',
    content: `# DesignTokens: Production Figma Kit 2026

## Mission
Save product designers and fullstack indie hackers 80+ hours of reinventing buttons, modals, dropdowns, and light/dark color tokens.

## What is inside
- 2,400+ Auto-Layout 5.0 components covering web dashboards, mobile screens, checkout flows, and analytics cards.
- Automated Figma Variables for semantic spacing, typography scale, and WCAG AAA contrast colors.
- Ready-to-copy Tailwind CSS color token mappings.
- Clean component states: default, hover, focused, disabled, loading, and error.

## Pricing
$89 for solo designer license, $249 for team/agency tier.`,
  },
  {
    name: 'Video Course Curriculum Outline',
    content: `# B2B High-Ticket Cold Email Mastery

## Course Description
A 4-week step-by-step masterclass teaching solo consultants and agency founders how to book 15-20 qualified sales calls every month using AI-personalized cold email scripts and zero spam triggers.

## Modules
1. Deliverability & Infrastructure: Setting up secondary domains, Google Workspace DKIM/SPF/DMARC, warmup sequences.
2. The 3-Sentence Curiosity Framework: Why long pitch emails fail and how to write subject lines with 65%+ open rates.
3. Scraping & Lead Enrichment: Finding verified decision-maker emails using Apollo, Clay, and LinkedIn Sales Navigator.
4. Objection Elimination: How to turn "Not interested right now" into a qualified demo call.
5. Included Swipes: 40+ battle-tested cold email templates across SaaS, creative services, and B2B consulting.

## Target Price
$149 one-time.`,
  },
];

export const WorkspaceImporterModal: React.FC<WorkspaceImporterModalProps> = ({
  isOpen,
  onClose,
  onProductImported,
  onOpenDirectPublishModal,
}) => {
  const [importTab, setImportTab] = useState<'paste' | 'notion_url'>('paste');
  const [workspaceText, setWorkspaceText] = useState(sampleWorkspaceDocs[0].content);
  const [notionUrl, setNotionUrl] = useState('');
  const [notionToken, setNotionToken] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [extractedResult, setExtractedResult] = useState<any | null>(null);

  if (!isOpen) return null;

  const handleRunAnalysis = async () => {
    setIsAnalyzing(true);
    setErrorMsg(null);
    setExtractedResult(null);

    try {
      const response = await fetch('/api/workspace/import-and-extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceType: importTab === 'notion_url' ? 'notion' : 'markdown',
          content: workspaceText,
          workspaceUrl: notionUrl,
          notionToken: notionToken || undefined,
        }),
      });

      if (!response.ok) {
        const errJson = await response.json();
        throw new Error(errJson.error || errJson.details || 'Extraction failed');
      }

      const data = await response.json();
      setExtractedResult(data);
    } catch (err: any) {
      console.error('Workspace extraction error:', err);
      setErrorMsg(err.message || 'Failed to extract product details from workspace.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSaveAndLaunch = () => {
    if (!extractedResult) return;

    onProductImported({
      title: extractedResult.title,
      category: extractedResult.category as ProductCategory,
      price: extractedResult.suggestedPrice || 49,
      currency: 'USD',
      salesPageUrl: 'https://creators.store/' + extractedResult.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      usp: extractedResult.usp,
      description: extractedResult.description,
      targetAudience: extractedResult.targetAudience,
      status: 'active',
    }, extractedResult.marketingCopy);

    onClose();
  };

  const handleDirectBlastExtracted = () => {
    if (!extractedResult) return;

    handleSaveAndLaunch();

    setTimeout(() => {
      onOpenDirectPublishModal({
        productTitle: extractedResult.title,
        title: `${extractedResult.title} - Official Launch Announcement`,
        content: extractedResult.marketingCopy?.twitterThread?.join('\n\n') || extractedResult.marketingCopy?.linkedInPost || 'Launch Announcement',
        platform: 'twitter',
      });
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 overscroll-contain">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl p-6 shadow-2xl relative max-h-[92vh] overflow-y-auto modal-scroll">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-600 rounded-xl text-white shadow-md">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Import from Notion & Digital Workspaces</h3>
              <p className="text-xs text-slate-400">Read notes, templates, and specs → Auto-generate digital products & launch copy</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-500 hover:text-slate-300 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input Methods Tabs */}
        {!extractedResult && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 bg-slate-950/60 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setImportTab('paste')}
                className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  importTab === 'paste' ? 'bg-violet-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Paste Notes / Markdown / Specs</span>
              </button>
              <button
                onClick={() => setImportTab('notion_url')}
                className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  importTab === 'notion_url' ? 'bg-violet-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <LinkIcon className="w-4 h-4" />
                <span>Notion Share URL / Integration</span>
              </button>
            </div>

            {/* Quick Sample Presets */}
            {importTab === 'paste' && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider shrink-0">Try Sample:</span>
                {sampleWorkspaceDocs.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => setWorkspaceText(s.content)}
                    className="px-2.5 py-1 bg-slate-800/80 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700/80 whitespace-nowrap text-xs cursor-pointer"
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            )}

            {importTab === 'paste' ? (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Paste Workspace Content (Notion page copy, Google Docs notes, Markdown, or specs)
                </label>
                <textarea
                  rows={9}
                  value={workspaceText}
                  onChange={(e) => setWorkspaceText(e.target.value)}
                  placeholder="Paste your Notion page headings, bullet points, database specs, or project notes here..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 font-mono text-xs focus:outline-none focus:border-violet-500 leading-relaxed"
                />
              </div>
            ) : (
              <div className="space-y-3 text-xs bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Notion Public Page or Share URL</label>
                  <input
                    type="url"
                    value={notionUrl}
                    onChange={(e) => setNotionUrl(e.target.value)}
                    placeholder="https://www.notion.so/myworkspace/My-Digital-Product-..."
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-violet-500 font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Notion Internal Integration Token (Optional for private pages)</label>
                  <input
                    type="password"
                    value={notionToken}
                    onChange={(e) => setNotionToken(e.target.value)}
                    placeholder="secret_••••••••••••••••••••••••"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-violet-500 font-mono text-xs"
                  />
                  <span className="text-[10px] text-slate-500 block mt-1">If your page is public to web, you can leave the token empty.</span>
                </div>
              </div>
            )}

            {errorMsg && (
              <div className="p-3 bg-rose-950/80 border border-rose-800 text-rose-300 rounded-lg text-xs">
                {errorMsg}
              </div>
            )}

            <div className="flex justify-end pt-3 border-t border-slate-800">
              <button
                onClick={handleRunAnalysis}
                disabled={isAnalyzing}
                className={`px-5 py-2.5 rounded-xl font-bold text-white text-xs shadow-lg flex items-center gap-2 cursor-pointer ${
                  isAnalyzing
                    ? 'bg-violet-800 cursor-not-allowed opacity-80'
                    : 'bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 hover:opacity-95 shadow-orange-500/20'
                }`}
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Analyzing Workspace & Writing Copy...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    <span>Extract Product & Auto-Generate Marketing Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Extraction Results Preview */}
        {extractedResult && (
          <div className="space-y-5 text-xs">
            <div className="p-4 bg-emerald-950/40 border border-emerald-800/70 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-300 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Successfully extracted product metadata and launch copy from your workspace!</span>
              </div>
              <button
                onClick={() => setExtractedResult(null)}
                className="text-slate-400 hover:text-white underline text-[11px] cursor-pointer"
              >
                Re-import
              </button>
            </div>

            {/* Extracted Product Overview Card */}
            <div className="p-5 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-violet-950 text-violet-300 border border-violet-800">
                      {extractedResult.category}
                    </span>
                    <span className="text-xs text-slate-400">Target: {extractedResult.targetAudience}</span>
                  </div>
                  <h4 className="text-xl font-black text-white">{extractedResult.title}</h4>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-emerald-400">${extractedResult.suggestedPrice}</span>
                  <span className="text-[10px] text-slate-500 block">Suggested Price</span>
                </div>
              </div>

              <p className="text-slate-300 leading-relaxed">{extractedResult.description}</p>

              <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800/80">
                <span className="font-bold text-violet-300 block mb-1">Core Outcome / USP:</span>
                <p className="text-slate-200">{extractedResult.usp}</p>
              </div>

              {/* Extracted modules */}
              <div>
                <span className="font-bold text-slate-400 block mb-2 uppercase text-[10px] tracking-wider">
                  Extracted Workspace Modules & Deliverables ({extractedResult.extractedKeyModules?.length || 0})
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {extractedResult.extractedKeyModules?.map((mod: string, i: number) => (
                    <div key={i} className="p-2 bg-slate-900 rounded border border-slate-800 text-slate-300 flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="truncate">{mod}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Auto-Generated Marketing Copy Preview */}
            {extractedResult.marketingCopy && (
              <div className="space-y-3">
                <span className="font-bold text-slate-300 text-sm block">Auto-Generated Launch Copy:</span>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Twitter Hook */}
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-sky-400 font-bold text-[11px] block">X (Twitter) Launch Hook:</span>
                    <p className="text-slate-200 line-clamp-3 italic">"{extractedResult.marketingCopy.twitterThread?.[0]}"</p>
                  </div>

                  {/* LinkedIn Hook */}
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-indigo-400 font-bold text-[11px] block">LinkedIn Hook:</span>
                    <p className="text-slate-200 line-clamp-3 italic">"{extractedResult.marketingCopy.linkedInPost?.slice(0, 160)}..."</p>
                  </div>

                  {/* YouTube Community */}
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-rose-400 font-bold text-[11px] block">YouTube Community Teaser:</span>
                    <p className="text-slate-200 line-clamp-3 italic">"{extractedResult.marketingCopy.youtubeCommunityPost?.slice(0, 160)}..."</p>
                  </div>

                  {/* Sales Headline */}
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-emerald-400 font-bold text-[11px] block">Sales Hero Headline:</span>
                    <p className="text-slate-200 font-bold">"{extractedResult.marketingCopy.salesHeadline}"</p>
                  </div>
                </div>
              </div>
            )}

            {/* Final Confirmation Actions */}
            <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => setExtractedResult(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-medium cursor-pointer"
              >
                Back to Edit
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleSaveAndLaunch}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-semibold border border-slate-700 transition-all cursor-pointer"
                >
                  Save to CRM & Catalog
                </button>

                <button
                  onClick={handleDirectBlastExtracted}
                  className="px-5 py-2.5 bg-gradient-to-r from-violet-600 via-indigo-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 text-white rounded-xl font-bold shadow-lg shadow-violet-600/30 flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Save & Direct Publish to (X, In, YT) Now</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
