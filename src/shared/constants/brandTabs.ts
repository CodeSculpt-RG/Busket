import type { BrandTabName } from '../../app/navigation/types';

interface BrandTabItem {
  name: BrandTabName;
  label: string;
  icon: string;
}

export const brandTabs: BrandTabItem[] = [
  { name: 'BrandFeed', label: 'Feed', icon: 'view-dashboard-outline' },
  { name: 'BrandCampaignTab', label: 'Campaign', icon: 'briefcase-search-outline' },
  { name: 'BrandHome', label: 'Home', icon: 'home-variant-outline' },
  { name: 'BrandExplore', label: 'Explore', icon: 'account-search-outline' },
  { name: 'BrandProfileTab', label: 'Profile', icon: 'domain' },
];
