import { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Platform, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, radiusExact, shadow, spacing } from '@/theme';

const { width: SCREEN_W } = Dimensions.get('window');

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

/* ---------- small sticker chip ---------- */
function StickerChip({ emoji, label, selected }: { emoji: string; label: string; selected?: boolean }) {
  return (
    <View style={[chipSt.chip, selected && chipSt.chipSel]}>
      <View style={[chipSt.ico, selected && chipSt.icoSel]}>
        <Text style={{ fontSize: 13 }}>{emoji}</Text>
      </View>
      <Text style={[chipSt.label, selected && chipSt.labelSel]}>{label}</Text>
    </View>
  );
}

const chipSt = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 5,
    paddingLeft: 5,
    paddingRight: 10,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.ink,
    ...radiusExact.chip,
    ...shadow.sticker,
  },
  chipSel: {
    backgroundColor: colors.coral50,
    borderColor: colors.accent,
  },
  ico: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface2,
    borderWidth: 1.5,
    borderColor: colors.line,
    ...radiusExact.tile,
  },
  icoSel: {
    backgroundColor: colors.mark,
    borderColor: colors.accent,
  },
  label: { fontSize: 13, fontWeight: '600', color: colors.ink },
  labelSel: { color: colors.accent },
});

/* ---------- step 1 art ---------- */
function Art1() {
  return (
    <View style={{ width: 180, height: 180, position: 'relative', alignItems: 'center', justifyContent: 'center' }}>
      <AppIcon size={104} />
      <View style={{ position: 'absolute', left: -10, top: 6, transform: [{ rotate: '-12deg' }] }}>
        <StickerChip emoji="👛" label="지갑" />
      </View>
      <View style={{ position: 'absolute', right: -18, top: 40, transform: [{ rotate: '8deg' }] }}>
        <StickerChip emoji="🔑" label="차 키" />
      </View>
      <View style={{ position: 'absolute', left: 4, bottom: -6, transform: [{ rotate: '-4deg' }] }}>
        <StickerChip emoji="📱" label="휴대폰" selected />
      </View>
    </View>
  );
}

/* ---------- step 2 art ---------- */
function Art2() {
  return (
    <View style={art2St.card}>
      <View style={art2St.header}>
        <View style={art2St.emoji}>
          <Text style={{ fontSize: 23 }}>💼</Text>
        </View>
        <View style={{ gap: 3, flex: 1 }}>
          <Text style={art2St.bagName}>출근 가방</Text>
          <Text style={art2St.bagStatus}>● 감지 중</Text>
        </View>
      </View>
      <View style={art2St.chips}>
        {[{ e: '📱', l: '휴대폰' }, { e: '👛', l: '지갑' }, { e: '🔑', l: '차 키' }].map(({ e, l }) => (
          <View key={l} style={art2St.chip}>
            <View style={art2St.chipIco}><Text style={{ fontSize: 12 }}>{e}</Text></View>
            <Text style={art2St.chipLabel}>{l}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const art2St = StyleSheet.create({
  card: {
    width: 230,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.line,
    ...radiusExact.card,
    padding: 16,
    ...shadow.card,
  },
  header: { flexDirection: 'row', alignItems: 'center', gap: 11, marginBottom: 12 },
  emoji: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.coral50,
    borderWidth: 1.5,
    borderColor: colors.accent,
    borderTopLeftRadius: 13,
    borderTopRightRadius: 11,
    borderBottomRightRadius: 14,
    borderBottomLeftRadius: 11,
  },
  bagName: { fontSize: 16, fontWeight: '700', color: colors.ink },
  bagStatus: { fontSize: 12, fontWeight: '700', color: colors.accent },
  chips: { flexDirection: 'row', gap: 7, flexWrap: 'wrap' },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 4,
    paddingLeft: 4,
    paddingRight: 9,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.ink,
    borderTopLeftRadius: 11,
    borderTopRightRadius: 9,
    borderBottomRightRadius: 11,
    borderBottomLeftRadius: 9,
    ...shadow.sticker,
  },
  chipIco: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface2,
    borderRadius: 6,
  },
  chipLabel: { fontSize: 12.5, fontWeight: '600', color: colors.ink },
});

/* ---------- step 3 art ---------- */
function Art3() {
  return (
    <View style={art3St.map}>
      <View style={[StyleSheet.absoluteFillObject as any, { backgroundColor: '#faf8f2' }]} />
      {/* Roads */}
      <View style={{ position: 'absolute', left: 0, right: 0, top: '56%', height: 10, backgroundColor: '#fff', borderWidth: 0.5, borderColor: '#e4e0d4' }} />
      <View style={{ position: 'absolute', top: 0, bottom: 0, left: '35%', width: 9, backgroundColor: '#fff', borderWidth: 0.5, borderColor: '#e4e0d4' }} />
      {/* Geofence */}
      <View style={art3St.geo} />
      {/* Pin */}
      <View style={art3St.pin}>
        <Ionicons name="location" size={22} color={colors.accent} />
      </View>
    </View>
  );
}

const art3St = StyleSheet.create({
  map: {
    width: 200,
    height: 150,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 16,
    borderBottomRightRadius: 19,
    borderBottomLeftRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.ink,
    overflow: 'hidden',
    position: 'relative',
  },
  geo: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.accent,
    backgroundColor: 'rgba(232,103,74,0.10)',
    left: '50%',
    top: '50%',
    marginLeft: -45,
    marginTop: -45,
  },
  pin: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    marginLeft: -11,
    marginTop: -22,
  },
});

/* ---------- step data ---------- */
const STEPS = [
  {
    art: <Art1 />,
    title1: '나설 때마다 ',
    mark: '빠뜨리는',
    title2: ' 그거',
    body: '휴대폰, 지갑, 차 키… 매번 \'아 맞다!\' 하죠.\n아맞다가 대신 기억할게요.',
    cta: '시작하기',
  },
  {
    art: <Art2 />,
    title1: '가방으로 ',
    mark: '묶어서',
    title2: ' 한 번에',
    body: '출근 가방, 헬스장 가방…\n챙길 것을 가방에 담아두면 상황별로 딱 맞게 알려줘요.',
    cta: '다음',
  },
  {
    art: <Art3 />,
    title1: '집을 나서면 ',
    mark: '알아서',
    title2: ' 띄워요',
    body: '위치를 정해두면, 그 구역을 벗어날 때\n자동으로 체크리스트를 보내드려요.',
    cta: '시작하기',
  },
];

/* ---------- main screen ---------- */
export default function OnboardingScreen() {
  const [step, setStep] = useState(0);
  const current = STEPS[step];

  const handleCta = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      router.replace('/(auth)/login');
    }
  };

  return (
    <View style={styles.screen}>
      {/* Skip */}
      <View style={styles.topBar}>
        <View style={{ flex: 1 }} />
        {step < STEPS.length - 1 && (
          <Pressable onPress={() => router.replace('/(auth)/login')}>
            <Text style={styles.skip}>건너뛰기</Text>
          </Pressable>
        )}
      </View>

      {/* Art area */}
      <View style={styles.artArea}>
        {current.art}
      </View>

      {/* Text */}
      <View style={styles.textArea}>
        <Text style={styles.headline}>
          {current.title1}
          <Text style={styles.mark}>{current.mark}</Text>
          {current.title2}
        </Text>
        <Text style={styles.body}>{current.body}</Text>
      </View>

      {/* Dots */}
      <View style={styles.dots}>
        {STEPS.map((_, i) => (
          <View key={i} style={[styles.dot, i === step && styles.dotActive]} />
        ))}
      </View>

      {/* CTA */}
      <View style={styles.footer}>
        <Pressable style={styles.cta} onPress={handleCta}>
          <Text style={styles.ctaText}>{current.cta}</Text>
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
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 32,
    marginBottom: 8,
  },
  skip: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.inkSoft,
  },
  artArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textArea: {
    alignItems: 'center',
    gap: 11,
  },
  headline: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
    lineHeight: 31,
    textAlign: 'center',
    color: colors.ink,
  },
  mark: {
    backgroundColor: colors.mark,
    overflow: 'hidden',
  },
  body: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.inkSoft,
    lineHeight: 25,
    textAlign: 'center',
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 7,
    marginVertical: 22,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.lineStrong,
  },
  dotActive: {
    width: 22,
    backgroundColor: colors.accent,
  },
  footer: {},
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
});
