import { useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet, Platform } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, radiusExact, shadow, spacing } from '@/theme';

type PlanId = 'standard' | 'pro';
type BillingCycle = 'monthly' | 'yearly';

const PLANS = {
  standard: {
    name: '스탠다드',
    monthly: '₩2,500',
    yearly: '₩19,900',
    feats: ['가방 5개', '챙길 것 무제한', '가방 공유 (5명)', '클라우드 동기화'],
    best: true,
  },
  pro: {
    name: '프로',
    monthly: '₩3,900',
    yearly: '₩29,900',
    feats: ['가방 10개', '챙길 것 무제한', '가방 공유 (5명)', '우선 지원'],
    best: false,
  },
} as const;

/* ---------- plan card ---------- */
function PlanCard({
  planId,
  cycle,
  selected,
  onPress,
}: {
  planId: PlanId;
  cycle: BillingCycle;
  selected: boolean;
  onPress: () => void;
}) {
  const plan = PLANS[planId];
  const price = cycle === 'monthly' ? plan.monthly : plan.yearly;
  const perLabel = cycle === 'monthly' ? '/월' : '/년';

  return (
    <Pressable onPress={onPress} style={{ position: 'relative' }}>
      {plan.best && (
        <View style={cardSt.badge}>
          <Text style={cardSt.badgeText}>인기</Text>
        </View>
      )}
      <View style={[cardSt.card, selected && cardSt.cardSel]}>
        <View style={cardSt.header}>
          <Text style={cardSt.name}>{plan.name}</Text>
          <View style={[cardSt.radio, selected && cardSt.radioSel]}>
            {selected && <Ionicons name="checkmark" size={12} color="#fff" />}
          </View>
        </View>
        <View style={cardSt.priceRow}>
          <Text style={cardSt.price}>{price}</Text>
          <Text style={cardSt.per}>{perLabel}</Text>
          {cycle === 'yearly' && (
            <Text style={cardSt.discount}>(-35%)</Text>
          )}
        </View>
        <View style={cardSt.feats}>
          {plan.feats.map((f) => (
            <View key={f} style={cardSt.featRow}>
              <Ionicons name="checkmark" size={14} color={colors.accent} />
              <Text style={cardSt.featLabel}>{f}</Text>
            </View>
          ))}
        </View>
      </View>
    </Pressable>
  );
}

const cardSt = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.line,
    ...radiusExact.card,
    padding: 17,
    ...shadow.card,
  },
  cardSel: {
    borderWidth: 2,
    borderColor: colors.accent,
    shadowColor: colors.accent,
    shadowOffset: { width: 3, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 0,
    elevation: 3,
  },
  badge: {
    position: 'absolute',
    top: -11,
    right: 14,
    zIndex: 1,
    backgroundColor: colors.accent,
    borderWidth: 1.5,
    borderColor: colors.coral600,
    borderRadius: 20,
    paddingHorizontal: 9,
    paddingVertical: 3,
  },
  badgeText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  name: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.ink,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.lineStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSel: {
    backgroundColor: colors.accent,
    borderColor: colors.coral600,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
    marginBottom: 10,
  },
  price: {
    fontSize: 21,
    fontWeight: '800',
    color: colors.ink,
  },
  per: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.inkSoft,
  },
  discount: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.inkSoft,
    marginLeft: 2,
  },
  feats: {
    gap: 7,
  },
  featRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featLabel: {
    fontSize: 13.5,
    fontWeight: '500',
    color: colors.ink,
  },
});

/* ---------- billing toggle ---------- */
function BillingToggle({
  value,
  onChange,
}: {
  value: BillingCycle;
  onChange: (v: BillingCycle) => void;
}) {
  return (
    <View style={segSt.container}>
      <Pressable
        style={[segSt.tab, value === 'monthly' && segSt.tabActive]}
        onPress={() => onChange('monthly')}
      >
        <Text style={[segSt.tabText, value === 'monthly' && segSt.tabTextActive]}>월간</Text>
      </Pressable>
      <Pressable
        style={[segSt.tab, value === 'yearly' && segSt.tabActive]}
        onPress={() => onChange('yearly')}
      >
        <Text style={[segSt.tabText, value === 'yearly' && segSt.tabTextActive]}>
          연간{'  '}
          <Text style={[segSt.discount, value === 'yearly' && segSt.discountActive]}>-35%</Text>
        </Text>
      </Pressable>
    </View>
  );
}

const segSt = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 3,
    gap: 3,
    backgroundColor: colors.surface2,
    borderWidth: 1.5,
    borderColor: colors.line,
    borderRadius: 13,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    borderRadius: 10,
  },
  tabActive: {
    backgroundColor: colors.accent,
    shadowColor: '#2c2a26',
    shadowOffset: { width: 1.5, height: 2 },
    shadowOpacity: 0.16,
    shadowRadius: 0,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.inkSoft,
  },
  tabTextActive: {
    color: '#fff',
  },
  discount: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.inkSoft,
  },
  discountActive: {
    color: 'rgba(255,255,255,0.85)',
  },
});

/* ---------- main screen ---------- */
export default function PlansScreen() {
  const [selected, setSelected] = useState<PlanId>('standard');
  const [cycle, setCycle] = useState<BillingCycle>('monthly');

  const plan = PLANS[selected];

  return (
    <View style={styles.screen}>
      {/* AppBar */}
      <View style={styles.appBar}>
        <Pressable style={styles.ghostBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color={colors.ink} />
        </Pressable>
        <Text style={styles.appBarTitle}>플랜 선택</Text>
        <View style={{ flex: 1 }} />
      </View>

      <View style={styles.body}>
        <BillingToggle value={cycle} onChange={setCycle} />

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ gap: 13, paddingBottom: 16 }}
          showsVerticalScrollIndicator={false}
        >
          <PlanCard
            planId="standard"
            cycle={cycle}
            selected={selected === 'standard'}
            onPress={() => setSelected('standard')}
          />
          <PlanCard
            planId="pro"
            cycle={cycle}
            selected={selected === 'pro'}
            onPress={() => setSelected('pro')}
          />
        </ScrollView>

        {/* CTA */}
        <View style={styles.footer}>
          <Pressable style={styles.cta} onPress={() => router.back()}>
            <Text style={styles.ctaText}>
              {plan.name} 구독하기
            </Text>
          </Pressable>
          <Text style={styles.note}>언제든 해지 가능 · 자동 갱신</Text>
        </View>
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
    gap: 10,
    paddingHorizontal: spacing.screenH,
    paddingTop: Platform.OS === 'web' ? 16 : 56,
    paddingBottom: 12,
  },
  ghostBtn: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -8,
  },
  appBarTitle: {
    fontSize: 23,
    fontWeight: '800',
    color: colors.ink,
    letterSpacing: -0.5,
    lineHeight: 28,
  },
  body: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 4,
    paddingBottom: 0,
  },
  footer: {
    paddingBottom: Platform.OS === 'ios' ? 32 : 20,
    paddingTop: 14,
    gap: 10,
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
  note: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '500',
    color: colors.inkFaint,
  },
});
