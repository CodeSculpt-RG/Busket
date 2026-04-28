import { useSyncExternalStore } from 'react';

export type BrandCampaignStatus = 'draft' | 'pending' | 'active';

export type CampaignMediaAsset = {
  uri: string;
  fileName?: string;
};

export type BrandCampaign = {
  id: string;
  name: string;
  brandName: string;
  category: string;
  objective: string;
  productName?: string;
  brief: string;
  creatorRequirements?: string;
  genderPreference?: string;
  ageRange?: string;
  languages: string[];
  followerRange?: string;
  deliverables: string[];
  payout: number;
  budget?: number;
  startDate: string;
  endDate: string;
  couponCode?: string;
  productLink: string;
  status: BrandCampaignStatus;
  productImages: CampaignMediaAsset[];
  creativeImage?: CampaignMediaAsset;
  applicants: number;
  totalSlots: number;
  stats: {
    reel: number;
    story: number;
    post: number;
  };
  createdAt: string;
};

export type BrandCampaignDraft = Omit<BrandCampaign, 'id' | 'createdAt' | 'applicants' | 'totalSlots' | 'stats'>;

type BrandCampaignSnapshot = {
  campaigns: BrandCampaign[];
};

type BrandCampaignState = BrandCampaignSnapshot & {
  createCampaign: (campaign: BrandCampaignDraft) => BrandCampaign;
  updateCampaignStatus: (id: string, status: BrandCampaignStatus) => void;
};

const initialCampaigns: BrandCampaign[] = [
  {
    id: 'camp-1',
    name: 'Morning Skincare Launch',
    brandName: 'GlowBasket',
    category: 'Beauty',
    objective: 'Product Promotion',
    productName: 'Hydra Kit',
    brief: 'Creator-led morning routine content with texture closeups, benefit-led hooks, and product visibility.',
    creatorRequirements: 'Beauty and skincare creators with clean product demo style.',
    genderPreference: 'Any',
    ageRange: '18-24',
    languages: ['English', 'Hindi'],
    followerRange: '10k-50k',
    deliverables: ['Reel', 'Story'],
    payout: 12000,
    budget: 240000,
    startDate: '28/04/2026',
    endDate: '12/05/2026',
    couponCode: 'GLOWCREATOR',
    productLink: 'https://example.com/glowbasket',
    status: 'active',
    productImages: [{ uri: 'https://picsum.photos/seed/brand-campaign-skincare/600/600' }],
    creativeImage: { uri: 'https://picsum.photos/seed/brand-banner-skincare/900/420' },
    applicants: 122,
    totalSlots: 180,
    stats: { reel: 1, story: 2, post: 0 },
    createdAt: new Date('2026-04-20T10:00:00.000Z').toISOString(),
  },
  {
    id: 'camp-2',
    name: 'Protein Bar Challenge',
    brandName: 'FuelUp',
    category: 'Fitness',
    objective: 'UGC Content Creation',
    productName: 'Protein Bar Box',
    brief: 'Short-form review campaign focused on taste, texture, fitness use case, and creator authenticity.',
    creatorRequirements: 'Fitness and wellness creators who can shoot gym or home workout content.',
    genderPreference: 'Any',
    ageRange: '25-34',
    languages: ['English', 'Hindi'],
    followerRange: '10k-50k',
    deliverables: ['Reel', 'Product Review'],
    payout: 8500,
    budget: 120000,
    startDate: '01/05/2026',
    endDate: '18/05/2026',
    couponCode: 'FUELUGC',
    productLink: 'https://example.com/fuelup',
    status: 'pending',
    productImages: [{ uri: 'https://picsum.photos/seed/brand-campaign-fitness/600/600' }],
    creativeImage: { uri: 'https://picsum.photos/seed/brand-banner-fitness/900/420' },
    applicants: 64,
    totalSlots: 100,
    stats: { reel: 1, story: 1, post: 0 },
    createdAt: new Date('2026-04-22T10:00:00.000Z').toISOString(),
  },
  {
    id: 'camp-3',
    name: 'Desk Setup Reel',
    brandName: 'WorkWell',
    category: 'Lifestyle',
    objective: 'Brand Awareness',
    productName: 'Workspace Kit',
    brief: 'Desk makeover concept with creator workflow, product placement, and productivity hooks.',
    creatorRequirements: 'Workspace, productivity, tech, and lifestyle creators.',
    genderPreference: 'Any',
    ageRange: '18-24',
    languages: ['English'],
    followerRange: '1k-10k',
    deliverables: ['Reel', 'Post'],
    payout: 6000,
    budget: 90000,
    startDate: '04/05/2026',
    endDate: '22/05/2026',
    productLink: 'https://example.com/workwell',
    status: 'draft',
    productImages: [{ uri: 'https://picsum.photos/seed/brand-campaign-desk/600/600' }],
    creativeImage: { uri: 'https://picsum.photos/seed/brand-banner-desk/900/420' },
    applicants: 31,
    totalSlots: 80,
    stats: { reel: 1, story: 0, post: 1 },
    createdAt: new Date('2026-04-24T10:00:00.000Z').toISOString(),
  },
];

let campaignState: BrandCampaignSnapshot = {
  campaigns: initialCampaigns,
};

const listeners = new Set<() => void>();

const emit = () => {
  listeners.forEach((listener) => listener());
};

export const getBrandCampaignState = () => campaignState;

export const createBrandCampaign = (campaign: BrandCampaignDraft) => {
  const nextCampaign: BrandCampaign = {
    ...campaign,
    id: `brand-campaign-${Date.now()}`,
    applicants: 0,
    totalSlots: 100,
    stats: {
      reel: campaign.deliverables.includes('Reel') ? 1 : 0,
      story: campaign.deliverables.includes('Story') ? 1 : 0,
      post: campaign.deliverables.includes('Post') ? 1 : 0,
    },
    createdAt: new Date().toISOString(),
  };

  campaignState = {
    campaigns: [nextCampaign, ...campaignState.campaigns],
  };
  emit();
  return nextCampaign;
};

export const updateBrandCampaignStatus = (id: string, status: BrandCampaignStatus) => {
  campaignState = {
    campaigns: campaignState.campaigns.map((campaign) => (campaign.id === id ? { ...campaign, status } : campaign)),
  };
  emit();
};

export const brandCampaignStore: BrandCampaignState = {
  get campaigns() {
    return campaignState.campaigns;
  },
  createCampaign: createBrandCampaign,
  updateCampaignStatus: updateBrandCampaignStatus,
};

export const useBrandCampaignState = () =>
  useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    () => campaignState,
    () => campaignState,
  );
