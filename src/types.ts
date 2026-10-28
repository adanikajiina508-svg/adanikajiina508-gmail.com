export type ProductCategory = 
  | 'Notion Template'
  | 'Video Course'
  | 'UI/UX Kit'
  | 'Micro-SaaS'
  | 'Ebook & Guide'
  | 'Design Assets / Presets'
  | 'AI Prompt Library'
  | 'Agency Retainer'
  | 'Code Boilerplate'
  | 'Paid Newsletter / Community';

export interface DigitalProduct {
  id: string;
  title: string;
  category: ProductCategory;
  price: number;
  currency: string;
  salesPageUrl: string;
  usp: string;
  description: string;
  targetAudience: string;
  status: 'active' | 'draft' | 'archived';
  salesCount: number;
  revenue: number;
  createdAt: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  companyOrHandle?: string;
  productId: string;
  productTitle: string;
  stage: 'New Lead' | 'Contacted' | 'Demo / Trial' | 'Customer' | 'VIP';
  score: number; // 0 - 100
  potentialValue: number;
  source: 'Twitter/X' | 'LinkedIn' | 'YouTube' | 'Organic Search' | 'Newsletter' | 'Product Hunt' | 'Direct';
  notes: string;
  updatedAt: string;
}

export interface KeywordItem {
  keyword: string;
  volume: string;
  difficulty: number;
  intent: 'Transactional' | 'Commercial' | 'Informational';
  growth: string;
  topAngle: string;
  suggestedPlatforms: string[];
  tracked?: boolean;
}

export interface KeywordAnalysisResult {
  keywords: KeywordItem[];
  contentAngles: string[];
  competitorGap: string;
  trendingHashtags: string[];
}

export interface MarketingPack {
  socialPosts: {
    twitterThread: string[];
    linkedInPost: string;
    instagramScript: {
      hookVisual: string;
      voiceover: string;
      caption: string;
      hashtags: string[];
    };
    youtubeCommunityPost?: string;
  };
  salesCopy: {
    heroHeadline: string;
    subheadline: string;
    valueBullets: string[];
    objectionBuster: string;
    callToAction: string;
  };
  emailSequence: {
    day: string;
    theme: string;
    subject: string;
    previewText: string;
    body: string;
    ctaButton: string;
  }[];
  leadMagnet: {
    title: string;
    format: string;
    pitchHook: string;
    checklistItems: string[];
  };
}

export type SocialPlatform = 'twitter' | 'linkedin' | 'youtube' | 'instagram' | 'email' | 'threads' | 'generic';

export interface SocialAccountConnection {
  platform: 'twitter' | 'linkedin' | 'youtube' | 'instagram' | 'webhook_bridge';
  name: string;
  connected: boolean;
  handleOrChannel: string;
  avatarText: string;
  scopes: string[];
  apiKey?: string;
  accessToken?: string;
  webhookUrl?: string;
  lastActive?: string;
}

export interface ScheduledPost {
  id: string;
  productId: string;
  productTitle: string;
  platform: SocialPlatform;
  targetChannels?: SocialPlatform[];
  title: string;
  content: string;
  scheduledDate: string; // YYYY-MM-DD
  scheduledTime: string; // HH:mm
  status: 'scheduled' | 'published' | 'draft';
  webhookUrl?: string;
  lastDispatchedAt?: string;
  dispatchResult?: {
    success: boolean;
    status?: number;
    message?: string;
    publishedIds?: Record<string, string>;
  };
}

export interface MockupDesignConfig {
  theme: 'cyber-dark' | 'sunset-glow' | 'emerald-luxury' | 'electric-violet' | 'clean-white';
  badgeText: string;
  headline: string;
  subheadline: string;
  price: string;
  formatLabel: string;
  rating: number;
  reviewsCount: number;
  bullet1: string;
  bullet2: string;
  bullet3: string;
  ctaText: string;
  authorHandle: string;
}
