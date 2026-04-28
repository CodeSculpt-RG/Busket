import type { CreatorTabName } from '../../app/navigation/types';

export interface CreatorTabItem {
  name: CreatorTabName;
  label: string;
  icon: string;
}

export const creatorTabs: CreatorTabItem[] = [
  { name: 'CreatorFeed', label: 'Feed', icon: 'view-dashboard-outline' },
  { name: 'CreatorCampaignTab', label: 'Campaign', icon: 'briefcase-search-outline' },
  { name: 'CreatorHome', label: 'Home', icon: 'home-variant-outline' },
  { name: 'CreatorExplore', label: 'Explore', icon: 'compass-outline' },
  { name: 'CreatorProfileTab', label: 'Profile', icon: 'account-circle-outline' },
];
