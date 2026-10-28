import React, { useState, useRef } from 'react';
import { DigitalProduct, MockupDesignConfig } from '../types';
import { 
  Palette, 
  Sparkles, 
  Download, 
  Copy, 
  Check, 
  Star, 
  CheckCircle, 
  Layers, 
  Monitor, 
  Smartphone, 
  Share2,
  Calendar,
  Zap,
  Sliders,
  DollarSign,
  Image as ImageIcon
} from 'lucide-react';

interface VisualMockupDesignerTabProps {
  products: DigitalProduct[];
  selectedProduct: DigitalProduct | null;
  onSelectProduct: (product: DigitalProduct) => void;
  onScheduleWithMockup: (title: string, bannerDesc: string) => void;
}

export const VisualMockupDesignerTab: React.FC<VisualMockupDesignerTabProps> = ({
  products,
  selectedProduct,
  onSelectProduct,
  onScheduleWithMockup,
}) => {
  const currentProd = selectedProduct || products[0];

  const [theme, setTheme] = useState<MockupDesignConfig['theme']>('cyber-dark');
  const [badgeText, setBadgeText] = useState('NEW RELEASE • 50% LAUNCH DISCOUNT');
  const [headline, setHeadline] = useState(currentProd?.title || 'Digital Product Masterclass');
  const [subheadline, setSubheadline] = useState(currentProd?.usp || 'The battle-tested system to scale your revenue without burnout.');
  const [price, setPrice] = useState(`$${currentProd?.price || 49}`);
  const [originalPrice, setOriginalPrice] = useState(`$${(currentProd?.price || 49) * 2}`);
  const [formatLabel, setFormatLabel] = useState((currentProd?.category || 'DIGITAL TEMPLATE').toUpperCase());
  const [rating, setRating] = useState(4.9);
  const [reviewsCount, setReviewsCount] = useState(148);
  const [bullet1, setBullet1] = useState('Complete Step-by-Step Architecture & Templates');
  const [bullet2, setBullet2] = useState('Lifetime Updates & Free Access to Future Modules');
  const [bullet3, setBullet3] = useState('Plug-and-Play Setup in Under 10 Minutes');
  const [ctaText, setCtaText] = useState('Get Instant Access Now');
  const [authorHandle, setAuthorHandle] = useState('@solocreator');
  const [previewFormat, setPreviewFormat] = useState<'social' | 'store' | 'story'>('social');
  const [copiedCode, setCopiedCode] = useState(false);
  const [isExportingPng, setIsExportingPng] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  // When switching products, update values
  const handleProductChange = (prodId: string) => {
    const p = products.find(prod => prod.id === prodId);
    if (p) {
      onSelectProduct(p);
      setHeadline(p.title);
      setSubheadline(p.usp);
      setPrice(`$${p.price}`);
      setOriginalPrice(`$${p.price * 2}`);
      setFormatLabel(p.category.toUpperCase());
    }
  };

  const getThemeStyles = () => {
    switch (theme) {
      case 'sunset-glow':
        return {
          wrapper: 'bg-gradient-to-br from-amber-600 via-rose-600 to-purple-900 text-white',
          badge: 'bg-amber-400 text-slate-950 font-black',
          cardBg: 'bg-black/35 backdrop-blur-xl border-white/20',
          accent: 'text-amber-300',
          btn: 'bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 hover:opacity-95',
          glow: 'from-orange-500/30 to-pink-500/30',
          canvasBg1: '#d97706',
          canvasBg2: '#4c1d95',
          accentColor: '#fde047',
        };
      case 'emerald-luxury':
        return {
          wrapper: 'bg-gradient-to-br from-slate-950 via-emerald-950 to-teal-900 text-white',
          badge: 'bg-emerald-400 text-slate-950 font-black',
          cardBg: 'bg-slate-900/60 backdrop-blur-xl border-emerald-500/30',
          accent: 'text-emerald-300',
          btn: 'bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-950 hover:opacity-95',
          glow: 'from-emerald-500/20 to-teal-500/20',
          canvasBg1: '#022c22',
          canvasBg2: '#134e4a',
          accentColor: '#34d399',
        };
      case 'electric-violet':
        return {
          wrapper: 'bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900 text-white',
          badge: 'bg-pink-400 text-slate-950 font-black',
          cardBg: 'bg-purple-950/40 backdrop-blur-xl border-purple-400/30',
          accent: 'text-pink-300',
          btn: 'bg-gradient-to-r from-pink-500 to-violet-600 text-white hover:opacity-95',
          glow: 'from-pink-500/30 to-purple-600/30',
          canvasBg1: '#3b0764',
          canvasBg2: '#831843',
          accentColor: '#f472b6',
        };
      case 'clean-white':
        return {
          wrapper: 'bg-gradient-to-br from-slate-100 via-white to-slate-200 text-slate-900',
          badge: 'bg-slate-900 text-white font-black',
          cardBg: 'bg-white/90 backdrop-blur-md border-slate-300 shadow-xl',
          accent: 'text-violet-600',
          btn: 'bg-slate-900 text-white hover:bg-slate-800',
          glow: 'from-violet-500/10 to-indigo-500/10',
          canvasBg1: '#f8fafc',
          canvasBg2: '#e2e8f0',
          accentColor: '#7c3aed',
        };
      case 'cyber-dark':
      default:
        return {
          wrapper: 'bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white',
          badge: 'bg-gradient-to-r from-violet-500 to-pink-500 text-white font-black',
          cardBg: 'bg-slate-900/70 backdrop-blur-xl border-slate-700/60',
          accent: 'text-violet-400',
          btn: 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:opacity-95',
          glow: 'from-violet-600/25 to-pink-600/25',
          canvasBg1: '#090d16',
          canvasBg2: '#1e1b4b',
          accentColor: '#a78bfa',
        };
    }
  };

  const currentTheme = getThemeStyles();

  // Real PNG Export using Canvas
  const handleExportPng = () => {
    setIsExportingPng(true);

    try {
      let width = 1200;
      let height = 675; // 16:9

      if (previewFormat === 'store') {
        width = 1200;
        height = 900; // 4:3
      } else if (previewFormat === 'story') {
        width = 1080;
        height = 1920; // 9:16
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Draw Background Gradient
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, currentTheme.canvasBg1);
      grad.addColorStop(1, currentTheme.canvasBg2);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Subtle grid or card outline
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 2;
      ctx.strokeRect(40, 40, width - 80, height - 80);

      const isLight = theme === 'clean-white';
      const textColor = isLight ? '#0f172a' : '#ffffff';
      const mutedColor = isLight ? '#475569' : '#94a3b8';

      if (previewFormat === 'social') {
        // Badge
        ctx.fillStyle = isLight ? '#0f172a' : currentTheme.accentColor;
        ctx.beginPath();
        ctx.roundRect(80, 80, 360, 40, 8);
        ctx.fill();

        ctx.fillStyle = isLight ? '#ffffff' : '#0f172a';
        ctx.font = 'bold 16px "Plus Jakarta Sans", sans-serif';
        ctx.fillText(badgeText.slice(0, 32).toUpperCase(), 95, 106);

        // Format label
        ctx.fillStyle = mutedColor;
        ctx.font = '600 18px monospace';
        ctx.textAlign = 'right';
        ctx.fillText(formatLabel, width - 80, 106);
        ctx.textAlign = 'left';

        // Headline
        ctx.fillStyle = textColor;
        ctx.font = 'bold 44px "Plus Jakarta Sans", sans-serif';
        ctx.fillText(headline.slice(0, 42), 80, 200);

        // Subheadline
        ctx.fillStyle = mutedColor;
        ctx.font = '22px "Plus Jakarta Sans", sans-serif';
        ctx.fillText(subheadline.slice(0, 75), 80, 250);

        // Bullets
        ctx.fillStyle = currentTheme.accentColor;
        ctx.font = 'bold 22px monospace';
        ctx.fillText('✓', 80, 330);
        ctx.fillText('✓', 80, 380);
        ctx.fillText('✓', 80, 430);

        ctx.fillStyle = textColor;
        ctx.font = '20px "Plus Jakarta Sans", sans-serif';
        ctx.fillText(bullet1.slice(0, 60), 115, 330);
        ctx.fillText(bullet2.slice(0, 60), 115, 380);
        ctx.fillText(bullet3.slice(0, 60), 115, 430);

        // Divider
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.beginPath();
        ctx.moveTo(80, 490);
        ctx.lineTo(width - 80, 490);
        ctx.stroke();

        // Price & Original
        ctx.fillStyle = '#34d399';
        ctx.font = 'bold 50px "Plus Jakarta Sans", monospace';
        ctx.fillText(price, 80, 560);

        if (originalPrice) {
          ctx.fillStyle = mutedColor;
          ctx.font = '26px monospace';
          ctx.fillText(originalPrice, 230, 560);
        }

        // Author & CTA
        ctx.fillStyle = mutedColor;
        ctx.font = '20px monospace';
        ctx.textAlign = 'right';
        ctx.fillText(authorHandle, width - 360, 555);

        // CTA Button
        ctx.fillStyle = isLight ? '#0f172a' : '#7c3aed';
        ctx.beginPath();
        ctx.roundRect(width - 320, 515, 240, 56, 12);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 18px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(ctaText.slice(0, 20), width - 200, 550);
      } else {
        // Generic Storefront / Story layout
        ctx.fillStyle = isLight ? '#0f172a' : currentTheme.accentColor;
        ctx.font = 'bold 20px "Plus Jakarta Sans", sans-serif';
        ctx.fillText(badgeText.toUpperCase(), 80, 100);

        ctx.fillStyle = textColor;
        ctx.font = 'bold 40px "Plus Jakarta Sans", sans-serif';
        ctx.fillText(headline.slice(0, 36), 80, 170);

        ctx.fillStyle = mutedColor;
        ctx.font = '22px "Plus Jakarta Sans", sans-serif';
        ctx.fillText(subheadline.slice(0, 65), 80, 220);

        ctx.fillStyle = '#34d399';
        ctx.font = 'bold 55px monospace';
        ctx.fillText(`${price} USD`, 80, 320);

        ctx.fillStyle = textColor;
        ctx.font = '24px "Plus Jakarta Sans", sans-serif';
        ctx.fillText(`• ${bullet1.slice(0, 50)}`, 80, 400);
        ctx.fillText(`• ${bullet2.slice(0, 50)}`, 80, 450);
        ctx.fillText(`• ${bullet3.slice(0, 50)}`, 80, 500);

        ctx.fillStyle = mutedColor;
        ctx.font = '22px monospace';
        ctx.fillText(`By ${authorHandle}`, 80, 570);
      }

      // Convert to blob and trigger download
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const cleanName = (headline || 'promo_banner').toLowerCase().replace(/[^a-z0-9]/g, '_');
        a.download = `kreatorpulse_${cleanName}_${previewFormat}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        setExportSuccess(true);
        setTimeout(() => setExportSuccess(false), 3000);
      }, 'image/png');
    } catch (e) {
      console.error('PNG export error', e);
    } finally {
      setIsExportingPng(false);
    }
  };

  const handleCopyDesignCode = () => {
    const snippet = `<!-- KreatorPulse Promo Card -->
<div class="kreatorpulse-mockup-banner ${theme}">
  <span class="badge">${badgeText}</span>
  <h2>${headline}</h2>
  <p>${subheadline}</p>
  <div class="price">${price} (was ${originalPrice})</div>
  <p class="format">${formatLabel}</p>
  <ul>
    <li>${bullet1}</li>
    <li>${bullet2}</li>
    <li>${bullet3}</li>
  </ul>
  <a href="${currentProd?.salesPageUrl || '#'}" class="cta-button">${ctaText}</a>
  <span class="author">${authorHandle}</span>
</div>`;

    navigator.clipboard.writeText(snippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2200);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-violet-950/80 text-violet-300 border border-violet-800/60 mb-2">
            <Palette className="w-3.5 h-3.5 text-pink-400" />
            <span>Digital Product Mockup & Banner Studio</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Design High-Converting Marketing Cards & Social Assets
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1">
            Customize promo badges, discount pricing, feature bullets, and ratings. Download production-ready PNG banners or attach directly to your social queue.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          <button
            onClick={handleExportPng}
            disabled={isExportingPng}
            className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            title="Download high-resolution PNG banner"
          >
            {exportSuccess ? <Check className="w-4 h-4 text-white" /> : <Download className="w-4 h-4" />}
            <span>{exportSuccess ? 'Downloaded PNG!' : 'Download PNG Banner'}</span>
          </button>

          <button
            onClick={() => onScheduleWithMockup(
              `${headline} - Promo Banner Launch`,
              `Custom ${theme} mockup banner featuring "${badgeText}" and price ${price}`
            )}
            className="px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
          >
            <Calendar className="w-4 h-4" />
            <span>Schedule with Banner</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4 text-xs">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800 font-bold text-white text-sm">
              <Sliders className="w-4 h-4 text-violet-400" />
              <span>Asset Customization</span>
            </div>

            {/* Select Product */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Base Product</label>
              <select
                value={currentProd?.id || ''}
                onChange={(e) => handleProductChange(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-violet-500 cursor-pointer"
              >
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.title} (${p.price})</option>
                ))}
              </select>
            </div>

            {/* Theme Presets */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Color Palette Theme</label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'cyber-dark', label: 'Cyber Dark', bg: 'bg-slate-950 border-violet-500' },
                  { id: 'sunset-glow', label: 'Sunset Glow', bg: 'bg-gradient-to-r from-amber-500 to-rose-600' },
                  { id: 'emerald-luxury', label: 'Emerald Pro', bg: 'bg-emerald-950 border-emerald-400' },
                  { id: 'electric-violet', label: 'Electric Violet', bg: 'bg-purple-950 border-pink-500' },
                  { id: 'clean-white', label: 'Editorial White', bg: 'bg-white text-slate-900' },
                ].map((th) => (
                  <button
                    key={th.id}
                    onClick={() => setTheme(th.id as any)}
                    className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold border transition-all cursor-pointer ${
                      theme === th.id
                        ? 'ring-2 ring-violet-500 border-white text-white'
                        : 'border-slate-700 text-slate-400 hover:text-white'
                    } ${th.bg}`}
                  >
                    {th.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Badge & Format Tag */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Urgency Badge</label>
                <input
                  type="text"
                  value={badgeText}
                  onChange={(e) => setBadgeText(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-violet-500"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Format Category</label>
                <input
                  type="text"
                  value={formatLabel}
                  onChange={(e) => setFormatLabel(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-violet-500"
                />
              </div>
            </div>

            {/* Headline & Subheadline */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Product Headline</label>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Hook / Subheadline</label>
              <textarea
                rows={2}
                value={subheadline}
                onChange={(e) => setSubheadline(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-violet-500"
              />
            </div>

            {/* Price & Original Price */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Offer Price</label>
                <input
                  type="text"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-violet-500 font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Original Price (Strike)</label>
                <input
                  type="text"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-violet-500 font-mono"
                />
              </div>
            </div>

            {/* Feature Bullets */}
            <div className="space-y-2">
              <label className="block text-slate-300 font-semibold">3 Key Deliverable Bullets</label>
              <input
                type="text"
                value={bullet1}
                onChange={(e) => setBullet1(e.target.value)}
                placeholder="Bullet 1"
                className="w-full px-3 py-1 bg-slate-800 border border-slate-700 rounded-md text-slate-200 focus:outline-none focus:border-violet-500"
              />
              <input
                type="text"
                value={bullet2}
                onChange={(e) => setBullet2(e.target.value)}
                placeholder="Bullet 2"
                className="w-full px-3 py-1 bg-slate-800 border border-slate-700 rounded-md text-slate-200 focus:outline-none focus:border-violet-500"
              />
              <input
                type="text"
                value={bullet3}
                onChange={(e) => setBullet3(e.target.value)}
                placeholder="Bullet 3"
                className="w-full px-3 py-1 bg-slate-800 border border-slate-700 rounded-md text-slate-200 focus:outline-none focus:border-violet-500"
              />
            </div>

            {/* Author Handle & CTA */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Button Text</label>
                <input
                  type="text"
                  value={ctaText}
                  onChange={(e) => setCtaText(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-violet-500"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Handle / Brand</label>
                <input
                  type="text"
                  value={authorHandle}
                  onChange={(e) => setAuthorHandle(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-violet-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Live Visual Canvas (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Format Switcher */}
          <div className="flex items-center justify-between bg-slate-900/60 p-2 rounded-xl border border-slate-800">
            <span className="text-xs font-semibold text-slate-400 pl-2">Live Canvas Preview</span>
            <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-lg border border-slate-700 text-xs">
              <button
                onClick={() => setPreviewFormat('social')}
                className={`px-3 py-1 rounded-md font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                  previewFormat === 'social' ? 'bg-violet-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Social Banner (16:9)</span>
              </button>
              <button
                onClick={() => setPreviewFormat('store')}
                className={`px-3 py-1 rounded-md font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                  previewFormat === 'store' ? 'bg-violet-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Storefront Card (4:3)</span>
              </button>
              <button
                onClick={() => setPreviewFormat('story')}
                className={`px-3 py-1 rounded-md font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                  previewFormat === 'story' ? 'bg-violet-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Story / Ad (9:16)</span>
              </button>
            </div>
          </div>

          {/* VISUAL MOCKUP CANVAS */}
          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 flex items-center justify-center min-h-[460px] overflow-hidden relative">
            {/* Background Glow */}
            <div className={`absolute -inset-4 bg-gradient-to-r ${currentTheme.glow} blur-xl opacity-40 pointer-events-none transform-gpu`} />

            {/* FORMAT 1: SOCIAL BANNER (16:9) */}
            {previewFormat === 'social' && (
              <div className={`w-full max-w-xl rounded-2xl p-7 shadow-2xl border transition-all relative overflow-hidden ${currentTheme.wrapper}`}>
                <div className="relative z-10 flex flex-col justify-between h-full min-h-[290px]">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className={`px-2.5 py-1 rounded-md text-[11px] tracking-wider uppercase shadow-sm ${currentTheme.badge}`}>
                        {badgeText}
                      </span>
                      <span className="text-[11px] font-mono tracking-widest opacity-75 uppercase">
                        {formatLabel}
                      </span>
                    </div>

                    <h3 className="text-2xl font-black tracking-tight leading-snug mb-2">
                      {headline}
                    </h3>
                    <p className="text-xs opacity-90 line-clamp-2 max-w-md mb-4">
                      {subheadline}
                    </p>

                    <div className="space-y-1.5 mb-5 text-xs">
                      <div className="flex items-center gap-2">
                        <CheckCircle className={`w-3.5 h-3.5 shrink-0 ${currentTheme.accent}`} />
                        <span className="opacity-95">{bullet1}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className={`w-3.5 h-3.5 shrink-0 ${currentTheme.accent}`} />
                        <span className="opacity-95">{bullet2}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className={`w-3.5 h-3.5 shrink-0 ${currentTheme.accent}`} />
                        <span className="opacity-95">{bullet3}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/15 flex items-center justify-between">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black font-mono tabular-nums">{price}</span>
                      {originalPrice && (
                        <span className="text-xs line-through opacity-60 font-medium font-mono tabular-nums">{originalPrice}</span>
                      )}
                      <div className="flex items-center gap-1 text-amber-300 text-xs ml-2 font-mono tabular-nums">
                        <Star className="w-3.5 h-3.5 fill-amber-300" />
                        <span className="font-bold">{rating}</span>
                        <span className="opacity-60 text-[10px]">({reviewsCount})</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs opacity-75 font-mono">{authorHandle}</span>
                      <span className={`px-4 py-2 rounded-lg text-xs font-bold shadow-md ${currentTheme.btn}`}>
                        {ctaText}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* FORMAT 2: STOREFRONT CARD (4:3) */}
            {previewFormat === 'store' && (
              <div className={`w-full max-w-sm rounded-2xl p-6 shadow-2xl border transition-all relative overflow-hidden ${currentTheme.wrapper}`}>
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${currentTheme.badge}`}>
                    {badgeText}
                  </span>
                  <span className="text-[10px] font-mono opacity-75">{authorHandle}</span>
                </div>

                <div className="p-4 rounded-xl mb-4 bg-black/20 border border-white/10 text-center">
                  <span className="text-[10px] tracking-widest uppercase opacity-75 block mb-1 font-mono">{formatLabel}</span>
                  <h3 className="text-lg font-black leading-tight mb-2">{headline}</h3>
                  <div className="flex items-center justify-center gap-2 text-xl font-black font-mono tabular-nums">
                    <span>{price}</span>
                    <span className="text-xs line-through opacity-60 font-normal">{originalPrice}</span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs mb-5">
                  <div className="flex items-center gap-2">
                    <CheckCircle className={`w-3.5 h-3.5 shrink-0 ${currentTheme.accent}`} />
                    <span className="text-[11px] opacity-90 truncate">{bullet1}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className={`w-3.5 h-3.5 shrink-0 ${currentTheme.accent}`} />
                    <span className="text-[11px] opacity-90 truncate">{bullet2}</span>
                  </div>
                </div>

                <button className={`w-full py-2.5 rounded-lg text-xs font-bold text-center block ${currentTheme.btn}`}>
                  {ctaText}
                </button>
              </div>
            )}

            {/* FORMAT 3: STORY / REEL AD (9:16) */}
            {previewFormat === 'story' && (
              <div className={`w-64 rounded-3xl p-5 shadow-2xl border transition-all relative overflow-hidden flex flex-col justify-between min-h-[420px] ${currentTheme.wrapper}`}>
                <div>
                  <div className="text-center pt-2 mb-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] uppercase font-black inline-block mb-2 ${currentTheme.badge}`}>
                      {badgeText}
                    </span>
                    <h3 className="text-base font-black leading-tight mb-1">{headline}</h3>
                    <p className="text-[11px] opacity-80 line-clamp-2">{subheadline}</p>
                  </div>

                  <div className="bg-black/25 rounded-xl p-3 border border-white/10 mb-4 space-y-2 text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle className={`w-3.5 h-3.5 shrink-0 ${currentTheme.accent}`} />
                      <span className="truncate">{bullet1}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle className={`w-3.5 h-3.5 shrink-0 ${currentTheme.accent}`} />
                      <span className="truncate">{bullet2}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle className={`w-3.5 h-3.5 shrink-0 ${currentTheme.accent}`} />
                      <span className="truncate">{bullet3}</span>
                    </div>
                  </div>
                </div>

                <div className="text-center pb-2">
                  <div className="text-2xl font-black mb-1 font-mono tabular-nums">{price}</div>
                  <button className={`w-full py-2 rounded-xl text-xs font-bold ${currentTheme.btn}`}>
                    Swipe Up / Tap Link
                  </button>
                  <span className="text-[10px] opacity-60 block mt-2 font-mono">{authorHandle}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
