import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../shared/theme/colors';
import { radius } from '../../../shared/theme/radius';
import { spacing } from '../../../shared/theme/spacing';
import { fontWeight, typography } from '../../../shared/theme/typography';

interface TermsConsentProps {
  accepted: boolean;
  onToggle: () => void;
}

export default function TermsConsent({ accepted, onToggle }: TermsConsentProps) {
  return (
    <Pressable accessibilityRole="checkbox" accessibilityState={{ checked: accepted }} onPress={onToggle} style={styles.row}>
      <View style={[styles.checkbox, accepted && styles.checkboxActive]}>
        {accepted ? <Text style={styles.check}>✓</Text> : null}
      </View>
      <Text style={styles.text}>
        I agree to the <Text style={styles.link}>Terms & Conditions</Text> and <Text style={styles.link}>Privacy Policy</Text>.
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  checkbox: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.xs,
    backgroundColor: colors.white,
    marginRight: spacing.sm,
  },
  checkboxActive: {
    borderColor: colors.black,
    backgroundColor: colors.gold,
  },
  check: {
    color: colors.black,
    fontSize: typography.body,
    fontWeight: fontWeight.heavy,
    lineHeight: 18,
  },
  text: {
    flex: 1,
    color: colors.text,
    fontSize: typography.small,
    lineHeight: 18,
    fontWeight: fontWeight.medium,
  },
  link: {
    color: '#2D63E5',
    fontWeight: fontWeight.bold,
  },
});
