import type { ImageSourcePropType } from 'react-native';
import type { VideoSource } from 'expo-video';

const image = (seed: string, width = 700, height = 700): ImageSourcePropType => ({
  uri: `https://picsum.photos/seed/${seed}/${width}/${height}`,
});

export interface BrandBanner {
  id: string;
  title: string;
  subtitle: string;
  image: ImageSourcePropType;
}

export interface BrandShortcut {
  id: 'inspiration' | 'creators' | 'wallet';
  title: string;
  icon: string;
  accentColor: string;
}

export interface BrandCampaign {
  id: string;
  name: string;
  brand: string;
  status: 'Draft' | 'Pending' | 'Active';
  creators: number;
  pending: number;
  applicants: number;
  image: ImageSourcePropType;
  payout: string;
  category: string;
}

export interface BrandProduct {
  id: string;
  name: string;
  image: ImageSourcePropType;
}

export interface BrandRequirement {
  label: string;
  value: string;
}

export interface BrandTrendLabel {
  id: string;
  label: string;
  top: `${number}%`;
  left?: `${number}%`;
  right?: `${number}%`;
}

export interface BrandTrendAnnotation {
  id: string;
  label: string;
  top: number;
  left: number;
  align?: 'left' | 'right';
}

export interface BrandTrendCardItem {
  id: string;
  title: string;
  category: string;
  mediaType: 'video' | 'image';
  mediaSource: ImageSourcePropType | VideoSource;
  fallbackImage: ImageSourcePropType;
  shareMessage: string;
  annotations: BrandTrendAnnotation[];
}

export interface BrandContentIdea {
  id: string;
  title: string;
  subtitle: string;
  format: string;
  icon: 'filmstrip' | 'play-circle-outline' | 'lightbulb-on-outline';
  image: ImageSourcePropType;
}

export interface CreatorPreview {
  id: string;
  name: string;
  handle: string;
  gender: string;
  age: number;
  city: string;
  avatar: ImageSourcePropType;
  followers: string;
  youtubeFollowers: string;
  engagement: string;
  rating: string;
  niche: string;
  categories: string[];
  bio: string;
  commercials: string;
}

export const brandBanners: BrandBanner[] = [
  {
    id: 'banner-1',
    title: 'Ready to collaborate?',
    subtitle: 'Launch creator campaigns with verified talent.',
    image: image('brand-banner-collab', 900, 420),
  },
  {
    id: 'banner-2',
    title: 'Track creator ROI',
    subtitle: 'Briefs, approvals, and payouts in one workspace.',
    image: image('brand-banner-roi', 900, 420),
  },
];

export const brandShortcuts: BrandShortcut[] = [
  { id: 'inspiration', title: 'Ads Inspiration', icon: 'filmstrip', accentColor: '#FFE1A6' },
  { id: 'creators', title: 'Find Creators', icon: 'account-search-outline', accentColor: '#DDF7F4' },
  { id: 'wallet', title: 'Your Wallet', icon: 'wallet-outline', accentColor: '#E9E6FF' },
];

export const brandCampaigns: BrandCampaign[] = [
  {
    id: 'camp-1',
    name: 'Morning Skincare Launch',
    brand: 'GlowBasket',
    status: 'Active',
    creators: 27,
    pending: 8,
    applicants: 122,
    image: image('brand-campaign-skincare', 400, 400),
    payout: 'INR 12,000',
    category: 'Beauty',
  },
  {
    id: 'camp-2',
    name: 'Protein Bar Challenge',
    brand: 'FuelUp',
    status: 'Pending',
    creators: 18,
    pending: 5,
    applicants: 64,
    image: image('brand-campaign-fitness', 400, 400),
    payout: 'INR 8,500',
    category: 'Fitness',
  },
  {
    id: 'camp-3',
    name: 'Desk Setup Reel',
    brand: 'WorkWell',
    status: 'Draft',
    creators: 9,
    pending: 2,
    applicants: 31,
    image: image('brand-campaign-desk', 400, 400),
    payout: 'INR 6,000',
    category: 'Lifestyle',
  },
];

export const brandProducts: BrandProduct[] = [
  { id: 'product-1', name: 'Hydra Kit', image: image('brand-product-1', 300, 300) },
  { id: 'product-2', name: 'Night Serum', image: image('brand-product-2', 300, 300) },
  { id: 'product-3', name: 'Glow Mask', image: image('brand-product-3', 300, 300) },
];

export const brandRequirements: BrandRequirement[] = [
  { label: 'Gender', value: 'Any' },
  { label: 'Age', value: '18-30' },
  { label: 'Category', value: 'Beauty, Lifestyle' },
  { label: 'Language', value: 'Hindi, English' },
  { label: 'Followers', value: '10K+' },
];

export const brandTrendLabels: BrandTrendLabel[] = [
  { id: 'trend-1', label: 'Cafe At Home', top: '22%', right: '8%' },
  { id: 'trend-2', label: 'Desk Art', top: '52%', right: '14%' },
  { id: 'trend-3', label: 'Flatlay', top: '66%', left: '10%' },
];

export const brandTrendDeck: BrandTrendCardItem[] = [
  {
    id: 'brand-trend-1',
    title: 'Desk setup product story',
    category: 'Workspace',
    mediaType: 'video',
    mediaSource: {
      uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    },
    fallbackImage: image('brand-trend-desk-story', 700, 1000),
    shareMessage: 'Brand trend idea: desk setup story with Pen Holder, Setup Cockpit, Catch All Tray, and Desk Mat labels.',
    annotations: [
      { id: 'brand-annotation-1', label: 'Pen Holder', top: 18, left: 21 },
      { id: 'brand-annotation-2', label: 'Setup Cockpit', top: 31, left: 62, align: 'right' },
      { id: 'brand-annotation-3', label: 'Catch All Tray', top: 61, left: 22 },
      { id: 'brand-annotation-4', label: 'Desk Mat', top: 78, left: 57, align: 'right' },
    ],
  },
  {
    id: 'brand-trend-2',
    title: 'Skincare shelf hook',
    category: 'Beauty',
    mediaType: 'image',
    mediaSource: image('brand-trend-skincare-hook', 700, 1000),
    fallbackImage: image('brand-trend-skincare-hook', 700, 1000),
    shareMessage: 'Brand trend idea: skincare shelf hook with texture closeups, routine steps, and final glow reveal.',
    annotations: [
      { id: 'brand-annotation-5', label: 'Texture Shot', top: 23, left: 16 },
      { id: 'brand-annotation-6', label: 'Hero Product', top: 44, left: 63, align: 'right' },
      { id: 'brand-annotation-7', label: 'Final Glow', top: 72, left: 27 },
    ],
  },
  {
    id: 'brand-trend-3',
    title: 'Cafe workday integration',
    category: 'Lifestyle',
    mediaType: 'image',
    mediaSource: image('brand-trend-cafe-workday', 700, 1000),
    fallbackImage: image('brand-trend-cafe-workday', 700, 1000),
    shareMessage: 'Brand trend idea: cafe workday vlog with location, creator setup, and conversion CTA moment.',
    annotations: [
      { id: 'brand-annotation-8', label: 'Opening Frame', top: 20, left: 56, align: 'right' },
      { id: 'brand-annotation-9', label: 'Creator Setup', top: 52, left: 20 },
      { id: 'brand-annotation-10', label: 'CTA Moment', top: 76, left: 58, align: 'right' },
    ],
  },
  {
    id: 'brand-trend-4',
    title: 'Fitness form breakdown',
    category: 'Fitness',
    mediaType: 'video',
    mediaSource: {
      uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    },
    fallbackImage: image('brand-trend-fitness-form', 700, 1000),
    shareMessage: 'Brand trend idea: fitness form breakdown with posture, tempo, breathing, and final rep labels.',
    annotations: [
      { id: 'brand-annotation-11', label: 'Form Cue', top: 28, left: 18 },
      { id: 'brand-annotation-12', label: 'Tempo', top: 48, left: 68, align: 'right' },
      { id: 'brand-annotation-13', label: 'Breath', top: 70, left: 20 },
    ],
  },
];

export const brandContentIdeas: BrandContentIdea[] = [
  {
    id: 'idea-1',
    title: 'Three hook reel for launch week',
    subtitle: 'High-retention opening frames',
    format: 'Reel',
    icon: 'play-circle-outline',
    image: image('brand-idea-hooks', 520, 360),
  },
  {
    id: 'idea-2',
    title: 'Creator-led product comparison',
    subtitle: 'Clear benefit callouts',
    format: 'UGC',
    icon: 'filmstrip',
    image: image('brand-idea-comparison', 520, 360),
  },
  {
    id: 'idea-3',
    title: 'Trend remix for premium brands',
    subtitle: 'Fast concept validation',
    format: 'Idea',
    icon: 'lightbulb-on-outline',
    image: image('brand-idea-trend', 520, 360),
  },
];

export const creatorPreviews: CreatorPreview[] = [
  {
    id: 'creator-1',
    name: 'Rohit Malik',
    handle: '@rohitcreates',
    gender: 'Male',
    age: 28,
    city: 'Mumbai',
    avatar: image('creator-rohit', 700, 900),
    followers: '20K',
    youtubeFollowers: '8.4K',
    engagement: '4.3%',
    rating: '4.8',
    niche: 'Fashion + Lifestyle',
    categories: ['Fashion', 'Lifestyle', 'UGC'],
    bio: 'Mumbai based creator making clean lifestyle, outfit, and product-led short videos for premium consumer brands.',
    commercials: 'INR 10K / reel',
  },
  {
    id: 'creator-2',
    name: 'Aisha Khan',
    handle: '@aishaglow',
    gender: 'Female',
    age: 25,
    city: 'Delhi',
    avatar: image('creator-aisha', 700, 900),
    followers: '46K',
    youtubeFollowers: '14K',
    engagement: '5.1%',
    rating: '4.9',
    niche: 'Beauty',
    categories: ['Beauty', 'Skincare', 'Tutorials'],
    bio: 'Beauty creator focused on product demos, morning routines, review-led reels, and conversion-friendly hooks.',
    commercials: 'INR 18K / reel',
  },
  {
    id: 'creator-3',
    name: 'Dev Shah',
    handle: '@devdesk',
    gender: 'Male',
    age: 30,
    city: 'Bengaluru',
    avatar: image('creator-devdesk', 700, 900),
    followers: '31K',
    youtubeFollowers: '22K',
    engagement: '3.9%',
    rating: '4.7',
    niche: 'Tech + Workspace',
    categories: ['Tech', 'Workspace', 'Productivity'],
    bio: 'Tech and workspace creator with strong desk setup, productivity, and SaaS-friendly storytelling.',
    commercials: 'INR 15K / reel',
  },
];

export const profileOptions = ['Business Details', 'Billing & Payments', 'Team Members', 'Help Centre', 'Logout'];
