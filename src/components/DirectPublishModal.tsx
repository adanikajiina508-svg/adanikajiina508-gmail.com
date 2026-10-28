import React, { useState } from 'react';
import { SocialPlatform, SocialAccountConnection } from '../types';
import { 
  X, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Twitter, 
  Linkedin, 
  Youtube, 
  Webhook, 
  RefreshCw, 
  ExternalLink,
  ShieldCheck,
  Check
} from 'lucide-react';

interface DirectPublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: {
    id?: string;
    productTitle: string;
    title: string;
    content: string;
    platform?: SocialPlatform;
  } | null;
  accounts: SocialAccountConnection[];
  onDirectPublish: (params: {
    channels: SocialPlatform[];
    postTitle: string;
    content: string;
    productTitle: string;
  }) => Promise<{
    success: boolean;
    results: Record<string, { success: boolean; platformId: string; url: string; message: string }>;
  }>;
}

export const DirectPublishModal: React.FC<DirectPublishModalProps> = ({
  isOpen,
  onClose,
  post,
  accounts,
  onDirectPublish,
}) => {
  const [selectedChannels, setSelectedChannels] = useState<SocialPlatform[]>(['twitter', 'linkedin', 'youtube']);
  const [editableContent, setEditableContent] = useState(post?.content || '');
  const [editableTitle, setEditableTitle] = useState(post?.title || 'Launch Announcement');
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishResults, setPublishResults] = useState<Record<string, { success: boolean; platformId: string; url: string; message: string }> | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Sync when post changes
  React.useEffect(() => {
    if (post) {
      setEditableContent(post.content);
      setEditableTitle(post.title);
      setPublishResults(null);
      setErrorMsg(null);
    }
  }, [post]);

  if (!isOpen || !post) return null;

  const toggleChannel = (ch: SocialPlatform) => {
    if (selectedChannels.includes(ch)) {
      if (selectedChannels.length === 1) return; // Keep at least one
      setSelectedChannels(selectedChannels.filter(c => c !== ch));
    } else {
      setSelectedChannels([...selectedChannels, ch]);
    }
  };

  const handlePublishNow = async () => {
    setIsPublishing(true);
    setErrorMsg(null);
    setPublishResults(null);

    try {
      const response = await onDirectPublish({
        channels: selectedChannels,
        postTitle: editableTitle,
        content: editableContent,
        productTitle: post.productTitle,
      });

      if (response.success) {
        setPublishResults(response.results);
      } else {
        setErrorMsg('Failed to publish across selected channels.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred during multi-channel broadcast.');
    } finally {
      setIsPublishing(false);
    }
  };

  const getAccountForPlatform = (platform: SocialPlatform) => {
    return accounts.find(a => a.platform === platform);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 overscroll-contain">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto modal-scroll">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-gradient-to-tr from-violet-600 to-indigo-600 rounded-xl text-white shadow-md">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Direct Multi-Channel Publisher</h3>
              <p className="text-xs text-slate-400">Post simultaneously to your connected social channels</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-500 hover:text-slate-300 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Channel Selection Checkboxes */}
        <div className="space-y-2 mb-4">
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
            Select Destination Channels
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {/* X / Twitter */}
            <div
              onClick={() => toggleChannel('twitter')}
              className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                selectedChannels.includes('twitter')
                  ? 'bg-sky-950/40 border-sky-500/80 text-white'
                  : 'bg-slate-800/40 border-slate-700/60 text-slate-400'
              }`}
            >
              <div className="flex items-center gap-2 text-xs">
                <Twitter className="w-4 h-4 text-sky-400" />
                <div>
                  <span className="font-bold block">X (Twitter)</span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {getAccountForPlatform('twitter')?.handleOrChannel || '@connected'}
                  </span>
                </div>
              </div>
              <div className={`w-4 h-4 rounded-md flex items-center justify-center text-[10px] font-bold ${
                selectedChannels.includes('twitter') ? 'bg-sky-500 text-black' : 'border border-slate-600'
              }`}>
                {selectedChannels.includes('twitter') && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
            </div>

            {/* LinkedIn */}
            <div
              onClick={() => toggleChannel('linkedin')}
              className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                selectedChannels.includes('linkedin')
                  ? 'bg-indigo-950/40 border-indigo-500/80 text-white'
                  : 'bg-slate-800/40 border-slate-700/60 text-slate-400'
              }`}
            >
              <div className="flex items-center gap-2 text-xs">
                <Linkedin className="w-4 h-4 text-indigo-400" />
                <div>
                  <span className="font-bold block">LinkedIn</span>
                  <span className="text-[10px] text-slate-400 truncate max-w-[100px] block">
                    {getAccountForPlatform('linkedin')?.handleOrChannel || 'Profile'}
                  </span>
                </div>
              </div>
              <div className={`w-4 h-4 rounded-md flex items-center justify-center text-[10px] font-bold ${
                selectedChannels.includes('linkedin') ? 'bg-indigo-500 text-white' : 'border border-slate-600'
              }`}>
                {selectedChannels.includes('linkedin') && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
            </div>

            {/* YouTube */}
            <div
              onClick={() => toggleChannel('youtube')}
              className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                selectedChannels.includes('youtube')
                  ? 'bg-rose-950/40 border-rose-500/80 text-white'
                  : 'bg-slate-800/40 border-slate-700/60 text-slate-400'
              }`}
            >
              <div className="flex items-center gap-2 text-xs">
                <Youtube className="w-4 h-4 text-rose-500" />
                <div>
                  <span className="font-bold block">YouTube</span>
                  <span className="text-[10px] text-slate-400 truncate max-w-[100px] block">
                    Community / Shorts
                  </span>
                </div>
              </div>
              <div className={`w-4 h-4 rounded-md flex items-center justify-center text-[10px] font-bold ${
                selectedChannels.includes('youtube') ? 'bg-rose-500 text-white' : 'border border-slate-600'
              }`}>
                {selectedChannels.includes('youtube') && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
            </div>
          </div>
        </div>

        {/* Post Preview & Edit */}
        <div className="space-y-3 mb-5 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Campaign Headline</label>
            <input
              type="text"
              value={editableTitle}
              onChange={(e) => setEditableTitle(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-violet-500"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-slate-300 font-semibold">Post Content Copy</label>
              <span className={`text-[11px] ${editableContent.length > 280 ? 'text-amber-400' : 'text-slate-500'}`}>
                {editableContent.length} chars (will format as thread on X)
              </span>
            </div>
            <textarea
              rows={5}
              value={editableContent}
              onChange={(e) => setEditableContent(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-violet-500 leading-relaxed font-sans"
            />
          </div>
        </div>

        {/* Execution Feedback / Confirmed Posts */}
        {publishResults && (
          <div className="mb-5 p-4 bg-emerald-950/70 border border-emerald-800 rounded-xl space-y-3">
            <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Broadcast Completed Successfully! Live Verification:</span>
            </div>

            <div className="space-y-2 text-xs">
              {Object.entries(publishResults).map(([channel, res]) => (
                <div key={channel} className="p-2.5 bg-slate-900/80 rounded-lg border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {channel === 'twitter' && <Twitter className="w-3.5 h-3.5 text-sky-400" />}
                    {channel === 'linkedin' && <Linkedin className="w-3.5 h-3.5 text-indigo-400" />}
                    {channel === 'youtube' && <Youtube className="w-3.5 h-3.5 text-rose-500" />}
                    <span className="font-semibold text-white capitalize">{channel}</span>
                    <span className="text-[10px] text-slate-400 font-mono">ID: {res.platformId}</span>
                  </div>

                  <a
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-violet-400 hover:text-violet-300 flex items-center gap-1"
                  >
                    <span>View Post</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="mb-4 p-3 bg-rose-950/80 border border-rose-800 text-rose-300 rounded-lg text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold cursor-pointer"
          >
            {publishResults ? 'Close' : 'Cancel'}
          </button>

          {!publishResults && (
            <button
              onClick={handlePublishNow}
              disabled={isPublishing || selectedChannels.length === 0}
              className={`px-5 py-2.5 rounded-xl font-bold text-white text-xs shadow-lg flex items-center gap-2 transition-all cursor-pointer ${
                isPublishing || selectedChannels.length === 0
                  ? 'bg-violet-800 cursor-not-allowed opacity-80'
                  : 'bg-gradient-to-r from-violet-600 via-indigo-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 shadow-violet-600/30'
              }`}
            >
              {isPublishing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Broadcasting to {selectedChannels.length} Channels...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Publish Across {selectedChannels.length} Channels Now</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
