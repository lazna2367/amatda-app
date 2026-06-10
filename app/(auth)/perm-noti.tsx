import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, radiusExact, shadow } from '@/theme';

function BulletRow({ label }: { label: string }) {
  return (
    <View style={permSt.bullet}>
      <View style={permSt.bulletBadge}>
        <Ionicons name="checkmark" size={12} color={colors.coral600} />
      </View>
      <Text style={permSt.bulletText}>{label}</Text>
    </View>
  );
}

const permSt = StyleSheet.create({
  bullet: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 11,
    paddingHorizontal: 14,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.line,
    borderRadius: 13,
  },
  bulletBadge: {
    width: 26,
    height: 26,
    borderRadius: 8,
    backgroundColor: colors.coral50,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  bulletText: {
    fontSize: 13.5,
    fontWeight: '500',
    color: colors.ink,
    flex: 1,
  },
});

export default function PermNotiScreen() {
  return (
    <View style={styles.screen}>
      <View style={styles.body}>
        {/* Icon */}
        <View style={styles.iconWrap}>
          <Ionicons name="notifications-outline" size={38} color={colors.accent} />
        </View>

        {/* Text */}
        <Text style={styles.title}>알림을 켜 주세요</Text>
        <Text style={styles.sub}>
          '빠뜨린 거 없죠?' 알림이 와야{'\n'}체크리스트를 띄울 수 있어요.
        </Text>

        {/* Bullets */}
        <View style={styles.bullets}>
          <BulletRow label="집 나설 때 챙길 것 체크리스트" />
          <BulletRow label="도착하면 챙길 것 알림" />
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Pressable
          style={styles.cta}
          onPress={() => router.replace('/(tabs)/bags')}
        >
          <Text style={styles.ctaText}>알림 켜기</Text>
        </Pressable>
        <Pressable
          style={styles.skipBtn}
          onPress={() => router.replace('/(tabs)/bags')}
        >
          <Text style={styles.skipText}>이게 없으면 앱이 조용해요</Text>
        </Pressable>
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
    paddingBottom: 30,
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 18,
  },
  iconWrap: {
    width: 86,
    height: 86,
    borderRadius: 26,
    backgroundColor: colors.coral50,
    borderWidth: 1.5,
    borderColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 23,
    fontWeight: '800',
    color: colors.ink,
    letterSpacing: -0.5,
    lineHeight: 30,
    textAlign: 'center',
  },
  sub: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.inkSoft,
    lineHeight: 25,
    textAlign: 'center',
  },
  bullets: {
    width: '100%',
    gap: 10,
    marginTop: 4,
  },
  footer: {
    gap: 11,
  },
  cta: {
    backgroundColor: colors.accent,
    borderWidth: 1.5,
    borderColor: colors.coral600,
    ...radiusExact.btn,
    paddingVertical: 14,
    alignItems: 'center',
    ...shadow.btn,
  },
  ctaText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: -0.2,
  },
  skipBtn: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  skipText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.inkSoft,
  },
});
