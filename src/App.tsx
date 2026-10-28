import React, { useState, useEffect } from 'react';
import { 
  DigitalProduct, 
  Lead, 
  KeywordItem, 
  ScheduledPost, 
  SocialPlatform,
  SocialAccountConnection 
} from './types';
import { 
  initialProducts, 
  initialLeads, 
  initialTrackedKeywords, 
  initialScheduledPosts,
  initialSocialAccounts 
} from './data/mockData';
import { Header } from './components/Header';
import { ProductsAndCrmTab } from './components/ProductsAndCrmTab';
import { KeywordRadarTab } from './components/KeywordRadarTab';
import { AiMarketingGeneratorTab } from './components/AiMarketingGeneratorTab';
import { VisualMockupDesignerTab } from './components/VisualMockupDesignerTab';
import { SchedulerAndWebhooksTab } from './components/SchedulerAndWebhooksTab';
import { NewProductModal } from './components/NewProductModal';
import { UtmBuilderModal } from './components/UtmBuilderModal';
import { ConnectedAccountsModal } from './components/ConnectedAccountsModal';
import { DirectPublishModal } from './components/DirectPublishModal';
import { WorkspaceImporterModal } from './components/WorkspaceImporterModal';
import { SettingsAndAboutModal } from './components/SettingsAndAboutModal';

export default function App() {
  // Load state from localStorage or initial mock data
  const [products, setProducts] = useState<DigitalProduct[]>(() => {
    try {
      const saved = localStorage.getItem('kreatorpulse_products');
      return saved ? JSON.parse(saved) : initialProducts;
    } catch {
      return initialProducts;
    }
  });

  const [leads, setLeads] = useState<Lead[]>(() => {
    try {
      const saved = localStorage.getItem('kreatorpulse_leads');
      return saved ? JSON.parse(saved) : initialLeads;
    } catch {
      return initialLeads;
    }
  });

  const [trackedKeywords, setTrackedKeywords] = useState<KeywordItem[]>(() => {
    try {
      const saved = localStorage.getItem('kreatorpulse_keywords');
      return saved ? JSON.parse(saved) : initialTrackedKeywords;
    } catch {
      return initialTrackedKeywords;
    }
  });

  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>(() => {
    try {
      const saved = localStorage.getItem('kreatorpulse_scheduled_posts');
      if (saved) {
        const parsed: ScheduledPost[] = JSON.parse(saved);
        return parsed.map(post => {
          if (post.webhookUrl?.includes('hook.make.com')) {
            return {
              ...post,
              webhookUrl: post.webhookUrl.replace('hook.make.com', 'hook.eu1.make.com'),
            };
          }
          return post;
        });
      }
      return initialScheduledPosts;
    } catch {
      return initialScheduledPosts;
    }
  });

  const [socialAccounts, setSocialAccounts] = useState<SocialAccountConnection[]>(() => {
    try {
      const saved = localStorage.getItem('kreatorpulse_social_accounts');
      if (saved) {
        const parsed: SocialAccountConnection[] = JSON.parse(saved);
        return parsed.map(acc => {
          if (acc.webhookUrl?.includes('hook.make.com') || acc.handleOrChannel?.includes('hook.make.com')) {
            return {
              ...acc,
              webhookUrl: acc.webhookUrl?.replace('hook.make.com', 'hook.eu1.make.com'),
              handleOrChannel: acc.handleOrChannel?.replace('hook.make.com', 'hook.eu1.make.com') || acc.handleOrChannel,
            };
          }
          return acc;
        });
      }
      return initialSocialAccounts;
    } catch {
      return initialSocialAccounts;
    }
  });

  // UI state
  const [activeTab, setActiveTab] = useState<string>('products');
  const [selectedProduct, setSelectedProduct] = useState<DigitalProduct | null>(products[0] || null);
  const [preselectedKeywords, setPreselectedKeywords] = useState<string[]>([]);
  const [isNewProductModalOpen, setIsNewProductModalOpen] = useState(false);
  const [isUtmBuilderModalOpen, setIsUtmBuilderModalOpen] = useState(false);
  const [isAccountsHubOpen, setIsAccountsHubOpen] = useState(false);
  const [isWorkspaceImporterOpen, setIsWorkspaceImporterOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [directPublishModalPost, setDirectPublishModalPost] = useState<{
    id?: string;
    productTitle: string;
    title: string;
    content: string;
    platform?: SocialPlatform;
  } | null>(null);

  const handleResetDemoData = () => {
    try {
      localStorage.removeItem('kreatorpulse_products');
      localStorage.removeItem('kreatorpulse_leads');
      localStorage.removeItem('kreatorpulse_keywords');
      localStorage.removeItem('kreatorpulse_scheduled_posts');
      localStorage.removeItem('kreatorpulse_social_accounts');
    } catch (e) {
      console.warn('Storage clear error', e);
    }
    setProducts(initialProducts);
    setLeads(initialLeads);
    setTrackedKeywords(initialTrackedKeywords);
    setScheduledPosts(initialScheduledPosts);
    setSocialAccounts(initialSocialAccounts);
    setSelectedProduct(initialProducts[0] || null);
  };

  const handleProductImportedFromWorkspace = (
    newProdData: Omit<DigitalProduct, 'id' | 'createdAt' | 'salesCount' | 'revenue'>,
    marketingCopy?: any
  ) => {
    const newProduct: DigitalProduct = {
      ...newProdData,
      id: `prod-${Date.now()}`,
      salesCount: 0,
      revenue: 0,
      createdAt: new Date().toISOString().slice(0, 10),
    };

    setProducts([newProduct, ...products]);
    setSelectedProduct(newProduct);

    // If marketing copy was generated during workspace extraction, queue it
    if (marketingCopy) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dateStr = tomorrow.toISOString().slice(0, 10);

      const queued: ScheduledPost[] = [];

      if (marketingCopy.twitterThread?.length) {
        queued.push({
          id: `post-${Date.now()}-1`,
          productId: newProduct.id,
          productTitle: newProduct.title,
          platform: 'twitter',
          title: `${newProduct.title} - Launch Thread`,
          content: marketingCopy.twitterThread.join('\n\n'),
          scheduledDate: dateStr,
          scheduledTime: '09:00',
          status: 'scheduled',
        });
      }

      if (marketingCopy.linkedInPost) {
        queued.push({
          id: `post-${Date.now()}-2`,
          productId: newProduct.id,
          productTitle: newProduct.title,
          platform: 'linkedin',
          title: `${newProduct.title} - LinkedIn Launch`,
          content: marketingCopy.linkedInPost,
          scheduledDate: dateStr,
          scheduledTime: '13:00',
          status: 'scheduled',
        });
      }

      if (marketingCopy.youtubeCommunityPost) {
        queued.push({
          id: `post-${Date.now()}-3`,
          productId: newProduct.id,
          productTitle: newProduct.title,
          platform: 'youtube',
          title: `${newProduct.title} - YouTube Community Announcement`,
          content: marketingCopy.youtubeCommunityPost,
          scheduledDate: dateStr,
          scheduledTime: '11:00',
          status: 'scheduled',
        });
      }

      setScheduledPosts([...queued, ...scheduledPosts]);
    }

    // Switch to marketing tab to review
    setActiveTab('marketing');
  };

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem('kreatorpulse_products', JSON.stringify(products));
    } catch (e) {
      console.error('Storage error', e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem('kreatorpulse_leads', JSON.stringify(leads));
    } catch (e) {
      console.error('Storage error', e);
    }
  }, [leads]);

  useEffect(() => {
    try {
      localStorage.setItem('kreatorpulse_keywords', JSON.stringify(trackedKeywords));
    } catch (e) {
      console.error('Storage error', e);
    }
  }, [trackedKeywords]);

  useEffect(() => {
    try {
      localStorage.setItem('kreatorpulse_scheduled_posts', JSON.stringify(scheduledPosts));
    } catch (e) {
      console.error('Storage error', e);
    }
  }, [scheduledPosts]);

  useEffect(() => {
    try {
      localStorage.setItem('kreatorpulse_social_accounts', JSON.stringify(socialAccounts));
    } catch (e) {
      console.error('Storage error', e);
    }
  }, [socialAccounts]);

  // Lock background scroll when modals are open to prevent jitter and scroll lag
  const isAnyModalOpen = isNewProductModalOpen || isUtmBuilderModalOpen || isAccountsHubOpen || isWorkspaceImporterOpen || isSettingsOpen || !!directPublishModalPost;
  useEffect(() => {
    if (isAnyModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isAnyModalOpen]);

  // Aggregate metrics
  const totalRevenue = products.reduce((acc, p) => acc + (p.revenue || 0), 0);
  const totalLeads = leads.length;
  const totalScheduled = scheduledPosts.filter(p => p.status === 'scheduled').length;
  const connectedAccountsCount = socialAccounts.filter(a => a.connected).length;

  // Handlers
  const handleAddProduct = (newProdData: Omit<DigitalProduct, 'id' | 'createdAt' | 'salesCount' | 'revenue'>) => {
    const newProduct: DigitalProduct = {
      ...newProdData,
      id: `prod-${Date.now()}`,
      salesCount: 0,
      revenue: 0,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setProducts([newProduct, ...products]);
    setSelectedProduct(newProduct);
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
    if (selectedProduct?.id === id) {
      setSelectedProduct(products.find(p => p.id !== id) || null);
    }
  };

  const handleAddLead = (newLeadData: Omit<Lead, 'id' | 'updatedAt'>) => {
    const newLead: Lead = {
      ...newLeadData,
      id: `lead-${Date.now()}`,
      updatedAt: new Date().toISOString().slice(0, 10),
    };
    setLeads([newLead, ...leads]);
  };

  const handleUpdateLeadStage = (id: string, stage: Lead['stage']) => {
    setLeads(leads.map(l => l.id === id ? { ...l, stage, updatedAt: new Date().toISOString().slice(0, 10) } : l));
  };

  const handleDeleteLead = (id: string) => {
    setLeads(leads.filter(l => l.id !== id));
  };

  const handleToggleTrackKeyword = (keywordItem: KeywordItem) => {
    const exists = trackedKeywords.some(k => k.keyword.toLowerCase() === keywordItem.keyword.toLowerCase());
    if (exists) {
      setTrackedKeywords(trackedKeywords.filter(k => k.keyword.toLowerCase() !== keywordItem.keyword.toLowerCase()));
    } else {
      setTrackedKeywords([{ ...keywordItem, tracked: true }, ...trackedKeywords]);
    }
  };

  const handleSendToMarketingGenerator = (keywords: string[]) => {
    setPreselectedKeywords(keywords);
    setActiveTab('marketing');
  };

  const handleLaunchMarketingForProduct = (product: DigitalProduct) => {
    setSelectedProduct(product);
    setActiveTab('marketing');
  };

  const handleDesignMockupForProduct = (product: DigitalProduct) => {
    setSelectedProduct(product);
    setActiveTab('designer');
  };

  const handleSchedulePost = (postData: {
    productId: string;
    productTitle: string;
    platform: SocialPlatform;
    title: string;
    content: string;
    scheduledDate: string;
    scheduledTime: string;
  }) => {
    const newPost: ScheduledPost = {
      ...postData,
      id: `post-${Date.now()}`,
      status: 'scheduled',
    };
    setScheduledPosts([newPost, ...scheduledPosts]);
  };

  const handleDeletePost = (id: string) => {
    setScheduledPosts(scheduledPosts.filter(p => p.id !== id));
  };

  const handleUpdatePostStatus = (id: string, status: ScheduledPost['status']) => {
    setScheduledPosts(scheduledPosts.map(p => p.id === id ? { ...p, status } : p));
  };

  const handleSetPostDispatchResult = (id: string, result: { success: boolean; status?: number; message?: string }) => {
    setScheduledPosts(scheduledPosts.map(p => p.id === id ? { 
      ...p, 
      status: result.success ? 'published' : p.status,
      lastDispatchedAt: new Date().toISOString(),
      dispatchResult: result 
    } : p));
  };

  const handleScheduleWithMockup = (title: string, bannerDesc: string) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().slice(0, 10);

    const newPost: ScheduledPost = {
      id: `post-${Date.now()}`,
      productId: selectedProduct?.id || 'prod-1',
      productTitle: selectedProduct?.title || 'Digital Product Asset',
      platform: 'twitter',
      title,
      content: `${title}\n\n${selectedProduct?.usp || ''}\n\n[Attached Promo Graphic: ${bannerDesc}]\n\nGet it here: ${selectedProduct?.salesPageUrl || 'https://creators.store'}?utm_source=twitter&utm_medium=mockup-banner`,
      scheduledDate: dateStr,
      scheduledTime: '11:00',
      status: 'scheduled',
    };
    setScheduledPosts([newPost, ...scheduledPosts]);
    setActiveTab('scheduler');
  };

  const handleUpdateAccount = (updated: SocialAccountConnection) => {
    setSocialAccounts(socialAccounts.map(a => a.platform === updated.platform ? updated : a));
  };

  const handleTestAccount = async (platform: string): Promise<{ success: boolean; message: string }> => {
    const acc = socialAccounts.find(a => a.platform === platform);
    if (!acc) return { success: false, message: 'Account not found' };

    if (platform === 'webhook_bridge') {
      const res = await fetch('/api/webhooks/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          webhookUrl: acc.webhookUrl || 'https://hook.eu1.make.com/demo-marketing-webhook',
          payload: { event: 'ping_test', platform: 'webhook_bridge' }
        })
      });
      const data = await res.json();
      return { success: data.success, message: `Ping accepted by webhook bridge (status: ${data.status || 200})` };
    }

    // Direct account test
    await new Promise(r => setTimeout(r, 600));
    return {
      success: true,
      message: `Verified connection with ${acc.handleOrChannel}. Active scopes: ${acc.scopes.join(', ')}`
    };
  };

  const handleDirectPublish = async ({
    channels,
    postTitle,
    content,
    productTitle,
  }: {
    channels: SocialPlatform[];
    postTitle: string;
    content: string;
    productTitle: string;
  }) => {
    const bridgeAccount = socialAccounts.find(a => a.platform === 'webhook_bridge');

    const response = await fetch('/api/social/publish-direct', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        channels,
        postTitle,
        content,
        productTitle,
        accountsConfig: {
          webhookUrl: bridgeAccount?.webhookUrl,
        },
      }),
    });

    const data = await response.json();

    if (data.success) {
      // If modal was opened from an existing scheduled post, mark it published
      if (directPublishModalPost?.id) {
        setScheduledPosts(scheduledPosts.map(p => 
          p.id === directPublishModalPost.id 
            ? { ...p, status: 'published', lastDispatchedAt: new Date().toISOString() } 
            : p
        ));
      } else {
        // Create an entry in published queue
        const newPublishedPost: ScheduledPost = {
          id: `post-${Date.now()}`,
          productId: selectedProduct?.id || 'prod-1',
          productTitle,
          platform: channels[0] || 'twitter',
          title: postTitle,
          content,
          scheduledDate: new Date().toISOString().slice(0, 10),
          scheduledTime: new Date().toTimeString().slice(0, 5),
          status: 'published',
          lastDispatchedAt: new Date().toISOString(),
          dispatchResult: {
            success: true,
            message: `Published to ${channels.join(', ')}`,
          }
        };
        setScheduledPosts([newPublishedPost, ...scheduledPosts]);
      }
    }

    return data;
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col selection:bg-violet-600 selection:text-white">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        totalProducts={products.length}
        totalRevenue={totalRevenue}
        totalLeads={totalLeads}
        totalScheduled={totalScheduled}
        connectedAccountsCount={connectedAccountsCount}
        onNewProductClick={() => setIsNewProductModalOpen(true)}
        onOpenUtmBuilder={() => setIsUtmBuilderModalOpen(true)}
        onOpenAccountsHub={() => setIsAccountsHubOpen(true)}
        onOpenWorkspaceImporter={() => setIsWorkspaceImporterOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Content View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'products' && (
          <ProductsAndCrmTab
            products={products}
            leads={leads}
            onAddProduct={handleAddProduct}
            onDeleteProduct={handleDeleteProduct}
            onAddLead={handleAddLead}
            onUpdateLeadStage={handleUpdateLeadStage}
            onDeleteLead={handleDeleteLead}
            onLaunchMarketingForProduct={handleLaunchMarketingForProduct}
            onDesignMockupForProduct={handleDesignMockupForProduct}
            onOpenNewProductModal={() => setIsNewProductModalOpen(true)}
            onOpenWorkspaceImporter={() => setIsWorkspaceImporterOpen(true)}
          />
        )}

        {activeTab === 'keywords' && (
          <KeywordRadarTab
            products={products}
            trackedKeywords={trackedKeywords}
            onToggleTrackKeyword={handleToggleTrackKeyword}
            onSendToMarketingGenerator={handleSendToMarketingGenerator}
          />
        )}

        {activeTab === 'marketing' && (
          <AiMarketingGeneratorTab
            products={products}
            selectedProduct={selectedProduct}
            onSelectProduct={setSelectedProduct}
            preselectedKeywords={preselectedKeywords}
            onSchedulePost={handleSchedulePost}
            onOpenDirectPublishModal={(p) => setDirectPublishModalPost(p)}
          />
        )}

        {activeTab === 'designer' && (
          <VisualMockupDesignerTab
            products={products}
            selectedProduct={selectedProduct}
            onSelectProduct={setSelectedProduct}
            onScheduleWithMockup={handleScheduleWithMockup}
          />
        )}

        {activeTab === 'scheduler' && (
          <SchedulerAndWebhooksTab
            products={products}
            scheduledPosts={scheduledPosts}
            onAddPost={handleSchedulePost}
            onDeletePost={handleDeletePost}
            onUpdatePostStatus={handleUpdatePostStatus}
            onSetPostDispatchResult={handleSetPostDispatchResult}
            onOpenDirectPublishModal={(p) => setDirectPublishModalPost(p)}
            onOpenAccountsHub={() => setIsAccountsHubOpen(true)}
          />
        )}
      </main>

      {/* Modals */}
      <NewProductModal
        isOpen={isNewProductModalOpen}
        onClose={() => setIsNewProductModalOpen(false)}
        onAddProduct={handleAddProduct}
      />

      <UtmBuilderModal
        isOpen={isUtmBuilderModalOpen}
        onClose={() => setIsUtmBuilderModalOpen(false)}
        products={products}
      />

      <ConnectedAccountsModal
        isOpen={isAccountsHubOpen}
        onClose={() => setIsAccountsHubOpen(false)}
        accounts={socialAccounts}
        onUpdateAccount={handleUpdateAccount}
        onTestAccount={handleTestAccount}
      />

      <DirectPublishModal
        isOpen={!!directPublishModalPost}
        onClose={() => setDirectPublishModalPost(null)}
        post={directPublishModalPost}
        accounts={socialAccounts}
        onDirectPublish={handleDirectPublish}
      />

      <WorkspaceImporterModal
        isOpen={isWorkspaceImporterOpen}
        onClose={() => setIsWorkspaceImporterOpen(false)}
        onProductImported={handleProductImportedFromWorkspace}
        onOpenDirectPublishModal={(p) => setDirectPublishModalPost(p)}
      />

      <SettingsAndAboutModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onResetDemoData={handleResetDemoData}
      />
    </div>
  );
}
