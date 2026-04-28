import React from 'react';
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AppSelect from '../../../shared/components/AppSelect';
import { colors } from '../../../shared/theme/colors';
import { radius } from '../../../shared/theme/radius';
import { spacing } from '../../../shared/theme/spacing';
import { fontWeight, typography } from '../../../shared/theme/typography';

const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

const formatDate = (date: Date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${day}/${month}/${date.getFullYear()}`;
};

const parseDate = (value: string) => {
  const [day, month, year] = value.split('/').map(Number);

  if (!day || !month || !year) {
    return undefined;
  }

  return new Date(year, month - 1, day);
};

interface CampaignDateFieldProps {
  label: string;
  value: string;
  minDate?: string;
  errorText?: string;
  onChange: (value: string) => void;
}

export default function CampaignDateField({ label, value, minDate, errorText, onChange }: CampaignDateFieldProps) {
  const [open, setOpen] = React.useState(false);
  const selectedDate = parseDate(value);
  const [viewDate, setViewDate] = React.useState(selectedDate ?? new Date());
  const min = minDate ? parseDate(minDate) : undefined;

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const monthStart = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const blanks = Array.from({ length: monthStart.getDay() }, (_, index) => `blank-${index}`);
  const days = Array.from({ length: daysInMonth }, (_, index) => index + 1);

  const isDisabled = (day: number) => {
    if (!min) {
      return false;
    }

    const date = new Date(year, month, day);
    return date < new Date(min.getFullYear(), min.getMonth(), min.getDate());
  };

  const selectDay = (day: number) => {
    if (isDisabled(day)) {
      return;
    }

    onChange(formatDate(new Date(year, month, day)));
    setOpen(false);
  };

  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <AppSelect value={value} placeholder="dd/mm/yyyy" error={Boolean(errorText)} onPress={() => setOpen(true)} />
      {errorText ? <Text style={styles.error}>{errorText}</Text> : null}

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <Pressable style={styles.calendar} onPress={(event) => event.stopPropagation()}>
            <View style={styles.monthRow}>
              <TouchableOpacity accessibilityRole="button" onPress={() => setViewDate(new Date(year, month - 1, 1))} style={styles.navButton}>
                <Text style={styles.navText}>{'<'}</Text>
              </TouchableOpacity>
              <Text style={styles.monthText}>{viewDate.toLocaleString('en-US', { month: 'long', year: 'numeric' })}</Text>
              <TouchableOpacity accessibilityRole="button" onPress={() => setViewDate(new Date(year, month + 1, 1))} style={styles.navButton}>
                <Text style={styles.navText}>{'>'}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.grid}>
              {weekDays.map((day, index) => (
                <Text key={`${day}-${index}`} style={styles.weekDay}>{day}</Text>
              ))}
              {blanks.map((blank) => <View key={blank} style={styles.dayCell} />)}
              {days.map((day) => {
                const disabled = isDisabled(day);
                const selected = selectedDate?.getDate() === day && selectedDate.getMonth() === month && selectedDate.getFullYear() === year;

                return (
                  <TouchableOpacity
                    key={day}
                    accessibilityRole="button"
                    disabled={disabled}
                    activeOpacity={0.78}
                    onPress={() => selectDay(day)}
                    style={[styles.dayCell, selected && styles.selectedDay, disabled && styles.disabledDay]}
                  >
                    <Text style={[styles.dayText, selected && styles.selectedDayText, disabled && styles.disabledDayText]}>{day}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
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
  calendar: {
    borderRadius: radius.md,
    backgroundColor: colors.white,
    padding: spacing.md,
  },
  monthRow: {
    minHeight: 42,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  navButton: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceMuted,
  },
  navText: {
    color: colors.text,
    fontSize: typography.bodyLarge,
    fontWeight: fontWeight.heavy,
  },
  monthText: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: fontWeight.heavy,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.sm,
  },
  weekDay: {
    width: `${100 / 7}%`,
    color: colors.muted,
    fontSize: typography.caption,
    fontWeight: fontWeight.bold,
    textAlign: 'center',
    paddingVertical: spacing.xs,
  },
  dayCell: {
    width: `${100 / 7}%`,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.sm,
  },
  selectedDay: {
    backgroundColor: colors.gold,
  },
  disabledDay: {
    opacity: 0.34,
  },
  dayText: {
    color: colors.text,
    fontSize: typography.small,
    fontWeight: fontWeight.bold,
  },
  selectedDayText: {
    color: colors.black,
    fontWeight: fontWeight.heavy,
  },
  disabledDayText: {
    color: colors.muted,
  },
});
