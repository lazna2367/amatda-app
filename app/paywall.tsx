import { View, Text, Pressable, StyleSheet, Platform, Dimensions } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, radiusExact, shadow, spacing } from '@/theme';

const { width: SCREEN_W } = Dimensions.get('window');

/* ---------- mini bag card ---------- */
function MiniBag({
  emoji,
  name,
  left,
  top,
  rotate,
  on,
}: {
  emoji: string;
  name: string;
  left: number;
  top: number;
  rotate: string;
  on?: boolean;
}) {
  return (
    <View
      style={[
        miniBagSt.card,
        { left, top, transform: [{ rotate }] },
        on && miniBagSt.cardOn,
      ]}
    >
      <View style={[miniBagSt.ico, on && miniBagSt.icoOn]}>
        <Text style={{ fontSize: 18 }}>{emoji}</Text>
      </View>
      <View style={{ gap: 2, flex: 1, minWidth: 0 }}>
        <Text style={miniBagSt.bagName}>{name}</Text>
        <Text style={[miniBagSt.bagStatus, on && miniBagSt.bagStatusOn]}>
          {on ? '● 감지 중' : '● 꺼짐'}
        </Text>
      </View>
    </View>
  );
}

const miniBagSt = StyleSheet.create({
  card: {
    position: 'absolute',
    width: 132,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    padding: 10,
    paddingHorizontal: 12,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.line,
    ...radiusExact.card,
    ...shadow.card,
  },
  cardOn: {
    borderColor: colors.accent,
  },
  ico: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface2,
    borderWidth: 1.5,
    borderColor: colors.line,
    borderTopLeftRadius: 11,
    borderTopRightRadius: 9,
    borderBottomRightRadius: 12,
    borderBottomLeftRadius: 9,
    flexShrink: 0,
  },
  icoOn: {
    backgroundColor: colors.coral50,
    borderColor: colors.accent,
  },
  bagName: {
    fontSize: 13.5,
    fontWeight: '700',
    color: colors.ink,
  },
  bagStatus: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.inkFaint,
  },
  bagStatusOn: {
    color: colors.accent,
  },
});

/* ---------- feature row ---------- */
function FeatRow({ label }: { label: string }) {
  return (
    <View style={featSt.row}>
      <View style={featSt.badge}>
        <Ionicons name="checkmark" size={11} color={colors.coral600} />
      </View>
      <Text style={featSt.label}>{label}</Text>
    </View>
  );
}

const featSt = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  badge: {
    width: 20,
    height: 20,
    borderRadius: 6,
    backgroundColor: colors.coral50,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  label: { fontSize: 14, fontWeight: '500', color: colors.ink },
});

/* ---------- main screen ---------- */
export default function PaywallScreen() {
  const { filled } = useLocalSearchParams<{ filled?: string }>();
  const isFilled = filled !== 'false';

  const headline = isFilled
    ? { line1: '가방 2개가 꽉 찼어요', line2: '세 번째 차례예요' }
    : { line1: '무료는 가방 2개까지', line2: '세 번째부터 플랜이 필요해요' };

  const sub = isFilled
    ? '공들여 만든 가방 2개, 잘 쓰고 계시네요.\n더 담고 싶다면 플랜을 열어보세요.'
    : '가방을 더 만들면 상황별로\n더 촘촘하게 챙길 수 있어요.';

  return (
    <View style={styles.screen}>
      {/* AppBar */}
      <View style={styles.appBar}>
        <View style={{ flex: 1 }} />
        <Pressable style={styles.closeBtn} onPress={() => router.back()}>
          <Ionicons name="close" size={18} color={colors.ink} />
        </Pressable>
      </View>

      <View style={styles.body}>
        {/* Mini bag cards */}
        <View style={styles.bagsArea}>
          <MiniBag emoji="💼" name="출근 가방" left={28} top={4} rotate="-7deg" on />
          <MiniBag emoji="🏋️" name="헬스장" left={148} top={isFilled ? 4 : 12} rotate="6deg" on={isFilled} />
        </View>

        {/* Headline */}
        <Text style={styles.headline}>
          {headline.line1}{'\n'}
          <Text style={styles.headlineMark}>{headline.line2}</Text>
        </Text>

        {/* Sub */}
        <Text style={styles.sub}>{sub}</Text>

        <View style={{ flex: 1 }} />

        {/* Plan summary card */}
        <View style={styles.planCard}>
          <View style={styles.planCardHeader}>
            <Text style={styles.planName}>스탠다드</Text>
            <Text>
              <Text style={styles.planPrice}>₩2,500</Text>
              <Text style={styles.planPer}>/월</Text>
            </Text>
          </View>
          <View style={styles.feats}>
            <FeatRow label="가방 5개까지" />
            <FeatRow label="챙길 것 무제한" />
            <FeatRow label="가방 공유 5명" />
          </View>
        </View>

        {/* CTA */}
        <Pressable style={styles.cta} onPress={() => router.push('/plans')}>
          <Text style={styles.ctaText}>플랜 선택하기</Text>
        </Pressable>

        <Pressable style={styles.skipBtn} onPress={() => router.back()}>
          <Text style={styles.skipBtnText}>지금은 괜찮아요</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.screenH,
    paddingTop: Platform.OS === 'web' ? 16 : 56,
    paddingBottom: 8,
  },
  closeBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface2,
    borderWidth: 1.5,
    borderColor: colors.line,
    borderRadius: 10,
  },
  body: {
    flex: 1,
    paddingHorizontal: 22,
    paddingBottom: 28,
  },
  bagsArea: {
    height: 96,
    position: 'relative',
    marginTop: 4,
    marginBottom: 22,
    alignSelf: 'stretch',
  },
  headline: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
    lineHeight: 34,
    textAlign: 'center',
    color: colors.ink,
  },
  headlineMark: {
    backgroundColor: colors.mark,
    overflow: 'hidden',
  },
  sub: {
    marginTop: 12,
    fontSize: 14.5,
    fontWeight: '500',
    color: colors.inkSoft,
    lineHeight: 23,
    textAlign: 'center',
  },
  planCard: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.accent,
    ...radiusExact.card,
    padding: 16,
    marginBottom: 12,
    ...shadow.card,
  },
  planCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 11,
  },
  planName: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.ink,
  },
  planPrice: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.ink,
  },
  planPer: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.inkSoft,
  },
  feats: {
    gap: 8,
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
    marginTop: 11,
    paddingVertical: 4,
  },
  skipBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.inkSoft,
  },
});
