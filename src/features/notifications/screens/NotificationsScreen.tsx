import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import NotificationItem from '../components/NotificationItem';
import AppScreen from '../../../shared/components/AppScreen';
import { creatorNotifications } from '../../../shared/constants/mockCreatorData';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';
import { fontWeight, typography } from '../../../shared/theme/typography';
import { radius } from '../../../shared/theme/radius';

export default function NotificationsScreen() {
  const navigation = useNavigation();

  return (
    <AppScreen style={styles.screen}>
      <View style={styles.header}>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Go back"
          activeOpacity={0.82}
          onPress={() => navigation.goBack()}
          style={styles.iconButton}
        >
          <MaterialCommunityIcons name="arrow-left" size={23} color={colors.black} />
        </TouchableOpacity>
        <Text style={styles.title}>Notification</Text>
        <View style={styles.headerSpacer} />
      </View>

      <FlatList
        data={creatorNotifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <NotificationItem notification={item} />}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.background,
  },
  header: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.screen,
    backgroundColor: colors.background,
  },
  iconButton: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    backgroundColor: colors.white,
  },
  title: {
    flex: 1,
    color: colors.text,
    fontSize: typography.body,
    fontWeight: fontWeight.heavy,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 38,
  },
  list: {
    paddingHorizontal: 40,
    paddingTop: spacing.lg,
    paddingBottom: 80,
  },
});
