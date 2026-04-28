import React from 'react';
import {
  Alert,
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUser } from '@clerk/clerk-expo';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import type { AuthStackParamList } from '../../../app/navigation/types';
import { roleHeroImage } from '../../../assets/images';

type Role = 'creator' | 'brand';

export default function RoleSelectionScreen() {
  const navigation = useNavigation<NavigationProp<AuthStackParamList>>();
  const { isSignedIn, user } = useUser();
  const { width, height } = useWindowDimensions();
  const [savingRole, setSavingRole] = React.useState<Role | null>(null);

  const contentWidth = Math.min(width * 0.86, 604);
  const heroHeight = Math.min(contentWidth * 1.5, height * 0.58);
  const buttonWidth = Math.min(contentWidth * 0.88, 532);
  const topSpace = Math.max(28, Math.min(height * 0.055, 76));

  const selectRole = async (role: Role) => {
    if (!isSignedIn || !user) {
      navigation.navigate(role === 'brand' ? 'BrandSignIn' : 'CreatorSignIn');
      return;
    }

    setSavingRole(role);

    try {
      await user.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          role,
        },
      });
    } catch {
      Alert.alert('Role update failed', 'Please try selecting your account type again.');
    } finally {
      setSavingRole(null);
    }
  };

  const handleBusinessPress = () => {
    void selectRole('brand');
  };

  const handleCreatorPress = () => {
    void selectRole('creator');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.container, { paddingTop: topSpace }]}>
        <View style={[styles.heroCard, { width: contentWidth, height: heroHeight }]}>
          <View style={styles.copy}>
            <Text style={styles.heading}>
              More reach. More{'\n'}
              money. Always quality{'\n'}
              content
            </Text>

            <Text style={styles.description}>
              {isSignedIn
                ? 'Choose how you want to use Busket.'
                : 'A single place for brands and creators\nto collaborate and create impact with every\nvideo.'}
            </Text>
          </View>

          <Image source={roleHeroImage} resizeMode="contain" style={styles.heroImage} />
        </View>

        <View style={styles.buttons}>
          <TouchableOpacity
            activeOpacity={0.84}
            accessibilityRole="button"
            disabled={Boolean(savingRole)}
            onPress={handleBusinessPress}
            style={[styles.button, { width: buttonWidth }]}
          >
            {savingRole === 'brand' ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.buttonText}>I{'\u2019'}m a Business</Text>}
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.84}
            accessibilityRole="button"
            disabled={Boolean(savingRole)}
            onPress={handleCreatorPress}
            style={[styles.button, { width: buttonWidth }]}
          >
            {savingRole === 'creator' ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.buttonText}>I{'\u2019'}m a Creator</Text>}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F0F0F0',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
  },
  heroCard: {
    overflow: 'hidden',
    borderRadius: 34,
    backgroundColor: '#F6A06D',
  },
  copy: {
    paddingTop: 39,
    paddingHorizontal: 52,
  },
  heading: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '800',
    lineHeight: 33,
    letterSpacing: 0,
  },
  description: {
    marginTop: 21,
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
    letterSpacing: 0,
  },
  heroImage: {
    position: 'absolute',
    left: 22,
    right: 22,
    bottom: 22,
    width: '92%',
    height: '64%',
    alignSelf: 'center',
  },
  buttons: {
    alignItems: 'center',
    marginTop: 55,
    gap: 34,
  },
  button: {
    height: 74,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 7,
    backgroundColor: '#050505',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 27,
    letterSpacing: 0,
  },
});
