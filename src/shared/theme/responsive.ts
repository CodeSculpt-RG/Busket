import { Dimensions, Platform } from 'react-native';

const baseWidth = 390;
const baseHeight = 844;

export const scale = (value: number) => {
  const { width } = Dimensions.get('window');
  const factor = Math.min(Math.max(width / baseWidth, 0.88), 1.18);
  return Math.round(value * factor);
};

export const verticalScale = (value: number) => {
  const { height } = Dimensions.get('window');
  const factor = Math.min(Math.max(height / baseHeight, 0.86), 1.14);
  return Math.round(value * factor);
};

export const moderateScale = (value: number, factor = 0.35) => {
  return Math.round(value + (scale(value) - value) * factor);
};

export const maxContentWidth = 620;
export const compactContentWidth = 520;
export const tabBarHeight = Platform.select({ ios: 82, android: 74, default: 76 });

export const getDeviceClass = (width: number) => {
  if (width >= 900) {
    return 'large' as const;
  }

  if (width >= 600) {
    return 'medium' as const;
  }

  return 'small' as const;
};

export const getResponsivePadding = (width: number) => {
  if (width >= 900) {
    return 40;
  }

  if (width >= 600) {
    return 28;
  }

  if (width <= 340) {
    return 14;
  }

  return 18;
};

export const getColumns = (width: number, compact = false) => {
  if (width >= 900) {
    return compact ? 3 : 4;
  }

  if (width >= 600) {
    return compact ? 2 : 3;
  }

  return compact ? 2 : 3;
};
