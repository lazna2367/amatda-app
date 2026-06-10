import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, radiusExact, shadow, spacing } from '@/theme';

/* ---------- app icon ---------- */
function AppIcon({ size = 92 }: { size?: number }) {
  const r = Math.round(size * 0.226);
  return (
    <View style={[iconSt.icon, { width: size, height: size, borderRadius: r }]}>
      <Ionicons name="location" size={size * 0.44} color="#fff" />
      <Text style={[iconSt.bang, { fontSize: size * 0.19 }]}>!</Text>
    </View>
  );
}

const iconSt = StyleSheet.create({
  icon: {
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2c2a26',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 14,
    elevation: 8,
  },
  bang: {
    position: 'absolute',
    bottom: '18%',
    right: '20%',
    fontWeight: '900',
    color: '#fff',
    lineHeight: 18,
  },
});

/* ---------- social button ---------- */
function SocialBtn({
  bg,
  borderColor,
  textColor,
  icon,
  label,
  onPress,
}: {
  bg: string;
  borderColor?: string;
  textColor: string;
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={[
        btnSt.btn,
        { backgroundColor: bg, borderColor: borderColor ?? bg },
      ]}
      onPress={onPress}
    >
      <View style={{ width: 22, alignItems: 'center' }}>{icon}</View>
      <Text style={[btnSt.label, { color: textColor }]}>{label}</Text>
    </Pressable>
  );
}

const btnSt = StyleSheet.create({
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 14,
    borderWidth: 1.5,
    ...radiusExact.btn,
    shadowColor: '#2c2a26',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 0,
    elevation: 1,
  },
  label: {
    fontSize: 15.5,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
});

/* ---------- main screen ---------- */
export default function LoginScreen() {
  const handleLogin = () => {
    router.replace('/(auth)/perm-location');
  };

  return (
    <View style={styles.screen}>
      {/* Brand area */}
      <View style={styles.brand}>
        <AppIcon size={92} />
        <View style={styles.brandText}>
          <Text style={styles.appName}>아맞다</Text>
          <Text style={styles.slogan}>빠뜨린 거 없죠?</Text>
        </View>
      </View>

      {/* Login buttons */}
      <View style={styles.buttons}>
        <SocialBtn
          bg="#FEE500"
          textColor="#191600"
          icon={<Text style={{ fontSize: 17 }}>💬</Text>}
          label="카카오로 시작"
          onPress={handleLogin}
        />
        <SocialBtn
          bg="#fff"
          borderColor={colors.lineStrong}
          textColor={colors.ink}
          icon={<Ionicons name="logo-google" size={18} color="#4285F4" />}
          label="Google로 시작"
          onPress={handleLogin}
        />
        <SocialBtn
          bg="#1d1b18"
          textColor="#fff"
          icon={<Ionicons name="logo-apple" size={19} color="#fff" />}
          label="Apple로 시작"
          onPress={handleLogin}
        />
        <Text style={styles.terms}>
          계속하면{' '}
          <Text style={styles.termsLink}>이용약관</Text>과{' '}
          <Text style={styles.termsLink}>개인정보처리방침</Text>에{'\n'}동의하는 것으로 간주돼요.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.paper,
    paddingHorizontal: 26,
    paddingTop: Platform.OS === 'web' ? 16 : 56,
    paddingBottom: 34,
    alignItems: 'center',
  },
  brand: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  brandText: {
    alignItems: 'center',
    gap: 5,
  },
  appName: {
    fontSize: 38,
    fontWeight: '800',
    color: colors.ink,
    letterSpacing: -1,
    lineHeight: 42,
  },
  slogan: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.inkSoft,
  },
  buttons: {
    width: '100%',
    gap: 11,
  },
  terms: {
    marginTop: 6,
    fontSize: 12.5,
    fontWeight: '500',
    color: colors.inkSoft,
    textAlign: 'center',
    lineHeight: 20,
  },
  termsLink: {
    textDecorationLine: 'underline',
    color: colors.inkSoft,
  },
});
