import React, { useState, useEffect } from 'react';
import { DigitalProduct, MarketingPack, SocialPlatform } from '../types';
import { 
  Sparkles, 
  Send, 
  Copy, 
  Check, 
  Calendar, 
  Twitter, 
  Linkedin, 
  Instagram, 
  Youtube,
  Mail, 
  Gift, 
  FileText, 
  Share2, 
  RefreshCw, 
  Zap, 
  Flame, 
  ArrowRight,
  ExternalLink
} from 'lucide-react';

interface AiMarketingGeneratorTabProps {
  products: DigitalProduct[];
  selectedProduct: DigitalProduct | null;
  onSelectProduct: (product: DigitalProduct) => void;
  preselectedKeywords: string[];
  onSchedulePost: (post: {
    productId: string;
    productTitle: string;
    platform: SocialPlatform;
    title: string;
    content: string;
    scheduledDate: string;
    scheduledTime: string;
  }) => void;
  onOpenDirectPublishModal: (post: {
    productTitle: string;
    title: string;
    content: string;
    platform: SocialPlatform;
  }) => void;
}

export const AiMarketingGeneratorTab: React.FC<AiMarketingGeneratorTabProps> = ({
  products,
  selectedProduct,
  onSelectProduct,
  preselectedKeywords,
  onSchedulePost,
  onOpenDirectPublishModal,
}) => {
  const [currentProduct, setCurrentProduct] = useState<DigitalProduct>(
    selectedProduct || products[0] || ({} as DigitalProduct)
  );

  const [keywordsInput, setKeywordsInput] = useState<string>(
    preselectedKeywords.join(', ') || 'notion template, creator business, productivity operating system'
  );

  const [tone, setTone] = useState<'high-converting' | 'thought-leader' | 'story-driven' | 'punchy'>('high-converting');
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [marketingPack, setMarketingPack] = useState<MarketingPack | null>(null);
  const [activeSubView, setActiveSubView] = useState<'social' | 'sales' | 'email' | 'leadmagnet'>('social');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [scheduledSuccessMsg, setScheduledSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (selectedProduct) {
      setCurrentProduct(selectedProduct);
    }
  }, [selectedProduct]);

  useEffect(() => {
    if (preselectedKeywords.length > 0) {
      setKeywordsInput(preselectedKeywords.join(', '));
    }
  }, [preselectedKeywords]);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2200);
  };

  const [autoOpenPublish, setAutoOpenPublish] = useState(true);
  const [autoQueueSchedule, setAutoQueueSchedule] = useState(true);

  const buildLocalFallbackPack = (prod: DigitalProduct, kwList: string[]): MarketingPack => {
    const title = prod.title || 'Digital Product Accelerator';
    const category = prod.category || 'Notion Template';
    const price = prod.price ? `$${prod.price}` : '$47';
    const audience = prod.targetAudience || 'Creators, Freelancers & Solopreneurs';
    const usp = prod.usp || 'Automate manual operations and scale digital product sales';
    const kwTags = (kwList.length > 0 ? kwList : ['digitalproduct', 'nocode', 'creator', 'solopreneur'])
      .slice(0, 4)
      .map(k => `#${k.replace(/[^a-zA-Z0-9]/g, '')}`)
      .join(' ');

    return {
      socialPosts: {
        twitterThread: [
          `🧵 Most ${audience} waste 15+ hours each week juggling messy tools and disjointed workflows.\n\nHere is how to streamline everything with ${title} 👇`,
          `1/ The Core Bottleneck:\n\nYou create great assets, but client intake, delivery, and marketing are scattered.\n\n${usp}.`,
          `2/ The Solution: ${title}\n\nBuilt specifically for ${audience}:\n• Instant plug-and-play setup\n• High-converting launch templates\n• Pre-configured automation pipelines`,
          `3/ Launch Special: Grab ${title} for just ${price} today!\n\nLink in bio. ${kwTags}`
        ],
        linkedInPost: `I spent months analyzing why so many ${audience} plateau despite great skills:\n\nThey spend 80% of their time on repetitive admin and only 20% on growth.\n\nToday, I'm launching ${title} — a purpose-built ${category} engineered to fix that.\n\nKey Highlights:\n• ${usp}\n• Step-by-step implementation playbooks\n• Pre-configured automation pipelines\n\nGrab launch access for ${price} via the link in the comments!`,
        youtubeCommunityPost: `🔥 Big news! ${title} is officially live!\n\nIf you want to ${usp.toLowerCase()}, this ${category} is ready for you.\n\nGrab launch access for ${price} via the channel link! 🎬`,
        instagramScript: {
          hookVisual: `Screen recording showing tabs organizing into the sleek dashboard of ${title}. Text: "Stop doing this manually..."`,
          voiceover: `If you are still running your creative business across 10 messy tools, you need to see this. We built ${title} to solve one problem: ${usp.toLowerCase()}.`,
          caption: `Introducing ${title} 🚀 Built for ${audience}.\n\nGet it today for only ${price}. Link in bio to grab your copy!\n\n${kwTags}`,
          hashtags: ['#digitalcreator', '#solopreneur', '#creatoreconomy', '#notion', '#passiveincome']
        }
      },
      salesCopy: {
        heroHeadline: `Stop Wasting Hours On Manual Chaos. Master Your Workflow with ${title}.`,
        subheadline: `The definitive ${category} engineered for ${audience} to ${usp.toLowerCase()}.`,
        valueBullets: [
          `Instant Implementation: Ready to use in under 15 minutes.`,
          `Proven Architecture: Battle-tested framework that eliminates bottlenecks.`,
          `Complete Asset Toolkit: Includes pre-formatted guides and templates.`,
          `Lifetime Access & Updates: Get all future improvements at zero extra cost.`
        ],
        objectionBuster: `Modular and 100% adaptable whether you are just starting or managing multiple client pipelines.`,
        callToAction: `Get Instant Access to ${title} for ${price} — Launch Special`
      },
      emailSequence: [
        {
          day: 'Day 1',
          theme: 'Launch Announcement & Core Problem',
          subject: `[New] Introducing ${title} (The system you've been waiting for)`,
          previewText: `How ${audience} are transforming their workflow in under 15 minutes...`,
          body: `Hey creator,\n\nIf you've felt overwhelmed balancing delivery and marketing, you're not alone.\n\nThat's why I created ${title}.\n\nIt's a complete ${category} designed to ${usp.toLowerCase()}.\n\nGrab your copy today for just ${price}.`,
          ctaButton: `Get ${title} for ${price}`
        },
        {
          day: 'Day 2',
          theme: 'Transformation & Behind The Scenes',
          subject: `The #1 mistake ${audience} make (and how to fix it)`,
          previewText: `Why working harder isn't the solution...`,
          body: `Hey there,\n\nYou could spend weeks building templates from scratch, or you could spend 5 minutes importing ${title} and start executing today.\n\nSee how it works and grab your license below:`,
          ctaButton: `Unlock ${title} Now`
        },
        {
          day: 'Day 3',
          theme: 'Final Call & Urgency',
          subject: `Last chance: Launch pricing on ${title} ends tonight ⏳`,
          previewText: `Your launch discount expires at midnight...`,
          body: `Hey,\n\nJust a quick reminder: launch special pricing for ${title} ends tonight at midnight.\n\nLock in ${price} access right now:`,
          ctaButton: `Claim Final Launch Discount`
        }
      ],
      leadMagnet: {
        title: `The 10-Minute ${title} Quick-Start Audit & Checklist`,
        format: 'Interactive PDF & Notion Checklist',
        pitchHook: `Free cheat sheet showing ${audience} how to audit and optimize their workflow in 10 minutes.`,
        checklistItems: [
          'Audit your 3 biggest daily time-wasters',
          'Organize digital assets into single-source folders',
          'Set up automated lead capture and tagging',
          'Implement standardized SOPs for client delivery',
          'Connect instant notification webhooks for every sale'
        ]
      }
    };
  };

  const handleGenerate = async () => {
    const activeProd = currentProduct?.title ? currentProduct : (products[0] || currentProduct);
    if (!activeProd?.title) {
      setErrorMsg('Please select or create a digital product first.');
      return;
    }
    
    setIsGenerating(true);
    setErrorMsg(null);
    setScheduledSuccessMsg(null);

    const kwList = keywordsInput.split(',').map(s => s.trim()).filter(Boolean);

    try {
      let data: MarketingPack | null = null;
      try {
        const response = await fetch('/api/marketing/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            product: activeProd,
            selectedKeywords: kwList,
            tone,
          }),
        });

        if (response.ok) {
          data = await response.json();
        }
      } catch {
        // Fetch attempt failed, fall through to client fallback
      }

      if (!data || !data.socialPosts) {
        data = buildLocalFallbackPack(activeProd, kwList);
      }

      setMarketingPack(data);

      // Auto-queue full campaign into calendar if enabled
      if (autoQueueSchedule) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const day1 = tomorrow.toISOString().slice(0, 10);
        
        const day2Date = new Date();
        day2Date.setDate(day2Date.getDate() + 2);
        const day2 = day2Date.toISOString().slice(0, 10);

        // Schedule X thread
        if (data.socialPosts?.twitterThread?.length) {
          onSchedulePost({
            productId: currentProduct.id,
            productTitle: currentProduct.title,
            platform: 'twitter',
            title: `${currentProduct.title} - Launch Thread`,
            content: data.socialPosts.twitterThread.join('\n\n'),
            scheduledDate: day1,
            scheduledTime: '09:30',
          });
        }

        // Schedule LinkedIn Post
        if (data.socialPosts?.linkedInPost) {
          onSchedulePost({
            productId: currentProduct.id,
            productTitle: currentProduct.title,
            platform: 'linkedin',
            title: `${currentProduct.title} - LinkedIn Case Study`,
            content: data.socialPosts.linkedInPost,
            scheduledDate: day2,
            scheduledTime: '13:00',
          });
        }

        // Schedule YouTube Community Post
        if (data.socialPosts?.youtubeCommunityPost) {
          onSchedulePost({
            productId: currentProduct.id,
            productTitle: currentProduct.title,
            platform: 'youtube',
            title: `${currentProduct.title} - YouTube Community Announcement`,
            content: data.socialPosts.youtubeCommunityPost,
            scheduledDate: day1,
            scheduledTime: '11:00',
          });
        }
      }

      // Automatically open the Direct Multi-Publish modal if enabled!
      if (autoOpenPublish) {
        setTimeout(() => {
          onOpenDirectPublishModal({
            productTitle: currentProduct.title,
            title: `${currentProduct.title} - Multi-Channel Launch Announcement`,
            content: data?.socialPosts?.twitterThread?.join('\n\n') || data?.socialPosts?.linkedInPost || 'Digital Product Launch Announcement',
            platform: 'twitter',
          });
        }, 600);
      } else {
        setScheduledSuccessMsg(`Campaign assets generated and automatically scheduled across your marketing queue!`);
      }
    } catch {
      // Safe fallback ensuring UI stays fully functional
      const fallback = buildLocalFallbackPack(activeProd, kwList);
      setMarketingPack(fallback);
    } finally {
      setIsGenerating(false);
    }
  };

  const quickSchedule = (platform: SocialPlatform, title: string, content: string) => {
    // Schedule for tomorrow at 10:00 AM
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().slice(0, 10);

    onSchedulePost({
      productId: currentProduct.id,
      productTitle: currentProduct.title,
      platform,
      title,
      content,
      scheduledDate: dateStr,
      scheduledTime: '10:00',
    });

    setScheduledSuccessMsg(`Added "${title}" to your Auto-Poster Schedule for tomorrow at 10:00 AM!`);
    setTimeout(() => setScheduledSuccessMsg(null), 4000);
  };

  const openTwitterIntent = (text: string) => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Configuration Header Card */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-violet-950/80 text-violet-300 border border-violet-800/60 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>AI Marketing & Asset Factory</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Generate High-Converting Marketing for Your Digital Products
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1">
              One click produces viral Twitter threads, LinkedIn thought-leadership posts, TikTok/Reel scripts, 3-part email drip sequences, sales copy, and free lead magnets.
            </p>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating || !currentProduct?.title}
            className={`px-5 py-3 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2 text-sm transition-all cursor-pointer self-start md:self-auto ${
              isGenerating
                ? 'bg-violet-800 cursor-not-allowed opacity-80'
                : 'bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 shadow-violet-600/30'
            }`}
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Generating Complete Pack...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 text-amber-300" />
                <span>Generate Launch Marketing Kit</span>
              </>
            )}
          </button>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-950/70 p-4 rounded-xl border border-slate-800 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Select Digital Product</label>
            <select
              value={currentProduct.id || ''}
              onChange={(e) => {
                const found = products.find(p => p.id === e.target.value);
                if (found) {
                  setCurrentProduct(found);
                  onSelectProduct(found);
                }
              }}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-violet-500"
            >
              {products.map(p => (
                <option key={p.id} value={p.id}>
                  {p.title} (${p.price} • {p.category})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Target Keywords & Queries</label>
            <input
              type="text"
              value={keywordsInput}
              onChange={(e) => setKeywordsInput(e.target.value)}
              placeholder="e.g. notion template, solo agency, cold email"
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Copywriting Voice & Tone</label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value as any)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-violet-500"
            >
              <option value="high-converting">High-Converting & Direct (Action-oriented)</option>
              <option value="thought-leader">Authority & Thought-Leader (Insightful, polished)</option>
              <option value="story-driven">Story-Driven (Relatable founder journey)</option>
              <option value="punchy">Punchy & Viral (Bold, short-form)</option>
            </select>
          </div>
        </div>

        {/* Auto-Action Controls */}
        <div className="mt-3.5 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300">
          <div className="flex flex-wrap items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={autoOpenPublish}
                onChange={(e) => setAutoOpenPublish(e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-violet-600 focus:ring-violet-500 cursor-pointer"
              />
              <span className="font-semibold text-white flex items-center gap-1.5">
                <Send className="w-3.5 h-3.5 text-violet-400" />
                <span>Auto-Launch Direct Share & Post (X, In, YT) on finish</span>
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={autoQueueSchedule}
                onChange={(e) => setAutoQueueSchedule(e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-violet-600 focus:ring-violet-500 cursor-pointer"
              />
              <span className="font-semibold text-white flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-sky-400" />
                <span>Auto-Queue full campaign into calendar</span>
              </span>
            </label>
          </div>
          <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            <span>Automated broadcast ready</span>
          </span>
        </div>

        {errorMsg && (
          <div className="mt-4 p-3 bg-rose-950/80 border border-rose-800 text-rose-300 rounded-lg text-xs">
            {errorMsg}
          </div>
        )}

        {scheduledSuccessMsg && (
          <div className="mt-4 p-3 bg-emerald-950/80 border border-emerald-800 text-emerald-300 rounded-lg text-xs flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{scheduledSuccessMsg}</span>
          </div>
        )}
      </div>

      {/* Generated Results Area */}
      {marketingPack ? (
        <div className="space-y-5">
          {/* Sub Navigation */}
          <div className="flex items-center gap-2 bg-slate-900/80 p-1.5 rounded-xl border border-slate-800 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setActiveSubView('social')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                activeSubView === 'social'
                  ? 'bg-violet-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Share2 className="w-4 h-4" />
              <span>Multi-Platform Social Posts</span>
            </button>
            <button
              onClick={() => setActiveSubView('sales')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                activeSubView === 'sales'
                  ? 'bg-violet-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>High-Converting Sales Copy</span>
            </button>
            <button
              onClick={() => setActiveSubView('email')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                activeSubView === 'email'
                  ? 'bg-violet-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Mail className="w-4 h-4" />
              <span>3-Day Drip Email Sequence</span>
            </button>
            <button
              onClick={() => setActiveSubView('leadmagnet')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                activeSubView === 'leadmagnet'
                  ? 'bg-violet-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Gift className="w-4 h-4" />
              <span>Free Lead Magnet Micro-Product</span>
            </button>
          </div>

          {/* VIEW 1: SOCIAL POSTS */}
          {activeSubView === 'social' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Twitter Thread */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 flex flex-col justify-between shadow-md">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                    <div className="flex items-center gap-2 text-sky-400 font-bold text-sm">
                      <Twitter className="w-4 h-4" />
                      <span>Twitter / X Viral Launch Thread</span>
                    </div>
                    <span className="text-[11px] text-slate-400">
                      {marketingPack.socialPosts.twitterThread.length} Tweets
                    </span>
                  </div>

                  <div className="space-y-3 mb-4 max-h-72 overflow-y-auto">
                    {marketingPack.socialPosts.twitterThread.map((tweet, i) => (
                      <div key={i} className="p-3 bg-slate-950/60 rounded-lg border border-slate-800/80 text-xs text-slate-200 relative group">
                        <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono mb-1.5">
                          <span>Tweet {i + 1}/{marketingPack.socialPosts.twitterThread.length}</span>
                          <span className={`${tweet.length > 280 ? 'text-rose-400' : 'text-slate-500'}`}>
                            {tweet.length} chars
                          </span>
                        </div>
                        <p className="whitespace-pre-line leading-relaxed">{tweet}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
                  <button
                    onClick={() => handleCopy(marketingPack.socialPosts.twitterThread.join('\n\n---\n\n'), 'thread')}
                    className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    {copiedKey === 'thread' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'thread' ? 'Copied' : 'Copy'}</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onOpenDirectPublishModal({
                        productTitle: currentProduct.title,
                        title: `${currentProduct.title} - Launch Thread`,
                        content: marketingPack.socialPosts.twitterThread.join('\n\n'),
                        platform: 'twitter',
                      })}
                      className="px-3 py-1.5 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow transition-all cursor-pointer"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Direct Publish</span>
                    </button>
                    <button
                      onClick={() => quickSchedule('twitter', `${currentProduct.title} - Launch Thread`, marketingPack.socialPosts.twitterThread.join('\n\n'))}
                      className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs border border-slate-700 cursor-pointer"
                      title="Schedule for tomorrow"
                    >
                      <Calendar className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* LinkedIn Post */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 flex flex-col justify-between shadow-md">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                    <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
                      <Linkedin className="w-4 h-4" />
                      <span>LinkedIn Thought-Leadership Post</span>
                    </div>
                    <span className="text-[11px] text-slate-400">
                      {marketingPack.socialPosts.linkedInPost.length} chars
                    </span>
                  </div>

                  <div className="p-4 bg-slate-950/60 rounded-lg border border-slate-800/80 text-xs text-slate-200 whitespace-pre-line leading-relaxed max-h-72 overflow-y-auto mb-4">
                    {marketingPack.socialPosts.linkedInPost}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
                  <button
                    onClick={() => handleCopy(marketingPack.socialPosts.linkedInPost, 'linkedin')}
                    className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    {copiedKey === 'linkedin' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'linkedin' ? 'Copied' : 'Copy'}</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onOpenDirectPublishModal({
                        productTitle: currentProduct.title,
                        title: `${currentProduct.title} - LinkedIn Post`,
                        content: marketingPack.socialPosts.linkedInPost,
                        platform: 'linkedin',
                      })}
                      className="px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow transition-all cursor-pointer"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Direct Publish</span>
                    </button>
                    <button
                      onClick={() => quickSchedule('linkedin', `${currentProduct.title} - LinkedIn Launch`, marketingPack.socialPosts.linkedInPost)}
                      className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs border border-slate-700 cursor-pointer"
                      title="Schedule for tomorrow"
                    >
                      <Calendar className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* YouTube Community Tab Post & Video Teaser */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 flex flex-col justify-between shadow-md">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                    <div className="flex items-center gap-2 text-rose-500 font-bold text-sm">
                      <Youtube className="w-4 h-4" />
                      <span>YouTube Community Post / Video Teaser</span>
                    </div>
                    <span className="text-[11px] text-rose-400 bg-rose-950/70 border border-rose-800/60 px-2 py-0.5 rounded-full font-semibold">
                      Community Tab
                    </span>
                  </div>

                  <div className="p-4 bg-slate-950/60 rounded-lg border border-slate-800/80 text-xs text-slate-200 whitespace-pre-line leading-relaxed max-h-72 overflow-y-auto mb-4">
                    {marketingPack.socialPosts.youtubeCommunityPost || 
                      `Hey everyone! 👋 Just officially published ${currentProduct.title}.\n\nIf you have been looking to solve ${currentProduct.usp}, I put together a full breakdown and walk-through.\n\nCheck out the link below and let me know your thoughts in the comments! 👇\n${currentProduct.salesPageUrl}?utm_source=youtube&utm_medium=community`
                    }
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
                  <button
                    onClick={() => handleCopy(
                      marketingPack.socialPosts.youtubeCommunityPost || `${currentProduct.title} - Launch: ${currentProduct.salesPageUrl}`,
                      'youtube'
                    )}
                    className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    {copiedKey === 'youtube' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'youtube' ? 'Copied' : 'Copy'}</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onOpenDirectPublishModal({
                        productTitle: currentProduct.title,
                        title: `${currentProduct.title} - YouTube Community Announcement`,
                        content: marketingPack.socialPosts.youtubeCommunityPost || `Check out ${currentProduct.title}: ${currentProduct.salesPageUrl}`,
                        platform: 'youtube',
                      })}
                      className="px-3 py-1.5 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow transition-all cursor-pointer"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Direct Publish</span>
                    </button>
                    <button
                      onClick={() => quickSchedule('youtube', `${currentProduct.title} - YouTube Community`, marketingPack.socialPosts.youtubeCommunityPost || 'YouTube Post')}
                      className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs border border-slate-700 cursor-pointer"
                      title="Schedule for tomorrow"
                    >
                      <Calendar className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Instagram / TikTok Script */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 flex flex-col justify-between shadow-md">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                    <div className="flex items-center gap-2 text-pink-400 font-bold text-sm">
                      <Instagram className="w-4 h-4" />
                      <span>Instagram / TikTok 30s Reel Script</span>
                    </div>
                    <span className="text-[11px] text-pink-400 bg-pink-950/70 border border-pink-800/60 px-2 py-0.5 rounded-full font-semibold">
                      Short-Form Video
                    </span>
                  </div>

                  <div className="space-y-2.5 text-xs mb-4 max-h-72 overflow-y-auto">
                    <div className="p-2.5 bg-slate-950/60 rounded-lg border border-slate-800/80">
                      <span className="text-[10px] text-pink-400 uppercase tracking-wider font-bold block mb-1">
                        🎬 Visual Hook Direction
                      </span>
                      <p className="text-slate-300 italic">{marketingPack.socialPosts.instagramScript.hookVisual}</p>
                    </div>

                    <div className="p-2.5 bg-slate-950/60 rounded-lg border border-slate-800/80">
                      <span className="text-[10px] text-amber-400 uppercase tracking-wider font-bold block mb-1">
                        🎙️ Voiceover & Dialogue
                      </span>
                      <p className="text-slate-200 whitespace-pre-line leading-relaxed">{marketingPack.socialPosts.instagramScript.voiceover}</p>
                    </div>

                    <div className="p-2.5 bg-slate-950/60 rounded-lg border border-slate-800/80">
                      <span className="text-[10px] text-sky-400 uppercase tracking-wider font-bold block mb-1">
                        ✍️ Caption & Hashtags
                      </span>
                      <p className="text-slate-300 line-clamp-2 mb-1">{marketingPack.socialPosts.instagramScript.caption}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
                  <button
                    onClick={() => handleCopy(
                      `Visual: ${marketingPack.socialPosts.instagramScript.hookVisual}\n\nVoiceover: ${marketingPack.socialPosts.instagramScript.voiceover}\n\nCaption: ${marketingPack.socialPosts.instagramScript.caption}\n\n${marketingPack.socialPosts.instagramScript.hashtags.join(' ')}`,
                      'reel'
                    )}
                    className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    {copiedKey === 'reel' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'reel' ? 'Copied' : 'Copy'}</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onOpenDirectPublishModal({
                        productTitle: currentProduct.title,
                        title: `${currentProduct.title} - Reel/TikTok Script`,
                        content: marketingPack.socialPosts.instagramScript.caption,
                        platform: 'instagram',
                      })}
                      className="px-3 py-1.5 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow transition-all cursor-pointer"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Direct Publish</span>
                    </button>
                    <button
                      onClick={() => quickSchedule('instagram', `${currentProduct.title} - Reel/TikTok Video`, marketingPack.socialPosts.instagramScript.caption)}
                      className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs border border-slate-700 cursor-pointer"
                      title="Schedule for tomorrow"
                    >
                      <Calendar className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 2: SALES PAGE COPY */}
          {activeSubView === 'sales' && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 shadow-md max-w-4xl mx-auto space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <h3 className="text-lg font-bold text-white">Sales Landing Page Framework</h3>
                  <p className="text-xs text-slate-400">Direct response headline, value stack, and objection elimination</p>
                </div>
                <button
                  onClick={() => handleCopy(
                    `# ${marketingPack.salesCopy.heroHeadline}\n${marketingPack.salesCopy.subheadline}\n\nKey Benefits:\n${marketingPack.salesCopy.valueBullets.map(b => `- ${b}`).join('\n')}\n\nObjection Buster:\n${marketingPack.salesCopy.objectionBuster}\n\nCTA: ${marketingPack.salesCopy.callToAction}`,
                    'salescopy'
                  )}
                  className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium flex items-center gap-1.5 border border-slate-700 cursor-pointer"
                >
                  {copiedKey === 'salescopy' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'salescopy' ? 'Copied All Sales Copy!' : 'Copy Full Copy'}</span>
                </button>
              </div>

              {/* Hero Section */}
              <div className="p-6 bg-gradient-to-b from-slate-950 to-slate-900 border border-slate-800 rounded-xl text-center space-y-3">
                <span className="px-2.5 py-1 bg-violet-950 text-violet-300 border border-violet-800 rounded-full text-xs font-bold uppercase tracking-wider inline-block">
                  Hero Headline
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                  {marketingPack.salesCopy.heroHeadline}
                </h1>
                <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto">
                  {marketingPack.salesCopy.subheadline}
                </p>
                <div className="pt-2">
                  <button className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-extrabold rounded-lg text-sm shadow-lg shadow-emerald-500/20">
                    {marketingPack.salesCopy.callToAction}
                  </button>
                </div>
              </div>

              {/* Value Bullets */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                  Core Benefit Bullets (Feature → Outcome)
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {marketingPack.salesCopy.valueBullets.map((bullet, i) => (
                    <div key={i} className="p-3.5 bg-slate-950/70 border border-slate-800/80 rounded-lg text-xs text-slate-200 flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{bullet}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Objection Buster */}
              <div className="p-4 bg-amber-950/20 border border-amber-900/40 rounded-xl text-xs space-y-1">
                <span className="text-amber-400 font-bold uppercase tracking-wider block text-[11px]">
                  🛡️ Risk Reversal & Objection Buster
                </span>
                <p className="text-slate-200 leading-relaxed">
                  {marketingPack.salesCopy.objectionBuster}
                </p>
              </div>
            </div>
          )}

          {/* VIEW 3: EMAIL DRIP SEQUENCE */}
          {activeSubView === 'email' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {marketingPack.emailSequence.map((email, i) => (
                  <div key={i} className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 flex flex-col justify-between shadow-md">
                    <div>
                      <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                        <span className="px-2 py-0.5 bg-violet-950 text-violet-300 border border-violet-800 rounded text-xs font-bold">
                          {email.day}
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium">
                          {email.theme}
                        </span>
                      </div>

                      <div className="space-y-2.5 mb-4 text-xs">
                        <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800/80">
                          <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Subject Line</span>
                          <span className="font-bold text-white block mt-0.5">{email.subject}</span>
                        </div>

                        <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800/80">
                          <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Preview Text</span>
                          <span className="text-slate-300 block mt-0.5 italic">{email.previewText}</span>
                        </div>

                        <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800/80 max-h-56 overflow-y-auto whitespace-pre-line text-slate-300 leading-relaxed">
                          {email.body}
                        </div>

                        <div className="text-center pt-1">
                          <span className="inline-block px-3 py-1.5 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded font-semibold text-[11px]">
                            CTA: {email.ctaButton}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                      <button
                        onClick={() => handleCopy(
                          `Subject: ${email.subject}\nPreview: ${email.previewText}\n\n${email.body}\n\nCTA: ${email.ctaButton}`,
                          `email-${i}`
                        )}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        {copiedKey === `email-${i}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedKey === `email-${i}` ? 'Copied Email' : 'Copy Email'}</span>
                      </button>

                      <button
                        onClick={() => quickSchedule('email', `${email.day}: ${email.subject}`, email.body)}
                        className="px-3 py-1.5 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Schedule</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW 4: LEAD MAGNET MICRO-PRODUCT */}
          {activeSubView === 'leadmagnet' && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 shadow-md max-w-3xl mx-auto space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-pink-950/70 border border-pink-800/60 rounded-lg text-pink-400">
                    <Gift className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Free Lead Magnet Generator</h3>
                    <p className="text-xs text-slate-400">Give this away to capture qualified email leads before pitching your paid product</p>
                  </div>
                </div>

                <button
                  onClick={() => handleCopy(
                    `# Lead Magnet: ${marketingPack.leadMagnet.title}\nFormat: ${marketingPack.leadMagnet.format}\n\nPitch Hook:\n${marketingPack.leadMagnet.pitchHook}\n\nChecklist Items:\n${marketingPack.leadMagnet.checklistItems.map(item => `[ ] ${item}`).join('\n')}`,
                    'leadmagnet'
                  )}
                  className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium flex items-center gap-1.5 border border-slate-700 cursor-pointer"
                >
                  {copiedKey === 'leadmagnet' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'leadmagnet' ? 'Copied Lead Magnet!' : 'Copy Lead Magnet'}</span>
                </button>
              </div>

              <div className="p-5 bg-gradient-to-r from-violet-950/40 via-slate-950 to-pink-950/40 border border-slate-800 rounded-xl space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-pink-950 text-pink-300 border border-pink-800 rounded text-[11px] font-bold">
                    {marketingPack.leadMagnet.format}
                  </span>
                  <span className="text-xs text-slate-400">Free Opt-In Incentive</span>
                </div>
                <h4 className="text-xl font-bold text-white">
                  {marketingPack.leadMagnet.title}
                </h4>
                <p className="text-xs text-slate-300">
                  {marketingPack.leadMagnet.pitchHook}
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                  Actionable Checklist / Swipe Items (Instant Value)
                </span>
                <div className="space-y-2">
                  {marketingPack.leadMagnet.checklistItems.map((item, i) => (
                    <div key={i} className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-lg text-xs text-slate-200 flex items-center gap-3">
                      <div className="w-5 h-5 rounded border border-violet-500/60 bg-violet-950/60 text-violet-300 flex items-center justify-center font-bold text-[10px] shrink-0">
                        {i + 1}
                      </div>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-12 text-center max-w-xl mx-auto space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-violet-600 to-pink-600 flex items-center justify-center mx-auto shadow-xl shadow-violet-600/20">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Ready to Generate Your Launch Kit</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
              Select any of your digital products above and click <strong>"Generate Launch Marketing Kit"</strong> to instantly create social threads, sales copy, 3-day email drips, and lead magnets.
            </p>
          </div>
          <button
            onClick={handleGenerate}
            className="px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs rounded-xl shadow-md transition-all cursor-pointer inline-flex items-center gap-2"
          >
            <Zap className="w-4 h-4 text-amber-300" />
            <span>Generate for {currentProduct.title || 'Selected Product'}</span>
          </button>
        </div>
      )}
    </div>
  );
};
