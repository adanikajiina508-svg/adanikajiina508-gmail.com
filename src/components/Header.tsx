import React from 'react';
import { 
  Sparkles, 
  Layers, 
  Search, 
  Calendar, 
  Palette, 
  TrendingUp, 
  Plus, 
  Send,
  Zap,
  BarChart3,
  Settings
} from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  totalProducts: number;
  totalRevenue: number;
  totalLeads: number;
  totalScheduled: number;
  connectedAccountsCount: number;
  onNewProductClick: () => void;
  onOpenUtmBuilder: () => void;
  onOpenAccountsHub: () => void;
  onOpenWorkspaceImporter: () => void;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  totalProducts,
  totalRevenue,
  totalLeads,
  totalScheduled,
  connectedAccountsCount,
  onNewProductClick,
  onOpenUtmBuilder,
  onOpenAccountsHub,
  onOpenWorkspaceImporter,
  onOpenSettings,
}) => {
  const tabs = [
    { id: 'products', label: 'Products & CRM', icon: Layers },
    { id: 'keywords', label: 'Keyword Radar', icon: Search },
    { id: 'marketing', label: 'AI Marketing Studio', icon: Sparkles, badge: 'AI' },
    { id: 'designer', label: 'Mockup & Banner Studio', icon: Palette },
    { id: 'scheduler', label: 'Campaign Dispatcher', icon: Calendar, badge: totalScheduled > 0 ? `${totalScheduled}` : undefined },
  ];

  return (
    <header className="border-b border-slate-800 bg-[#0d1322] sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top bar */}
        <div className="flex items-center justify-between py-3 border-b border-slate-800/80 gap-4">
          {/* Brand Zone */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center shadow-md">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg text-white tracking-tight">Kreator<span className="text-violet-400">Pulse</span></span>
                <span className="text-xs text-slate-500 hidden md:inline">· Marketing & Revenue OS</span>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="hidden lg:flex items-center gap-4 text-xs font-mono tabular-nums">
            <div className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1 flex items-center gap-1.5">
              <span className="text-slate-400 font-sans">Products:</span>
              <span className="font-bold text-white">{totalProducts}</span>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1 flex items-center gap-1.5">
              <span className="text-slate-400 font-sans">Revenue:</span>
              <span className="font-bold text-emerald-400">${totalRevenue.toLocaleString()}</span>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1 flex items-center gap-1.5">
              <span className="text-slate-400 font-sans">CRM Leads:</span>
              <span className="font-bold text-sky-400">{totalLeads}</span>
            </div>
          </div>

          {/* Right Action buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onOpenAccountsHub}
              className="text-xs font-medium text-slate-300 hover:text-white px-2.5 py-1.5 rounded-lg border border-slate-700/80 bg-slate-800/60 hover:bg-slate-800 transition-all flex items-center gap-1.5 cursor-pointer"
              title="Channel Connections (X, LinkedIn, YouTube, Webhook)"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Channels ({connectedAccountsCount})</span>
            </button>
            <button
              onClick={onOpenWorkspaceImporter}
              className="text-xs font-medium text-amber-200 hover:text-white px-2.5 py-1.5 rounded-lg border border-amber-600/40 bg-amber-950/30 hover:bg-amber-900/40 transition-all hidden sm:flex items-center gap-1.5 cursor-pointer"
              title="Import Notion notes and raw drafts"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Import Notion</span>
            </button>
            <button
              onClick={onOpenUtmBuilder}
              className="text-xs font-medium text-slate-300 hover:text-white px-2.5 py-1.5 rounded-lg border border-slate-700/80 bg-slate-800/60 hover:bg-slate-800 transition-all hidden md:flex items-center gap-1.5 cursor-pointer"
              title="Campaign UTM Link Builder"
            >
              <BarChart3 className="w-3.5 h-3.5 text-violet-400" />
              <span>UTMs</span>
            </button>
            <button
              onClick={onOpenSettings}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg border border-slate-700/80 bg-slate-800/60 hover:bg-slate-800 transition-all cursor-pointer"
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              onClick={onNewProductClick}
              className="text-xs font-semibold text-white px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 shadow-sm transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>New Product</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center space-x-1 overflow-x-auto py-2 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-violet-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`ml-1 px-1.5 py-0.2 rounded font-mono text-[10px] font-bold ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-violet-950 text-violet-300 border border-violet-800/60'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
