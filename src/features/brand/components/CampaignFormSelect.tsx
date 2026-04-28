import React from 'react';
import { FlatList, Modal, Pressable, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import AppSelect from '../../../shared/components/AppSelect';
import { colors } from '../../../shared/theme/colors';
import { radius } from '../../../shared/theme/radius';
import { spacing } from '../../../shared/theme/spacing';
import { fontWeight, typography } from '../../../shared/theme/typography';

interface CampaignFormSelectProps {
  label: string;
  value: string;
  options: readonly string[];
  placeholder?: string;
  errorText?: string;
  onChange: (value: string) => void;
}

export default function CampaignFormSelect({ label, value, options, placeholder = 'Select', errorText, onChange }: CampaignFormSelectProps) {
  const [open, setOpen] = React.useState(false);
  const { height } = useWindowDimensions();
  const maxHeight = Math.min(460, Math.max(280, height * 0.72));

  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <AppSelect value={value} placeholder={placeholder} error={Boolean(errorText)} onPress={() => setOpen(true)} />
      {errorText ? <Text style={styles.error}>{errorText}</Text> : null}

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <Pressable style={[styles.sheet, { maxHeight }]} onPress={(event) => event.stopPropagation()}>
            <Text style={styles.sheetTitle}>{label}</Text>
            <FlatList
              data={[...options]}
              keyExtractor={(item) => item}
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              renderItem={({ item }) => (
                <TouchableOpacity
                  accessibilityRole="button"
                  activeOpacity={0.78}
                  onPress={() => {
                    onChange(item);
                    setOpen(false);
                  }}
                  style={styles.option}
                >
                  <Text style={[styles.optionText, value === item && styles.selectedText]}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  field: { marginTop: spacing.md },
  label: {
    marginBottom: spacing.xs,
    color: colors.text,
    fontSize: typography.caption,
    fontWeight: fontWeight.bold,
  },
  error: {
    marginTop: spacing.xs,
    color: colors.error,
    fontSize: typography.tiny,
    fontWeight: fontWeight.medium,
  },
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: colors.overlay,
    padding: spacing.md,
  },
  sheet: {
    overflow: 'hidden',
    borderRadius: radius.md,
    backgroundColor: colors.white,
  },
  sheetTitle: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: fontWeight.heavy,
    padding: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  option: {
    minHeight: 48,
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  optionText: {
    color: colors.text,
    fontSize: typography.small,
    fontWeight: fontWeight.medium,
  },
  selectedText: {
    fontWeight: fontWeight.heavy,
    color: colors.goldDark,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
  },
});
