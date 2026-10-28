import React, { useState } from 'react';
import { 
  X, 
  Settings, 
  Code2, 
  BrainCircuit, 
  Mail, 
  Send, 
  CheckCircle2, 
  Heart, 
  Sparkles, 
  Globe, 
  Zap, 
  MessageSquare,
  Shield,
  Layers
} from 'lucide-react';

interface SettingsAndAboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResetDemoData: () => void;
}

export const SettingsAndAboutModal: React.FC<SettingsAndAboutModalProps> = ({
  isOpen,
  onClose,
  onResetDemoData,
}) => {
  const [activeTab, setActiveTab] = useState<'about' | 'contact' | 'system'>('about');

  // Contact form state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSubject, setContactSubject] = useState('Feature Request');
  const [contactMessage, setContactMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactMessage) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedSuccess(true);
      setContactName('');
      setContactEmail('');
      setContactMessage('');
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 overscroll-contain">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto modal-scroll">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-gradient-to-tr from-violet-600 via-indigo-600 to-pink-600 rounded-xl text-white shadow-md">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Settings & About KreatorPulse</h3>
              <p className="text-xs text-slate-400">Project details, developer team credits, and direct support</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-500 hover:text-slate-300 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub Navigation */}
        <div className="flex items-center gap-2 bg-slate-950/60 p-1 rounded-xl border border-slate-800 text-xs mb-5">
          <button
            onClick={() => setActiveTab('about')}
            className={`px-4 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'about' ? 'bg-violet-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>About Us & Team</span>
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`px-4 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'contact' ? 'bg-violet-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Contact Dev</span>
          </button>
          <button
            onClick={() => setActiveTab('system')}
            className={`px-4 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'system' ? 'bg-violet-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>System & Storage</span>
          </button>
        </div>

        {/* TAB 1: ABOUT US & TEAM */}
        {activeTab === 'about' && (
          <div className="space-y-5 text-xs text-slate-300">
            {/* App Description */}
            <div className="p-5 bg-gradient-to-r from-violet-950/40 via-slate-950 to-indigo-950/40 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-violet-400 font-bold text-sm">
                <Zap className="w-4 h-4 text-amber-300" />
                <span>About KreatorPulse Engine</span>
              </div>
              <p className="leading-relaxed text-slate-200">
                KreatorPulse is an all-in-one CRM and marketing automation engine crafted specifically for solo creators, digital builders, and boutique agencies. It transforms raw product ideas, Notion templates, and workspace documentation into high-converting sales copy, viral social threads, and automated campaigns — publishing directly to <strong>X (Twitter), LinkedIn, and YouTube</strong>.
              </p>
              <div className="flex flex-wrap gap-2 pt-1 text-[11px]">
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-mono">v2.4.0 Production</span>
                <span className="px-2 py-0.5 rounded bg-violet-950 text-violet-300 border border-violet-800 font-mono">React 19 + TypeScript</span>
                <span className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800 font-mono">Gemini 3.8 Flash Engine</span>
              </div>
            </div>

            {/* Core Team Credits */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-pink-400" />
                <span>Engineering & Strategic Architects</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* MJ - Logic */}
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex items-start gap-3 hover:border-violet-500/50 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-white font-black text-sm shrink-0 shadow-md shadow-purple-500/20">
                    MJ
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-white text-sm">MJ</span>
                      <span className="px-1.5 py-0.2 bg-purple-950 text-purple-300 border border-purple-800/80 rounded text-[10px] font-semibold">
                        System Logic
                      </span>
                    </div>
                    <span className="text-[11px] text-violet-400 font-medium block mt-0.5 flex items-center gap-1">
                      <BrainCircuit className="w-3 h-3" />
                      <span>Logic & Strategy Architect</span>
                    </span>
                    <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                      Designed the marketing copy algorithms, Notion extraction workflows, high-intent keyword scoring models, and conversion frameworks.
                    </p>
                  </div>
                </div>

                {/* Adrian - Developer */}
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex items-start gap-3 hover:border-indigo-500/50 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white font-black text-sm shrink-0 shadow-md shadow-indigo-500/20">
                    AD
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-white text-sm">Adrian</span>
                      <span className="px-1.5 py-0.2 bg-indigo-950 text-indigo-300 border border-indigo-800/80 rounded text-[10px] font-semibold">
                        Lead Developer
                      </span>
                    </div>
                    <span className="text-[11px] text-sky-400 font-medium block mt-0.5 flex items-center gap-1">
                      <Code2 className="w-3 h-3" />
                      <span>Fullstack & Integration Engineer</span>
                    </span>
                    <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                      Engineered the fullstack application, social channel publishing bridges (X, LinkedIn, YouTube), webhook dispatcher, and live design canvas.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Mission Statement */}
            <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl text-[11px] text-slate-400">
              <strong className="text-slate-300">Our Mission:</strong> Empower solo operators and small creative teams to achieve the reach and output of a 10-person marketing department without manual grunt work.
            </div>
          </div>
        )}

        {/* TAB 2: CONTACT DEVELOPER */}
        {activeTab === 'contact' && (
          <div className="space-y-4 text-xs">
            {submittedSuccess ? (
              <div className="p-6 bg-emerald-950/60 border border-emerald-800 rounded-xl text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h4 className="text-base font-bold text-white">Message Dispatched to Adrian & MJ!</h4>
                <p className="text-xs text-slate-300 max-w-md mx-auto">
                  Thank you for reaching out. The team reviews all feature suggestions, bug reports, and feedback to continually improve KreatorPulse.
                </p>
                <button
                  onClick={() => setSubmittedSuccess(false)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold text-xs transition-all cursor-pointer"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSendMessage} className="space-y-3 bg-slate-950 p-5 rounded-xl border border-slate-800">
                <div className="flex items-center gap-2 text-white font-bold text-sm mb-1">
                  <MessageSquare className="w-4 h-4 text-violet-400" />
                  <span>Send a Message to the Developer & Logic Team</span>
                </div>
                <p className="text-[11px] text-slate-400 mb-3">
                  Have a feature request, custom integration question, or feedback? Send a note directly to Adrian & MJ.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="e.g. Jordan Lee"
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Your Email (Optional)</label>
                    <input
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="jordan@domain.com"
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Topic / Category</label>
                  <select
                    value={contactSubject}
                    onChange={(e) => setContactSubject(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-violet-500"
                  >
                    <option value="Feature Request">💡 Feature Request</option>
                    <option value="Custom Integration">🔗 Custom Integration (Notion / Webhook / API)</option>
                    <option value="Bug Report">🐛 Bug Report</option>
                    <option value="General Feedback">💬 General Feedback & Praise</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Message *</label>
                  <textarea
                    required
                    rows={4}
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder="Describe what you would like to see improved or built..."
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500 leading-relaxed"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2 text-[11px] text-slate-500">
                    <Shield className="w-3.5 h-3.5 text-violet-400" />
                    <span>Direct priority dispatch to developers</span>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-lg shadow-md flex items-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmitting ? 'Sending...' : 'Send to Adrian & MJ'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* TAB 3: SYSTEM & STORAGE */}
        {activeTab === 'system' && (
          <div className="space-y-4 text-xs text-slate-300">
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
              <h4 className="font-bold text-white text-sm">Local Storage & Cache Management</h4>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                Your products, leads, tracked keywords, and scheduled campaigns are saved locally in your browser's persistent storage so you never lose your workspace data.
              </p>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-200 block">Reset Demo Workspace</span>
                  <span className="text-[10px] text-slate-500">Restore default creator products, leads, and initial queue</span>
                </div>
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to reset demo data to factory defaults?')) {
                      onResetDemoData();
                      onClose();
                    }
                  }}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-rose-950 hover:text-rose-300 border border-slate-700 hover:border-rose-800 rounded-lg text-slate-300 font-medium transition-all cursor-pointer"
                >
                  Reset Demo Data
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
          <span>KreatorPulse Studio • Logic by MJ, Dev by Adrian</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-semibold cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
