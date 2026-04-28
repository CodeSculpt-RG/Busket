import { type StyleProp, StyleSheet, Text, TouchableOpacity, type ViewStyle } from 'react-native';
import { colors } from '../../../shared/theme/colors';
import { fontWeight, typography } from '../../../shared/theme/typography';

interface AuthFooterTextProps {
  prefix: string;
  action: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}

export default function AuthFooterText({ prefix, action, onPress, style }: AuthFooterTextProps) {
  return (
    <TouchableOpacity activeOpacity={0.75} onPress={onPress} style={[styles.wrapper, style]}>
      <Text style={styles.text}>
        {prefix} <Text style={styles.action}>{action}</Text>
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
  },
  text: {
    color: colors.muted,
    fontSize: typography.small,
    fontWeight: fontWeight.medium,
  },
  action: {
    color: colors.text,
    fontWeight: fontWeight.heavy,
    textDecorationLine: 'underline',
  },
});
