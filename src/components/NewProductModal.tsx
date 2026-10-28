import React, { useState } from 'react';
import { DigitalProduct, ProductCategory } from '../types';
import { X, Sparkles, Layers } from 'lucide-react';

interface NewProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProduct: (product: Omit<DigitalProduct, 'id' | 'createdAt' | 'salesCount' | 'revenue'>) => void;
}

export const NewProductModal: React.FC<NewProductModalProps> = ({
  isOpen,
  onClose,
  onAddProduct,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ProductCategory>('Notion Template');
  const [price, setPrice] = useState(49);
  const [salesPageUrl, setSalesPageUrl] = useState('https://creators.store/');
  const [usp, setUsp] = useState('');
  const [description, setDescription] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [status, setStatus] = useState<'active' | 'draft'>('active');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    onAddProduct({
      title,
      category,
      price: Number(price) || 0,
      currency: 'USD',
      salesPageUrl: salesPageUrl || 'https://creators.store',
      usp: usp || 'High-converting digital system designed for creators.',
      description: description || 'Digital product asset designed to save time and scale revenue.',
      targetAudience: targetAudience || 'Creators, freelancers, and solopreneurs',
      status,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 overscroll-contain">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto modal-scroll">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-violet-950 border border-violet-800 rounded-lg text-violet-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Add New Digital Product</h3>
              <p className="text-xs text-slate-400">Add any digital product, template, course, or service</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-500 hover:text-slate-300 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Product Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. AI Prompt OS for Ghostwriters"
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500 text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Product Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ProductCategory)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-violet-500 text-xs"
              >
                <option value="Notion Template">Notion Template / Workspace</option>
                <option value="Video Course">Video Course & Masterclass</option>
                <option value="UI/UX Kit">UI/UX Kit & Figma Tokens</option>
                <option value="Micro-SaaS">Micro-SaaS / Software Tool</option>
                <option value="Ebook & Guide">Ebook, Guide & Playbook</option>
                <option value="Design Assets / Presets">Design Assets, 3D & LUT Presets</option>
                <option value="AI Prompt Library">AI Prompt Library & GPTs</option>
                <option value="Agency Retainer">Agency Retainer & Consulting Service</option>
                <option value="Code Boilerplate">Code Boilerplate & Starter Repo</option>
                <option value="Paid Newsletter / Community">Paid Newsletter & VIP Community</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Price ($ USD)</label>
              <input
                type="number"
                min="0"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-violet-500 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Sales Page / Checkout URL</label>
            <input
              type="url"
              value={salesPageUrl}
              onChange={(e) => setSalesPageUrl(e.target.value)}
              placeholder="https://gumroad.com/... or https://lemonsqueezy.com/..."
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500 text-xs font-mono"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Unique Value Proposition (USP)</label>
            <input
              type="text"
              value={usp}
              onChange={(e) => setUsp(e.target.value)}
              placeholder="e.g. Save 10 hours a week on client proposals with 1-click templates"
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500 text-xs"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Target Audience</label>
            <input
              type="text"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              placeholder="e.g. Solo copywriters, marketing agencies with 1-5 team members"
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500 text-xs"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Full Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the modules, features, and outcomes..."
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500 text-xs"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-medium cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-lg shadow-md cursor-pointer"
            >
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
