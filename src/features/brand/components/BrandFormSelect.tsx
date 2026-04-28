import React from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import AppSelect from '../../../shared/components/AppSelect';
import { colors } from '../../../shared/theme/colors';
import { radius } from '../../../shared/theme/radius';
import { spacing } from '../../../shared/theme/spacing';
import { fontWeight, typography } from '../../../shared/theme/typography';

interface BrandFormSelectProps {
  label: string;
  value: string;
  options: readonly string[];
  placeholder?: string;
  onChange: (value: string) => void;
  error?: boolean;
  errorText?: string;
}

export default function BrandFormSelect({
  label,
  value,
  options,
  placeholder = 'Select',
  onChange,
  error = false,
  errorText,
}: BrandFormSelectProps) {
  const [open, setOpen] = React.useState(false);
  const { height } = useWindowDimensions();
  const modalMaxHeight = Math.min(460, Math.max(280, height * 0.72));

  const handleSelect = (nextValue: string) => {
    onChange(nextValue);
    setOpen(false);
  };

  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <AppSelect value={value} placeholder={placeholder} error={error || Boolean(errorText)} onPress={() => setOpen(true)} />
      {errorText ? <Text style={styles.error}>{errorText}</Text> : null}

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <Pressable style={[styles.sheet, { maxHeight: modalMaxHeight }]} onPress={(event) => event.stopPropagation()}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>{label}</Text>
              <TouchableOpacity accessibilityRole="button" activeOpacity={0.75} onPress={() => setOpen(false)} style={styles.closeButton}>
                <Text style={styles.closeText}>x</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={[...options]}
              keyExtractor={(item) => item}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              renderItem={({ item }) => {
                const selected = item === value;

                return (
                  <TouchableOpacity activeOpacity={0.75} onPress={() => handleSelect(item)} style={styles.option}>
                    <Text style={[styles.optionText, selected && styles.selectedText]}>{item}</Text>
                    {selected ? <Text style={styles.check}>*</Text> : null}
                  </TouchableOpacity>
                );
              }}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    marginTop: spacing.md,
  },
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
    lineHeight: 14,
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
  sheetHeader: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
    paddingLeft: spacing.md,
    paddingRight: spacing.sm,
  },
  sheetTitle: {
    flex: 1,
    color: colors.text,
    fontSize: typography.body,
    fontWeight: fontWeight.heavy,
  },
  closeButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    color: colors.mutedDark,
    fontSize: typography.bodyLarge,
    fontWeight: fontWeight.heavy,
  },
  option: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  optionText: {
    flex: 1,
    color: colors.text,
    fontSize: typography.small,
    fontWeight: fontWeight.medium,
    lineHeight: 19,
  },
  selectedText: {
    fontWeight: fontWeight.heavy,
  },
  check: {
    marginLeft: spacing.sm,
    color: colors.success,
    fontSize: typography.body,
    fontWeight: fontWeight.heavy,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
  },
});
