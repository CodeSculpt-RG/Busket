import type { ImageSourcePropType } from 'react-native';
import type { VideoSource } from 'expo-video';

const image = (id: number): ImageSourcePropType => ({
  uri: `https://picsum.photos/seed/busket-${id}/600/600`,
});

export interface CreatorBanner {
  id: string;
  title: string;
  subtitle: string;
  image: ImageSourcePropType;
}

export interface CreatorCampaign {
  id: string;
  name: string;
  brand: string;
  categories: string[];
  tags: string[];
  status: 'live' | 'active' | 'closed';
  payout: string;
  payoutAmount: number;
  applied: number;
  totalSlots: number;
  stats: {
    reel: number;
    story: number;
    post: number;
  };
  image: ImageSourcePropType;
}

export interface CreatorIdea {
  id: string;
  title: string;
  source: string;
  categories: string[];
  image: ImageSourcePropType;
}

export interface CreatorBrand {
  id: string;
  name: string;
  subtitle: string;
  category: string;
  popularity: number;
  image: ImageSourcePropType;
}

export interface CreatorProduct {
  id: string;
  name: string;
  image: ImageSourcePropType;
}

export interface CampaignRequirement {
  label: string;
  value: string;
}

export interface CampaignBrief {
  couponCode: string;
  website: string;
  offerText: string;
  intro: string;
  guidelines: string[];
}

export interface CreatorCampaignDetails {
  requirements: CampaignRequirement[];
  products: CreatorProduct[];
  brief: CampaignBrief;
}

export interface CreatorNotification {
  id: string;
  title: string;
  body: string;
  time: string;
}

export interface TrendAnnotation {
  id: string;
  label: string;
  top: number;
  left: number;
  align?: 'left' | 'right';
}

export interface TrendCardItem {
  id: string;
  title: string;
  category: string;
  mediaType: 'video' | 'image';
  mediaSource: ImageSourcePropType | VideoSource;
  fallbackImage: ImageSourcePropType;
  shareMessage: string;
  annotations: TrendAnnotation[];
}

export const creatorBanners: CreatorBanner[] = [
  {
    id: 'banner-1',
    title: 'Shape your next brand deal',
    subtitle: 'Campaigns picked for high-performing creators.',
    image: image(11),
  },
  {
    id: 'banner-2',
    title: 'Build. Post. Earn.',
    subtitle: 'Fresh briefs with quick payouts every week.',
    image: image(12),
  },
  {
    id: 'banner-3',
    title: 'Creator Navigator',
    subtitle: 'Ideas, campaigns, and earnings in one place.',
    image: image(13),
  },
];

export const shortcutActions = [
  { id: 'learn', title: 'Learn to Earn', icon: 'play-circle-outline' },
  { id: 'campaigns', title: 'Find Campaigns', icon: 'target' },
  { id: 'earnings', title: 'Earnings', icon: 'wallet-outline' },
] as const;

export type ShortcutAction = (typeof shortcutActions)[number];

export const creatorCampaigns: CreatorCampaign[] = [
  {
    id: 'campaign-1',
    name: 'Glow Routine Reel',
    brand: 'Bloom Lab',
    categories: ['Beauty', 'Skincare', 'Fashion', 'Lifestyle'],
    tags: ['reel', 'skincare', 'routine', 'ugc'],
    status: 'live',
    payout: 'Upto 3,000 INR / video',
    payoutAmount: 3000,
    applied: 122,
    totalSlots: 500,
    stats: { reel: 1, story: 2, post: 0 },
    image: image(21),
  },
  {
    id: 'campaign-2',
    name: 'Fit Snack Review',
    brand: 'Core Bites',
    categories: ['Fitness', 'Health & Wellness', 'Food', 'Sports'],
    tags: ['reel', 'story', 'nutrition', 'review'],
    status: 'active',
    payout: 'Upto 1,000 INR / video',
    payoutAmount: 1000,
    applied: 77,
    totalSlots: 100,
    stats: { reel: 1, story: 2, post: 0 },
    image: image(22),
  },
  {
    id: 'campaign-3',
    name: 'Creator Desk Setup',
    brand: 'Layer Story',
    categories: ['Tech', 'Education', 'Business', 'Photography'],
    tags: ['post', 'setup', 'desk', 'productivity'],
    status: 'live',
    payout: 'Upto 2,500 INR / video',
    payoutAmount: 2500,
    applied: 89,
    totalSlots: 500,
    stats: { reel: 1, story: 2, post: 0 },
    image: image(23),
  },
  {
    id: 'campaign-4',
    name: 'Weekend Getaway Story',
    brand: 'Roamly',
    categories: ['Travel', 'Lifestyle', 'Food', 'Photography'],
    tags: ['story', 'travel', 'vlog', 'itinerary'],
    status: 'closed',
    payout: 'Upto 4,500 INR / video',
    payoutAmount: 4500,
    applied: 122,
    totalSlots: 500,
    stats: { reel: 1, story: 2, post: 0 },
    image: image(24),
  },
];

export const creatorIdeas: CreatorIdea[] = [
  {
    id: 'idea-1',
    title: '3-step morning routine',
    source: 'Short video trend',
    categories: ['Beauty', 'Skincare', 'Lifestyle', 'Fashion'],
    image: image(31),
  },
  {
    id: 'idea-2',
    title: 'What I eat before training',
    source: 'Caption format',
    categories: ['Fitness', 'Food', 'Health & Wellness', 'Sports'],
    image: image(32),
  },
  {
    id: 'idea-3',
    title: 'Desk setup under budget',
    source: 'Carousel prompt',
    categories: ['Tech', 'Education', 'Business', 'Photography'],
    image: image(33),
  },
  {
    id: 'idea-4',
    title: 'One-day city itinerary',
    source: 'Reel sequence',
    categories: ['Travel', 'Lifestyle', 'Food', 'Photography'],
    image: image(34),
  },
];

export const creatorBrands: CreatorBrand[] = [
  { id: 'brand-1', name: 'Layer Story', subtitle: 'Premium Stationary', category: 'Stationary', popularity: 94, image: image(41) },
  { id: 'brand-2', name: 'Calendella', subtitle: 'Corporate Gifting', category: 'Gifting', popularity: 86, image: image(42) },
  { id: 'brand-3', name: 'Space Station Co-Working', subtitle: 'Managed Office Spaces', category: 'Workspace', popularity: 78, image: image(43) },
  { id: 'brand-4', name: 'Creator Navigator', subtitle: 'Media & Production House', category: 'Media', popularity: 98, image: image(44) },
  { id: 'brand-5', name: 'Bloom Lab', subtitle: 'Beauty & Skincare Studio', category: 'Beauty', popularity: 91, image: image(45) },
];

export const creatorProducts: CreatorProduct[] = [
  { id: 'product-1', name: 'Shape Your Body', image: image(51) },
  { id: 'product-2', name: 'Creator Fuel', image: image(52) },
  { id: 'product-3', name: 'Get In Shape', image: image(53) },
  { id: 'product-4', name: 'Desk Mat', image: image(54) },
  { id: 'product-5', name: 'Creator Kit', image: image(55) },
];

export const creatorNotifications: CreatorNotification[] = [
  { id: 'notification-1', title: 'SALE IS LIVE', body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', time: '1m ago.' },
  { id: 'notification-2', title: 'SALE IS LIVE', body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', time: '1m ago.' },
  { id: 'notification-3', title: 'SALE IS LIVE', body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', time: '1m ago.' },
  { id: 'notification-4', title: 'SALE IS LIVE', body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', time: '10 Hrs ago.' },
  { id: 'notification-5', title: 'SALE IS LIVE', body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', time: '15 Hrs ago.' },
];

export const creatorRequirements = [
  { label: 'Gender', value: 'Male' },
  { label: 'Age', value: '18 - 24 Yr' },
  { label: 'Category', value: 'Fashion, Lifestyle' },
  { label: 'Language', value: 'English, Tamil' },
  { label: 'Follower Size', value: '10k - 100k' },
];

export const creatorCampaignDetailsById: Record<string, CreatorCampaignDetails> = {
  'campaign-1': {
    requirements: creatorRequirements,
    products: creatorProducts,
    brief: {
      couponCode: 'LSCREATOR2K',
      website: 'www.layerstory.com',
      offerText: 'Order products worth INR 2000, absolutely free.',
      intro: 'Use the coupon on the website, choose a product you naturally like, and create a clean raw content story for the brand.',
      guidelines: [
        'Choose and order any product that fits your content style.',
        'Create your own script and share it with the team for approval.',
        'Shoot raw content in natural light with clear product visibility.',
        'The team will handle editing and final delivery formatting.',
        'Post the final video on your collab account once approved.',
        'Keep the content live for the required campaign duration.',
        'The brand can reuse the approved content for campaign promotions.',
        'After posting, leave a genuine product review.',
      ],
    },
  },
  'campaign-2': {
    requirements: [
      { label: 'Gender', value: 'Any' },
      { label: 'Age', value: '20 - 32 Yr' },
      { label: 'Category', value: 'Fitness, Food' },
      { label: 'Language', value: 'English, Hindi' },
      { label: 'Follower Size', value: '5k - 75k' },
    ],
    products: creatorProducts,
    brief: {
      couponCode: 'COREUGC1K',
      website: 'www.corebites.example',
      offerText: 'Order creator snack kits worth INR 1000, absolutely free.',
      intro: 'Create a short, honest snack review with taste, texture, and pre-workout use case.',
      guidelines: [
        'Show the pack clearly in the first three seconds.',
        'Mention one use case before or after training.',
        'Keep the tone honest and conversational.',
        'Share raw footage for approval before posting.',
        'Post the final approved reel and keep it live for 30 days.',
      ],
    },
  },
  'campaign-3': {
    requirements: creatorRequirements,
    products: creatorProducts,
    brief: {
      couponCode: 'DESKCREATOR',
      website: 'www.layerstory.com',
      offerText: 'Order workspace products worth INR 2500, absolutely free.',
      intro: 'Build a desk setup story with product placement and creator productivity hooks.',
      guidelines: [
        'Start with a before and after desk setup frame.',
        'Highlight the product as part of your workflow.',
        'Use clean overhead and close-up shots.',
        'Send raw footage for edit approval.',
        'Post final content on collab account and tag the brand.',
      ],
    },
  },
  'campaign-4': {
    requirements: [
      { label: 'Gender', value: 'Any' },
      { label: 'Age', value: '18 - 35 Yr' },
      { label: 'Category', value: 'Travel, Lifestyle' },
      { label: 'Language', value: 'English, Hindi' },
      { label: 'Follower Size', value: '10k - 100k' },
    ],
    products: creatorProducts,
    brief: {
      couponCode: 'ROAMCREATOR',
      website: 'www.roamly.example',
      offerText: 'Claim a travel creator kit for your next weekend story.',
      intro: 'Create an itinerary-style story that blends product utility with a destination moment.',
      guidelines: [
        'Open with the destination or travel hook.',
        'Use product shots naturally in the story flow.',
        'Keep transitions simple and clear.',
        'Share raw content before publishing.',
        'Post after approval and keep content live as required.',
      ],
    },
  },
};

export const trendLabels = [
  { id: 'trend-1', label: 'Pen Holder', top: 72, left: 116 },
  { id: 'trend-2', label: 'Setup Cockpit', top: 116, right: 24 },
  { id: 'trend-3', label: 'Catch All Tray', top: 232, left: 86 },
  { id: 'trend-4', label: 'Desk Mat', top: 340, right: 54 },
];

export const trendFinderDeck: TrendCardItem[] = [
  {
    id: 'trend-card-1',
    title: 'Desk reset reel',
    category: 'Workspace',
    mediaType: 'video',
    mediaSource: {
      uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    },
    fallbackImage: image(71),
    shareMessage: 'Desk reset reel idea: label each prop and turn the setup into a quick creator story.',
    annotations: [
      { id: 'annotation-1', label: 'Pen Holder', top: 18, left: 22 },
      { id: 'annotation-2', label: 'Setup Cockpit', top: 31, left: 62, align: 'right' },
      { id: 'annotation-3', label: 'Catch All Tray', top: 62, left: 24 },
      { id: 'annotation-4', label: 'Desk Mat', top: 78, left: 58, align: 'right' },
    ],
  },
  {
    id: 'trend-card-2',
    title: 'Morning skincare hook',
    category: 'Beauty',
    mediaType: 'image',
    mediaSource: image(72),
    fallbackImage: image(72),
    shareMessage: 'Morning skincare hook: open with texture closeups, then reveal the complete routine.',
    annotations: [
      { id: 'annotation-5', label: 'Texture Shot', top: 23, left: 16 },
      { id: 'annotation-6', label: 'Routine Step', top: 45, left: 64, align: 'right' },
      { id: 'annotation-7', label: 'Final Glow', top: 72, left: 28 },
    ],
  },
  {
    id: 'trend-card-3',
    title: 'Cafe workday vlog',
    category: 'Lifestyle',
    mediaType: 'image',
    mediaSource: image(73),
    fallbackImage: image(73),
    shareMessage: 'Cafe workday vlog: show the location, order, setup, and a 3-hour productivity recap.',
    annotations: [
      { id: 'annotation-8', label: 'Opening Frame', top: 20, left: 56, align: 'right' },
      { id: 'annotation-9', label: 'Creator Setup', top: 52, left: 20 },
      { id: 'annotation-10', label: 'CTA Moment', top: 76, left: 58, align: 'right' },
    ],
  },
  {
    id: 'trend-card-4',
    title: 'Fitness form breakdown',
    category: 'Fitness',
    mediaType: 'video',
    mediaSource: {
      uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    },
    fallbackImage: image(74),
    shareMessage: 'Fitness form breakdown: annotate posture, tempo, breathing, and the final rep.',
    annotations: [
      { id: 'annotation-11', label: 'Form Cue', top: 28, left: 18 },
      { id: 'annotation-12', label: 'Tempo', top: 48, left: 68, align: 'right' },
      { id: 'annotation-13', label: 'Breath', top: 70, left: 20 },
    ],
  },
];
