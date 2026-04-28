import type { AuthUser } from '../../../app/store/auth.store';

export type SocialRole = AuthUser['role'];
export type SocialProvider = AuthUser['provider'];
export type MockSocialAccount = {
  id: string;
  name: string;
  email: string;
};

const mockAccounts: Record<SocialProvider, Record<SocialRole, MockSocialAccount[]>> = {
  google: {
    creator: [
      { id: 'google_creator_primary', name: 'Aarav Creator', email: 'aarav.creator@gmail.com' },
      { id: 'google_creator_studio', name: 'Creator Studio', email: 'studio.creator@gmail.com' },
    ],
    brand: [
      { id: 'google_brand_primary', name: 'Busket Brand Lead', email: 'brand.lead@gmail.com' },
      { id: 'google_brand_team', name: 'Brand Team', email: 'brand.team@gmail.com' },
    ],
  },
  apple: {
    creator: [
      { id: 'apple_creator_primary', name: 'Apple Creator', email: 'creator@icloud.com' },
      { id: 'apple_creator_private', name: 'Private Relay Creator', email: 'creator.relay@privaterelay.appleid.com' },
    ],
    brand: [
      { id: 'apple_brand_primary', name: 'Apple Brand', email: 'brand@icloud.com' },
      { id: 'apple_brand_private', name: 'Private Relay Brand', email: 'brand.relay@privaterelay.appleid.com' },
    ],
  },
};

export const socialAuthService = {
  getMockAccounts(provider: SocialProvider, role: SocialRole): MockSocialAccount[] {
    return mockAccounts[provider][role];
  },

  async signInWithGoogle(role: SocialRole, account?: MockSocialAccount): Promise<AuthUser> {
    await new Promise<void>((resolve) => setTimeout(() => resolve(), 650));
    const selectedAccount = account ?? mockAccounts.google[role][0];

    return {
      id: selectedAccount.id,
      name: selectedAccount.name,
      email: selectedAccount.email,
      provider: 'google',
      role,
    };
  },

  async signInWithApple(role: SocialRole, account?: MockSocialAccount): Promise<AuthUser> {
    await new Promise<void>((resolve) => setTimeout(() => resolve(), 650));
    const selectedAccount = account ?? mockAccounts.apple[role][0];

    return {
      id: selectedAccount.id,
      name: selectedAccount.name,
      email: selectedAccount.email,
      provider: 'apple',
      role,
    };
  },
};
