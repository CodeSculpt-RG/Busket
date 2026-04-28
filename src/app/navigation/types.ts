import type { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  RoleSelection: undefined;
  BrandSignIn: undefined;
  CreatorSignIn: undefined;
  BrandSignUp: undefined;
  CreatorSignUp: undefined;
  BrandOnboarding: undefined;
};

export type CreatorTabParamList = {
  CreatorFeed: undefined;
  CreatorCampaignTab:
    | {
        brandName?: string;
      }
    | undefined;
  CreatorHome: undefined;
  CreatorExplore: undefined;
  CreatorProfileTab: undefined;
};

export type CreatorTabName = keyof CreatorTabParamList;

export type CreatorStackParamList = {
  CreatorTabs: NavigatorScreenParams<CreatorTabParamList> | undefined;
  CreatorFeed: undefined;
  CreatorHome: undefined;
  SearchCampaign:
    | {
        brandName?: string;
      }
    | undefined;
  SearchBrand: undefined;
  CampaignDetails: {
    campaignId?: string;
  };
  CampaignApplication: {
    campaignId: string;
    campaignTitle: string;
    brandName: string;
    payoutText?: string;
  };
  TrendFinder: undefined;
  CreatorKyc: undefined;
  CreatorEditProfile: undefined;
  CreatorVideoUpload: undefined;
  CreatorProfile: undefined;
  Earnings: undefined;
  Notifications: undefined;
  CreatorFaq: undefined;
  LearnToEarn: undefined;
};

export type BrandTabParamList = {
  BrandFeed: undefined;
  BrandCampaignTab: undefined;
  BrandHome: undefined;
  BrandExplore: undefined;
  BrandProfileTab: undefined;
};

export type BrandTabName = keyof BrandTabParamList;

export type BrandCampaignFlowCampaign = {
  id: string;
  name: string;
  category: string;
  brief: string;
  payout: string;
  startDate: string;
  endDate: string;
  productLink: string;
  status: 'draft' | 'pending' | 'active';
  brandName?: string;
};

export type BrandCampaignFormParams = Omit<BrandCampaignFlowCampaign, 'id' | 'status'>;

export type BrandStackParamList = {
  BrandOnboarding: undefined;
  BrandTabs: undefined;
  BrandDashboard: undefined;
  BrandNotifications: undefined;
  BrandTrendFinder: undefined;
  BrandCampaigns:
    | {
        createdCampaign?: BrandCampaignFlowCampaign;
      }
    | undefined;
  BrandCampaignCreate: undefined;
  CreateCampaign: undefined;
  CampaignPreview: {
    campaign: BrandCampaignFormParams;
  };
  CampaignSuccess: {
    campaign: BrandCampaignFlowCampaign;
  };
  BrandCampaignDetails: {
    campaignId?: string;
  };
  CampaignApplicants: {
    campaignId: string;
    campaignName: string;
    applicantCount: number;
  };
  CreatorDiscovery:
    | {
        filter?: 'applicants' | 'saved';
      }
    | undefined;
  CreatorProfilePreview: {
    creatorId?: string;
    creatorName?: string;
    creatorHandle?: string;
    avatar?: string;
    categories?: string[];
    followers?: string;
    rating?: string;
  };
  BrandProfile: undefined;
  BrandPaymentBilling: undefined;
  BrandFaq: undefined;
  BrandAboutApp: undefined;
  Payments: undefined;
  Contracts: undefined;
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList> | undefined;
  Creator: NavigatorScreenParams<CreatorStackParamList> | undefined;
  Brand: NavigatorScreenParams<BrandStackParamList> | undefined;
  CreatorKyc: undefined;
  CreatorVideoUpload: undefined;
  BrandOnboarding: undefined;
};
