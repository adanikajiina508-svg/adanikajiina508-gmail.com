import React, { useState } from 'react';
import { ScheduledPost, SocialPlatform, DigitalProduct } from '../types';
import { 
  Calendar as CalendarIcon, 
  Send, 
  CheckCircle2, 
  Clock, 
  Webhook, 
  Zap, 
  Twitter, 
  Linkedin, 
  Instagram, 
  Youtube, 
  Mail, 
  Globe, 
  Plus, 
  Trash2, 
  Play, 
  ExternalLink,
  AlertCircle,
  Copy,
  Check,
  RefreshCw,
  Share2,
  Code2
} from 'lucide-react';

interface SchedulerAndWebhooksTabProps {
  products: DigitalProduct[];
  scheduledPosts: ScheduledPost[];
  onAddPost: (post: Omit<ScheduledPost, 'id' | 'status'>) => void;
  onDeletePost: (id: string) => void;
  onUpdatePostStatus: (id: string, status: ScheduledPost['status']) => void;
  onSetPostDispatchResult: (id: string, result: { success: boolean; status?: number; message?: string }) => void;
  onOpenDirectPublishModal: (post: ScheduledPost) => void;
  onOpenAccountsHub: () => void;
}

export const SchedulerAndWebhooksTab: React.FC<SchedulerAndWebhooksTabProps> = ({
  products,
  scheduledPosts,
  onAddPost,
  onDeletePost,
  onUpdatePostStatus,
  onSetPostDispatchResult,
  onOpenDirectPublishModal,
  onOpenAccountsHub,
}) => {
  const [activePlatformFilter, setActivePlatformFilter] = useState<string>('all');
  const [activeViewMode, setActiveViewMode] = useState<'queue' | 'history'>('queue');
  const [isAddPostModalOpen, setIsAddPostModalOpen] = useState(false);
  const [inspectingPostPayload, setInspectingPostPayload] = useState<ScheduledPost | null>(null);

  // Webhook settings state
  const [webhookUrl, setWebhookUrl] = useState('https://hook.eu1.make.com/demo-marketing-webhook');
  const [isTestingWebhook, setIsTestingWebhook] = useState(false);
  const [webhookTestResult, setWebhookTestResult] = useState<{
    success: boolean;
    status?: number;
    message?: string;
  } | null>(null);

  // New Post Form State
  const [newPostProductId, setNewPostProductId] = useState(products[0]?.id || '');
  const [newPostPlatform, setNewPostPlatform] = useState<SocialPlatform>('twitter');
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostDate, setNewPostDate] = useState(() => {
    const today = new Date();
    return today.toISOString().slice(0, 10);
  });
  const [newPostTime, setNewPostTime] = useState('09:00');

  // Dispatching state for individual post
  const [dispatchingPostId, setDispatchingPostId] = useState<string | null>(null);

  const filteredPosts = scheduledPosts.filter((post) => {
    const matchesPlatform = activePlatformFilter === 'all' || post.platform === activePlatformFilter;
    const matchesView = activeViewMode === 'queue' ? post.status === 'scheduled' : post.status === 'published';
    return matchesPlatform && matchesView;
  });

  const scheduledCount = scheduledPosts.filter(p => p.status === 'scheduled').length;
  const publishedCount = scheduledPosts.filter(p => p.status === 'published').length;

  const getPlatformIcon = (platform: SocialPlatform) => {
    switch (platform) {
      case 'twitter': return <Twitter className="w-4 h-4 text-sky-400" />;
      case 'linkedin': return <Linkedin className="w-4 h-4 text-indigo-400" />;
      case 'youtube': return <Youtube className="w-4 h-4 text-rose-500" />;
      case 'instagram': return <Instagram className="w-4 h-4 text-pink-400" />;
      case 'email': return <Mail className="w-4 h-4 text-emerald-400" />;
      default: return <Globe className="w-4 h-4 text-slate-400" />;
    }
  };

  const getPlatformName = (platform: SocialPlatform) => {
    switch (platform) {
      case 'twitter': return 'Twitter / X';
      case 'linkedin': return 'LinkedIn';
      case 'youtube': return 'YouTube Community';
      case 'instagram': return 'Instagram / Reel';
      case 'email': return 'Email Drip';
      default: return 'Cross-Channel';
    }
  };

  const handleTestWebhook = async () => {
    setIsTestingWebhook(true);
    setWebhookTestResult(null);

    try {
      const response = await fetch('/api/webhooks/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          webhookUrl,
          payload: {
            event: 'marketing_post_test_ping',
            app: 'KreatorPulse Marketing OS',
            samplePost: {
              title: 'Solopreneur Notion OS Launch',
              platform: 'twitter',
              content: 'Testing marketing automation webhook connection from KreatorPulse!',
              scheduledFor: new Date().toISOString(),
            },
          },
        }),
      });

      const data = await response.json();
      setWebhookTestResult({
        success: data.success,
        status: data.status,
        message: data.success 
          ? `Webhook ping accepted! Status: ${data.status} ${data.statusText || 'OK'}` 
          : `Webhook responded with error: ${data.details || data.error || 'Connection failed'}`,
      });
    } catch (err: any) {
      setWebhookTestResult({
        success: false,
        message: err.message || 'Network error reaching webhook URL',
      });
    } finally {
      setIsTestingWebhook(false);
    }
  };

  const handleDispatchPostNow = async (post: ScheduledPost) => {
    setDispatchingPostId(post.id);

    try {
      const targetUrl = post.webhookUrl || webhookUrl;
      const response = await fetch('/api/webhooks/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          webhookUrl: targetUrl,
          payload: {
            event: 'publish_scheduled_post',
            postId: post.id,
            platform: post.platform,
            productTitle: post.productTitle,
            content: post.content,
            scheduledDate: post.scheduledDate,
            scheduledTime: post.scheduledTime,
          },
        }),
      });

      const data = await response.json();

      if (data.success) {
        onUpdatePostStatus(post.id, 'published');
        let destination = 'Webhook Bridge';
        try {
          destination = new URL(targetUrl).hostname;
        } catch {
          destination = targetUrl.slice(0, 30);
        }
        onSetPostDispatchResult(post.id, {
          success: true,
          status: data.status,
          message: `Dispatched successfully to ${destination}!`,
        });
      } else {
        onSetPostDispatchResult(post.id, {
          success: false,
          status: data.status,
          message: data.details || 'Dispatch failed',
        });
      }
    } catch (err: any) {
      onSetPostDispatchResult(post.id, {
        success: false,
        message: err.message || 'Failed to dispatch post',
      });
    } finally {
      setDispatchingPostId(null);
    }
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent || !newPostTitle) return;

    const matchedProduct = products.find(p => p.id === newPostProductId);

    onAddPost({
      productId: newPostProductId,
      productTitle: matchedProduct ? matchedProduct.title : 'Digital Asset',
      platform: newPostPlatform,
      title: newPostTitle,
      content: newPostContent,
      scheduledDate: newPostDate,
      scheduledTime: newPostTime,
      webhookUrl,
    });

    setNewPostTitle('');
    setNewPostContent('');
    setIsAddPostModalOpen(false);
  };

  const openSocialDirectShare = (platform: SocialPlatform, content: string) => {
    if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(content)}`, '_blank');
    } else if (platform === 'linkedin') {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://creators.store')}`, '_blank');
    } else if (platform === 'email') {
      window.open(`mailto:?subject=New Update&body=${encodeURIComponent(content)}`, '_blank');
    } else {
      navigator.clipboard.writeText(content);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Automation & Webhook Integration Hub */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 mb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-violet-950/80 text-violet-300 border border-violet-800/60 mb-2">
              <Webhook className="w-3.5 h-3.5 text-violet-400" />
              <span>Marketing Broadcast & Automation Engine</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Publish & Auto-Dispatch Campaigns Across Channels
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1">
              Deliver marketing copy, threads, and newsletters straight to your social accounts or outbound automation bridges (Zapier, Make, n8n, Buffer).
            </p>
          </div>

          <div className="flex items-center gap-2 self-start lg:self-auto">
            <button
              onClick={onOpenAccountsHub}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <span>Channel Connections</span>
            </button>
            <button
              onClick={() => setIsAddPostModalOpen(true)}
              className="px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Schedule Campaign Post</span>
            </button>
          </div>
        </div>

        {/* Webhook Configuration & Live Test */}
        <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-3 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="font-semibold text-slate-200 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Outbound Webhook Bridge (Zapier / Make.com / n8n / Custom Endpoint)</span>
            </span>
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Dispatcher Ready</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="url"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              placeholder="https://hook.eu1.make.com/... or https://hooks.zapier.com/..."
              className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500 font-mono text-xs"
            />
            <button
              onClick={handleTestWebhook}
              disabled={isTestingWebhook || !webhookUrl}
              className={`px-4 py-2 rounded-lg font-semibold text-white flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0 text-xs ${
                isTestingWebhook
                  ? 'bg-violet-800 cursor-not-allowed'
                  : 'bg-violet-600 hover:bg-violet-500 shadow-sm'
              }`}
            >
              {isTestingWebhook ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Firing Ping...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Test Connection</span>
                </>
              )}
            </button>
          </div>

          {webhookTestResult && (
            <div className={`p-3 rounded-lg border text-xs flex items-center gap-2 ${
              webhookTestResult.success
                ? 'bg-emerald-950/80 border-emerald-800 text-emerald-300'
                : 'bg-rose-950/80 border-rose-800 text-rose-300'
            }`}>
              {webhookTestResult.success ? <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" /> : <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />}
              <span>{webhookTestResult.message}</span>
            </div>
          )}
        </div>
      </div>

      {/* Campaign Queue & Calendar List */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        {/* Header & Filter */}
        <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950/50">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-lg border border-slate-700/60">
              <button
                onClick={() => setActiveViewMode('queue')}
                className={`px-3 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
                  activeViewMode === 'queue'
                    ? 'bg-violet-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Scheduled Queue ({scheduledCount})
              </button>
              <button
                onClick={() => setActiveViewMode('history')}
                className={`px-3 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
                  activeViewMode === 'history'
                    ? 'bg-violet-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Published History ({publishedCount})
              </button>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-800/80 p-1 rounded-lg border border-slate-700/60 text-xs overflow-x-auto scrollbar-none">
            {[
              { id: 'all', label: 'All Channels' },
              { id: 'twitter', label: 'Twitter / X' },
              { id: 'linkedin', label: 'LinkedIn' },
              { id: 'youtube', label: 'YouTube' },
              { id: 'instagram', label: 'Instagram' },
              { id: 'email', label: 'Email Drip' },
            ].map((flt) => (
              <button
                key={flt.id}
                onClick={() => setActivePlatformFilter(flt.id)}
                className={`px-3 py-1 rounded font-medium transition-all whitespace-nowrap cursor-pointer ${
                  activePlatformFilter === flt.id
                    ? 'bg-slate-200 text-slate-900 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {flt.label}
              </button>
            ))}
          </div>
        </div>

        {/* List of Posts */}
        <div className="divide-y divide-slate-800">
          {filteredPosts.length === 0 ? (
            <div className="p-12 text-center text-slate-500 text-xs">
              {activeViewMode === 'queue' 
                ? 'No marketing campaigns scheduled in this queue. Create a post above or generate a complete launch kit in AI Marketing Studio.'
                : 'No published campaigns recorded yet.'
              }
            </div>
          ) : (
            filteredPosts.map((post) => {
              const isDispatching = dispatchingPostId === post.id;
              return (
                <div key={post.id} className="p-4 sm:p-5 hover:bg-slate-800/30 transition-colors flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="p-2.5 bg-slate-800 border border-slate-700/80 rounded-xl shrink-0 mt-0.5">
                      {getPlatformIcon(post.platform)}
                    </div>

                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-white text-sm">{post.title}</span>
                        <span className="text-xs text-slate-400">·</span>
                        <span className="text-xs text-slate-400 font-medium">{post.productTitle}</span>
                        <span className="text-xs text-slate-400">·</span>
                        <span className={`text-[10px] font-bold uppercase ${
                          post.status === 'published' ? 'text-emerald-400' : 'text-amber-400'
                        }`}>
                          {post.status}
                        </span>
                      </div>

                      <p className="text-xs text-slate-300 whitespace-pre-line leading-relaxed max-w-3xl line-clamp-3">
                        {post.content}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 pt-1">
                        <span className="flex items-center gap-1 font-mono tabular-nums">
                          <CalendarIcon className="w-3.5 h-3.5 text-slate-500" />
                          <span>{post.scheduledDate} at {post.scheduledTime}</span>
                        </span>

                        <span className="text-slate-500">·</span>
                        <span>{getPlatformName(post.platform)}</span>

                        {post.dispatchResult && (
                          <>
                            <span className="text-slate-500">·</span>
                            <span className={`flex items-center gap-1 ${post.dispatchResult.success ? 'text-emerald-400' : 'text-rose-400'}`}>
                              {post.dispatchResult.success ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                              <span>{post.dispatchResult.message}</span>
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions for post */}
                  <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                    <button
                      onClick={() => setInspectingPostPayload(post)}
                      className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg text-xs border border-slate-700 transition-colors cursor-pointer"
                      title="Inspect Webhook JSON Payload"
                    >
                      <Code2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onOpenDirectPublishModal(post)}
                      className="px-3 py-1.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                      title="Publish directly across X, LinkedIn, YouTube"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Direct Publish</span>
                    </button>

                    <button
                      onClick={() => handleDispatchPostNow(post)}
                      disabled={isDispatching}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer ${
                        isDispatching
                          ? 'bg-violet-800 text-violet-300 cursor-not-allowed'
                          : 'bg-violet-600 hover:bg-violet-500 text-white'
                      }`}
                      title="Fire webhook now to publish"
                    >
                      {isDispatching ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Firing...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>Dispatch Webhook</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => onDeletePost(post.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                      title="Delete post"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Inspect Webhook JSON Payload Modal */}
      {inspectingPostPayload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Code2 className="w-4 h-4 text-violet-400" />
                <span>Outbound Webhook JSON Schema</span>
              </h3>
              <button
                onClick={() => setInspectingPostPayload(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="text-slate-400 mb-3">
              This structured JSON payload is transmitted when the webhook fires to your automation scenario (Make / Zapier / n8n):
            </p>

            <pre className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-slate-300 font-mono text-[11px] overflow-x-auto max-h-72">
              {JSON.stringify({
                event: 'publish_scheduled_post',
                postId: inspectingPostPayload.id,
                platform: inspectingPostPayload.platform,
                productTitle: inspectingPostPayload.productTitle,
                title: inspectingPostPayload.title,
                content: inspectingPostPayload.content,
                scheduledDate: inspectingPostPayload.scheduledDate,
                scheduledTime: inspectingPostPayload.scheduledTime,
                webhookUrl: inspectingPostPayload.webhookUrl || webhookUrl,
                timestamp: new Date().toISOString()
              }, null, 2)}
            </pre>

            <div className="flex justify-end pt-4 mt-3 border-t border-slate-800">
              <button
                onClick={() => setInspectingPostPayload(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Scheduled Post Modal */}
      {isAddPostModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">
            <h3 className="text-lg font-bold text-white mb-4">Schedule Automated Campaign Post</h3>
            <form onSubmit={handleCreatePost} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Post Title / Campaign</label>
                <input
                  type="text"
                  required
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                  placeholder="e.g. Launch Day Thread #1"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Target Product</label>
                  <select
                    value={newPostProductId}
                    onChange={(e) => setNewPostProductId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-violet-500"
                  >
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Channel / Platform</label>
                  <select
                    value={newPostPlatform}
                    onChange={(e) => setNewPostPlatform(e.target.value as SocialPlatform)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-violet-500"
                  >
                    <option value="twitter">Twitter / X</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="instagram">Instagram / TikTok</option>
                    <option value="email">Email Newsletter / Drip</option>
                    <option value="threads">Threads / Bluesky</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Schedule Date</label>
                  <input
                    type="date"
                    required
                    value={newPostDate}
                    onChange={(e) => setNewPostDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-violet-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Schedule Time</label>
                  <input
                    type="time"
                    required
                    value={newPostTime}
                    onChange={(e) => setNewPostTime(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-violet-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Post Content Copy</label>
                <textarea
                  required
                  rows={4}
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="Paste or write the marketing post copy, hooks, and call-to-action link..."
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddPostModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-lg shadow-sm cursor-pointer"
                >
                  Schedule Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
