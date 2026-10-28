import React, { useState } from 'react';
import { 
  DigitalProduct, 
  Lead, 
  ProductCategory 
} from '../types';
import { 
  Plus, 
  ExternalLink, 
  Sparkles, 
  Palette, 
  DollarSign, 
  Users, 
  TrendingUp, 
  Search, 
  Filter, 
  Mail, 
  Trash2, 
  Edit3,
  CheckCircle2,
  Clock,
  Tag,
  ArrowUpRight,
  Download,
  BarChart2,
  Check,
  Send,
  UserCheck,
  ChevronRight
} from 'lucide-react';

interface ProductsAndCrmTabProps {
  products: DigitalProduct[];
  leads: Lead[];
  onAddProduct: (product: Omit<DigitalProduct, 'id' | 'createdAt' | 'salesCount' | 'revenue'>) => void;
  onDeleteProduct: (id: string) => void;
  onAddLead: (lead: Omit<Lead, 'id' | 'updatedAt'>) => void;
  onUpdateLeadStage: (id: string, stage: Lead['stage']) => void;
  onDeleteLead: (id: string) => void;
  onLaunchMarketingForProduct: (product: DigitalProduct) => void;
  onDesignMockupForProduct: (product: DigitalProduct) => void;
  onOpenNewProductModal: () => void;
  onOpenWorkspaceImporter: () => void;
}

export const ProductsAndCrmTab: React.FC<ProductsAndCrmTabProps> = ({
  products,
  leads,
  onAddProduct,
  onDeleteProduct,
  onAddLead,
  onUpdateLeadStage,
  onDeleteLead,
  onLaunchMarketingForProduct,
  onDesignMockupForProduct,
  onOpenNewProductModal,
  onOpenWorkspaceImporter,
}) => {
  const [subTab, setSubTab] = useState<'products' | 'leads'>('products');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [stageFilter, setStageFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false);
  const [copiedUrlId, setCopiedUrlId] = useState<string | null>(null);

  // New Lead form state
  const [newLeadName, setNewLeadName] = useState('');
  const [newLeadEmail, setNewLeadEmail] = useState('');
  const [newLeadHandle, setNewLeadHandle] = useState('');
  const [newLeadProductId, setNewLeadProductId] = useState(products[0]?.id || '');
  const [newLeadStage, setNewLeadStage] = useState<Lead['stage']>('New Lead');
  const [newLeadScore, setNewLeadScore] = useState(70);
  const [newLeadValue, setNewLeadValue] = useState(49);
  const [newLeadSource, setNewLeadSource] = useState<Lead['source']>('Twitter/X');
  const [newLeadNotes, setNewLeadNotes] = useState('');

  // Calculations
  const totalRevenue = products.reduce((acc, p) => acc + (p.revenue || 0), 0);
  const totalSalesCount = products.reduce((acc, p) => acc + (p.salesCount || 0), 0);
  const totalPipelineValue = leads.reduce((acc, l) => acc + (l.potentialValue || 0), 0);
  const customerLeads = leads.filter(l => l.stage === 'Customer' || l.stage === 'VIP').length;
  const leadConversionRate = leads.length > 0 ? ((customerLeads / leads.length) * 100).toFixed(1) : '0.0';

  const filteredProducts = products.filter((p) => {
    const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.targetAudience.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.usp.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const filteredLeads = leads.filter((l) => {
    const matchesStage = stageFilter === 'All' || l.stage === stageFilter;
    const matchesSearch = l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          l.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          l.productTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (l.companyOrHandle && l.companyOrHandle.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStage && matchesSearch;
  });

  const categories = [
    'All', 
    'Notion Template', 
    'Video Course', 
    'UI/UX Kit', 
    'Micro-SaaS', 
    'Ebook & Guide', 
    'Design Assets / Presets', 
    'AI Prompt Library', 
    'Code Boilerplate', 
    'Paid Newsletter / Community'
  ];

  const stages: Array<Lead['stage'] | 'All'> = [
    'All',
    'New Lead',
    'Contacted',
    'Demo / Trial',
    'Customer',
    'VIP'
  ];

  const handleCopySalesUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrlId(id);
    setTimeout(() => setCopiedUrlId(null), 2000);
  };

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadName || !newLeadEmail) return;

    const matchedProduct = products.find(p => p.id === newLeadProductId);

    onAddLead({
      name: newLeadName,
      email: newLeadEmail,
      companyOrHandle: newLeadHandle,
      productId: newLeadProductId,
      productTitle: matchedProduct ? matchedProduct.title : 'Digital Asset',
      stage: newLeadStage,
      score: newLeadScore,
      potentialValue: newLeadValue,
      source: newLeadSource,
      notes: newLeadNotes,
    });

    setNewLeadName('');
    setNewLeadEmail('');
    setNewLeadHandle('');
    setNewLeadNotes('');
    setIsAddLeadModalOpen(false);
  };

  const exportLeadsToCsv = () => {
    const headers = ['Name', 'Email', 'Handle/Company', 'Product', 'Stage', 'Score', 'Value', 'Source', 'Notes', 'Updated'];
    const rows = leads.map(l => [
      `"${l.name}"`,
      `"${l.email}"`,
      `"${l.companyOrHandle || ''}"`,
      `"${l.productTitle}"`,
      `"${l.stage}"`,
      l.score,
      l.potentialValue,
      `"${l.source}"`,
      `"${(l.notes || '').replace(/"/g, '""')}"`,
      `"${l.updatedAt}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `kreatorpulse_crm_pipeline_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Executive Marketing & Commercial Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-900/80 p-4 rounded-xl border border-slate-800 shadow-sm">
        <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800/80">
          <span className="text-[11px] text-slate-400 font-medium block">Total Digital Product Revenue</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-emerald-400">
              ${totalRevenue.toLocaleString()}
            </span>
            <span className="text-[11px] text-slate-500">USD</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block font-mono tabular-nums">
            {totalSalesCount.toLocaleString()} total units sold
          </span>
        </div>

        <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800/80">
          <span className="text-[11px] text-slate-400 font-medium block">Active Product Portfolio</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-white">
              {products.length}
            </span>
            <span className="text-[11px] text-slate-500">catalog items</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">
            {products.filter(p => p.status === 'active').length} live on store
          </span>
        </div>

        <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800/80">
          <span className="text-[11px] text-slate-400 font-medium block">Open CRM Pipeline Value</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-sky-400">
              ${totalPipelineValue.toLocaleString()}
            </span>
            <span className="text-[11px] text-slate-500">pipeline</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block font-mono tabular-nums">
            {leads.length} tracked deals & buyers
          </span>
        </div>

        <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800/80">
          <span className="text-[11px] text-slate-400 font-medium block">Pipeline Conversion Rate</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-violet-400">
              {leadConversionRate}%
            </span>
            <span className="text-[11px] text-slate-500">win rate</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block font-mono tabular-nums">
            {customerLeads} closed clients / VIPs
          </span>
        </div>
      </div>

      {/* Main Workspace Navigation & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/70 p-4 rounded-xl border border-slate-800">
        <div className="flex items-center gap-1.5 bg-slate-950/80 p-1 rounded-lg border border-slate-800 w-fit">
          <button
            onClick={() => setSubTab('products')}
            className={`px-4 py-2 rounded-md text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
              subTab === 'products'
                ? 'bg-violet-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Digital Products ({products.length})
          </button>
          <button
            onClick={() => setSubTab('leads')}
            className={`px-4 py-2 rounded-md text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
              subTab === 'leads'
                ? 'bg-violet-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Buyer CRM & Pipeline ({leads.length})
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              placeholder={subTab === 'products' ? "Search products or audience..." : "Search leads, emails, handles..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-800/80 border border-slate-700/80 rounded-lg text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500"
            />
          </div>

          {subTab === 'products' ? (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenWorkspaceImporter}
                className="px-3 py-1.5 bg-amber-950/40 hover:bg-amber-900/50 text-amber-200 text-xs font-medium rounded-lg border border-amber-600/40 flex items-center gap-1.5 transition-all cursor-pointer"
                title="Import notes or ideas from Notion"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Import Notion Notes</span>
              </button>
              <button
                onClick={onOpenNewProductModal}
                className="px-3.5 py-1.5 bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>New Product</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={exportLeadsToCsv}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium rounded-lg border border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer"
                title="Export Pipeline to CSV"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
              <button
                onClick={() => setIsAddLeadModalOpen(true)}
                className="px-3.5 py-1.5 bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Deal Lead</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* PRODUCTS VIEW */}
      {subTab === 'products' && (
        <div className="space-y-4">
          {/* Segmented Category Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  categoryFilter === cat
                    ? 'bg-slate-200 text-slate-900 font-semibold shadow-sm'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredProducts.map((product) => {
              const estimatedConvRate = product.salesCount > 0 ? ((product.salesCount / (product.salesCount * 14)) * 100).toFixed(1) : '3.8';
              return (
                <div 
                  key={product.id}
                  className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-xl p-5 transition-all shadow-sm flex flex-col justify-between group"
                >
                  <div>
                    {/* Header: Title, Category & Price */}
                    <div className="flex items-start justify-between gap-3 mb-2.5">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <span className="font-medium text-slate-300">{product.category}</span>
                          <span aria-hidden="true">·</span>
                          <span className={`uppercase font-semibold text-[10px] ${
                            product.status === 'active' ? 'text-emerald-400' : 'text-slate-500'
                          }`}>
                            {product.status}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono tabular-nums text-[11px] text-slate-400">Added {product.createdAt}</span>
                        </div>
                        <h3 className="text-lg font-bold text-white group-hover:text-violet-300 transition-colors leading-snug">
                          {product.title}
                        </h3>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-xl font-bold font-mono tabular-nums text-emerald-400">
                          ${product.price}
                        </div>
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-mono">
                          {product.currency}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed line-clamp-2 mb-3">
                      {product.description}
                    </p>

                    {/* Marketing Positioning Box */}
                    <div className="bg-slate-950/60 rounded-lg p-3 border border-slate-800/80 mb-3.5 text-xs space-y-1.5">
                      <div className="text-slate-300">
                        <span className="text-slate-500 font-medium mr-1.5">Core USP:</span>
                        <span>{product.usp}</span>
                      </div>
                      <div className="text-slate-300">
                        <span className="text-slate-500 font-medium mr-1.5">Target ICP:</span>
                        <span>{product.targetAudience}</span>
                      </div>
                    </div>

                    {/* Sales Metrics Strip */}
                    <div className="grid grid-cols-3 gap-2 mb-4 p-2.5 bg-slate-950/40 rounded-lg border border-slate-800/80 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase block font-medium">Sales Units</span>
                        <span className="text-sm font-bold font-mono tabular-nums text-white">
                          {product.salesCount} sold
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase block font-medium">Revenue</span>
                        <span className="text-sm font-bold font-mono tabular-nums text-emerald-400">
                          ${product.revenue.toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase block font-medium">Est. Conversion</span>
                        <span className="text-sm font-bold font-mono tabular-nums text-sky-400">
                          {estimatedConvRate}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Toolbar */}
                  <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onLaunchMarketingForProduct(product)}
                        className="px-3 py-1.5 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                        title="Generate multi-channel launch campaign copy"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        <span>AI Marketing Kit</span>
                      </button>
                      <button
                        onClick={() => onDesignMockupForProduct(product)}
                        className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium border border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer"
                        title="Design social promo banner"
                      >
                        <Palette className="w-3.5 h-3.5 text-pink-400" />
                        <span>Mockup Banner</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleCopySalesUrl(product.salesPageUrl, product.id)}
                        className="px-2 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-medium border border-slate-700 transition-colors flex items-center gap-1 cursor-pointer"
                        title="Copy store URL"
                      >
                        {copiedUrlId === product.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400 text-[11px]">Copied</span>
                          </>
                        ) : (
                          <>
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span className="text-[11px]">Copy Link</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => onDeleteProduct(product.id)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                        title="Delete product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* CRM & PIPELINE VIEW */}
      {subTab === 'leads' && (
        <div className="space-y-4">
          {/* Stage Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {stages.map((stg) => (
              <button
                key={stg}
                onClick={() => setStageFilter(stg)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  stageFilter === stg
                    ? 'bg-slate-200 text-slate-900 font-semibold shadow-sm'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {stg} {stg !== 'All' ? `(${leads.filter(l => l.stage === stg).length})` : `(${leads.length})`}
              </button>
            ))}
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-950/70 text-slate-400 font-semibold uppercase text-[11px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Contact & Organization</th>
                    <th className="py-3 px-4">Product Interest</th>
                    <th className="py-3 px-4">Deal Stage</th>
                    <th className="py-3 px-4">Intent Score</th>
                    <th className="py-3 px-4">Deal Value</th>
                    <th className="py-3 px-4">Acquisition Source</th>
                    <th className="py-3 px-4">Marketing Notes</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {filteredLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white">{lead.name}</div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                          <a href={`mailto:${lead.email}`} className="hover:text-violet-400 transition-colors">
                            {lead.email}
                          </a>
                          {lead.companyOrHandle && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span className="text-violet-400">{lead.companyOrHandle}</span>
                            </>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="text-xs text-slate-300 font-medium">
                          {lead.productTitle}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <select
                          value={lead.stage}
                          onChange={(e) => onUpdateLeadStage(lead.id, e.target.value as Lead['stage'])}
                          className="bg-slate-800 text-slate-200 border border-slate-700 text-xs rounded-md px-2.5 py-1 font-medium focus:outline-none focus:border-violet-500 cursor-pointer"
                        >
                          <option value="New Lead">New Lead</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Demo / Trial">Demo / Trial</option>
                          <option value="Customer">Customer</option>
                          <option value="VIP">VIP</option>
                        </select>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                            <div 
                              className={`h-full ${
                                lead.score >= 80 ? 'bg-emerald-500' : lead.score >= 60 ? 'bg-amber-500' : 'bg-slate-500'
                              }`}
                              style={{ width: `${lead.score}%` }}
                            />
                          </div>
                          <span className="font-mono tabular-nums font-bold text-xs text-slate-200">{lead.score}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono tabular-nums font-bold text-emerald-400">
                        ${lead.potentialValue.toLocaleString()}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="text-xs text-slate-400">{lead.source}</span>
                      </td>

                      <td className="py-3.5 px-4 max-w-xs truncate text-xs text-slate-400">
                        {lead.notes || '—'}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <a
                            href={`mailto:${lead.email}?subject=Quick question regarding ${lead.productTitle}`}
                            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                            title="Send Email"
                          >
                            <Mail className="w-3.5 h-3.5" />
                          </a>
                          <button
                            onClick={() => onDeleteLead(lead.id)}
                            className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                            title="Delete Lead"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Add Lead Modal */}
      {isAddLeadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
            <h3 className="text-lg font-bold text-white mb-4">Add Prospect to Marketing Pipeline</h3>
            <form onSubmit={handleCreateLead} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Lead Name *</label>
                <input
                  type="text"
                  required
                  value={newLeadName}
                  onChange={(e) => setNewLeadName(e.target.value)}
                  placeholder="e.g. Alex Thorne"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Email *</label>
                <input
                  type="email"
                  required
                  value={newLeadEmail}
                  onChange={(e) => setNewLeadEmail(e.target.value)}
                  placeholder="alex@domain.com"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Handle / Agency</label>
                  <input
                    type="text"
                    value={newLeadHandle}
                    onChange={(e) => setNewLeadHandle(e.target.value)}
                    placeholder="@alexcreative"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Product</label>
                  <select
                    value={newLeadProductId}
                    onChange={(e) => setNewLeadProductId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-violet-500"
                  >
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Stage</label>
                  <select
                    value={newLeadStage}
                    onChange={(e) => setNewLeadStage(e.target.value as Lead['stage'])}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-violet-500"
                  >
                    <option value="New Lead">New Lead</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Demo / Trial">Demo / Trial</option>
                    <option value="Customer">Customer</option>
                    <option value="VIP">VIP</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Intent Score</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={newLeadScore}
                    onChange={(e) => setNewLeadScore(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-violet-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Value ($)</label>
                  <input
                    type="number"
                    min="0"
                    value={newLeadValue}
                    onChange={(e) => setNewLeadValue(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-violet-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Acquisition Source</label>
                <select
                  value={newLeadSource}
                  onChange={(e) => setNewLeadSource(e.target.value as Lead['source'])}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-violet-500"
                >
                  <option value="Twitter/X">Twitter/X</option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="Organic Search">Organic Search</option>
                  <option value="Newsletter">Newsletter</option>
                  <option value="Product Hunt">Product Hunt</option>
                  <option value="Direct">Direct</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Notes / Key Objections</label>
                <textarea
                  rows={2}
                  value={newLeadNotes}
                  onChange={(e) => setNewLeadNotes(e.target.value)}
                  placeholder="Notes about their team size, specific feature requests, or follow-up date..."
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddLeadModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-lg shadow-sm cursor-pointer"
                >
                  Save Lead to Pipeline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
