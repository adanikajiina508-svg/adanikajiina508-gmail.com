import React, { useState } from 'react';
import { SocialAccountConnection } from '../types';
import { 
  X, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Twitter, 
  Linkedin, 
  Youtube, 
  Webhook, 
  Key, 
  ShieldCheck, 
  ExternalLink,
  Zap
} from 'lucide-react';

interface ConnectedAccountsModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: SocialAccountConnection[];
  onUpdateAccount: (updated: SocialAccountConnection) => void;
  onTestAccount: (platform: string) => Promise<{ success: boolean; message: string }>;
}

export const ConnectedAccountsModal: React.FC<ConnectedAccountsModalProps> = ({
  isOpen,
  onClose,
  accounts,
  onUpdateAccount,
  onTestAccount,
}) => {
  const [testingPlatform, setTestingPlatform] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{ platform: string; success: boolean; message: string } | null>(null);
  const [editingPlatform, setEditingPlatform] = useState<string | null>(null);
  const [editHandle, setEditHandle] = useState('');
  const [editApiKey, setEditApiKey] = useState('');

  if (!isOpen) return null;

  const handleTest = async (platform: string) => {
    setTestingPlatform(platform);
    setTestResult(null);
    try {
      const res = await onTestAccount(platform);
      setTestResult({ platform, success: res.success, message: res.message });
    } catch (err: any) {
      setTestResult({ platform, success: false, message: err.message || 'Connection ping failed' });
    } finally {
      setTestingPlatform(null);
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'twitter': return <Twitter className="w-5 h-5 text-sky-400" />;
      case 'linkedin': return <Linkedin className="w-5 h-5 text-indigo-400" />;
      case 'youtube': return <Youtube className="w-5 h-5 text-rose-500" />;
      case 'webhook_bridge': return <Webhook className="w-5 h-5 text-amber-400" />;
      default: return <Zap className="w-5 h-5 text-violet-400" />;
    }
  };

  const startEdit = (acc: SocialAccountConnection) => {
    setEditingPlatform(acc.platform);
    setEditHandle(acc.handleOrChannel);
    setEditApiKey(acc.apiKey || acc.webhookUrl || '');
  };

  const saveEdit = (acc: SocialAccountConnection) => {
    onUpdateAccount({
      ...acc,
      handleOrChannel: editHandle || acc.handleOrChannel,
      apiKey: acc.platform !== 'webhook_bridge' ? editApiKey : undefined,
      webhookUrl: acc.platform === 'webhook_bridge' ? editApiKey : acc.webhookUrl,
      connected: true,
      lastActive: 'Updated just now',
    });
    setEditingPlatform(null);
  };

  const toggleConnection = (acc: SocialAccountConnection) => {
    onUpdateAccount({
      ...acc,
      connected: !acc.connected,
      lastActive: !acc.connected ? 'Connected now' : 'Disconnected',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 overscroll-contain">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto modal-scroll">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-gradient-to-tr from-violet-600 to-pink-600 rounded-xl text-white shadow-md">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Direct Social Account Connections</h3>
              <p className="text-xs text-slate-400">Post directly to YouTube, X (Twitter), LinkedIn, or trigger webhook automation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-500 hover:text-slate-300 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global info pill */}
        <div className="mb-5 p-3.5 bg-violet-950/40 border border-violet-800/50 rounded-xl text-xs text-violet-200 flex items-start gap-2.5">
          <Zap className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <strong className="text-white">Direct Posting & Webhook Bridge Enabled:</strong>
            <p className="text-violet-300/90 leading-relaxed">
              You can connect native account tokens or use your Zapier / Make / n8n webhook bridge to broadcast marketing posts across X, LinkedIn, and YouTube simultaneously without API limits.
            </p>
          </div>
        </div>

        {/* Accounts List */}
        <div className="space-y-3.5">
          {accounts.map((acc) => {
            const isEditing = editingPlatform === acc.platform;
            const isTesting = testingPlatform === acc.platform;
            const testInfo = testResult?.platform === acc.platform ? testResult : null;

            return (
              <div 
                key={acc.platform}
                className={`p-4 rounded-xl border transition-all ${
                  acc.connected 
                    ? 'bg-slate-950/70 border-slate-800 hover:border-slate-700' 
                    : 'bg-slate-900/40 border-slate-800/60 opacity-75'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 bg-slate-800/80 rounded-xl border border-slate-700/80 shrink-0">
                      {getPlatformIcon(acc.platform)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white">{acc.name}</h4>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          acc.connected 
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' 
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}>
                          {acc.connected ? 'CONNECTED' : 'DISCONNECTED'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-0.5 font-mono">{acc.handleOrChannel}</p>
                      <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                        {acc.scopes.map((sc, i) => (
                          <span key={i} className="text-[10px] bg-slate-800/80 text-slate-400 border border-slate-700/60 px-1.5 py-0.5 rounded font-mono">
                            {sc}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => handleTest(acc.platform)}
                      disabled={isTesting || !acc.connected}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
                        isTesting 
                          ? 'bg-slate-800 text-slate-400 border-slate-700 cursor-not-allowed'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                      }`}
                    >
                      {isTesting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5 text-amber-300" />}
                      <span>{isTesting ? 'Pinging...' : 'Test Connection'}</span>
                    </button>

                    <button
                      onClick={() => isEditing ? saveEdit(acc) : startEdit(acc)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-medium border border-slate-700 cursor-pointer"
                    >
                      {isEditing ? 'Save' : 'Configure'}
                    </button>

                    <button
                      onClick={() => toggleConnection(acc)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        acc.connected
                          ? 'bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800/60'
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                      }`}
                    >
                      {acc.connected ? 'Disconnect' : 'Connect'}
                    </button>
                  </div>
                </div>

                {/* Edit Drawer */}
                {isEditing && (
                  <div className="mt-3 pt-3 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-slate-400 mb-1">Handle / Channel Name</label>
                      <input
                        type="text"
                        value={editHandle}
                        onChange={(e) => setEditHandle(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-violet-500 text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">
                        {acc.platform === 'webhook_bridge' ? 'Webhook Endpoint URL' : 'API Bearer Token / OAuth Secret'}
                      </label>
                      <input
                        type="password"
                        placeholder={acc.platform === 'webhook_bridge' ? 'https://hook.make.com/...' : '••••••••••••••••'}
                        value={editApiKey}
                        onChange={(e) => setEditApiKey(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-violet-500 text-xs font-mono"
                      />
                    </div>
                  </div>
                )}

                {/* Test Feedback */}
                {testInfo && (
                  <div className={`mt-3 p-2.5 rounded-lg border text-xs flex items-center gap-2 ${
                    testInfo.success 
                      ? 'bg-emerald-950/80 border-emerald-800 text-emerald-300' 
                      : 'bg-rose-950/80 border-rose-800 text-rose-300'
                  }`}>
                    {testInfo.success ? <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" /> : <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />}
                    <span>{testInfo.message}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs rounded-xl shadow-md cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
