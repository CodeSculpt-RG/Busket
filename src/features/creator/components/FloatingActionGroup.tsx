import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../../../shared/theme/colors';
import { fontWeight } from '../../../shared/theme/typography';

interface FloatingActionGroupProps {
  onAddPress: () => void;
  onBookmarkPress: () => void;
  onSharePress: () => void;
}

export default function FloatingActionGroup({ onAddPress, onBookmarkPress, onSharePress }: FloatingActionGroupProps) {
  return (
    <View style={styles.row}>
      <Action icon="+" onPress={onAddPress} />
      <Action icon="⌑" onPress={onBookmarkPress} large />
      <Action icon="⌘" onPress={onSharePress} />
    </View>
  );
}

function Action({ icon, onPress, large = false }: { icon: string; onPress: () => void; large?: boolean }) {
  return (
    <TouchableOpacity activeOpacity={0.82} onPress={onPress} style={[styles.button, large && styles.large]}>
      <Text style={styles.icon}>{icon}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 72,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 18,
  },
  button: {
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 26,
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.45)',
  },
  large: {
    width: 66,
    height: 66,
    borderRadius: 33,
  },
  icon: {
    color: colors.white,
    fontSize: 28,
    fontWeight: fontWeight.medium,
  },
});
