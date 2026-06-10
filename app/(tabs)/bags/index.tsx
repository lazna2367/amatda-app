import { View, Text, ScrollView, Pressable, StyleSheet, Platform } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import { BagCard, type BagItem } from '@/components/BagCard';
import { colors, radiusExact, shadow, spacing } from '@/theme';

type Bag = {
  id: string;
  name: string;
  emoji: string;
  items: BagItem[];
  triggerLabel: string;
  place?: string;
  lastChecked?: string;
  active: boolean;
};

// 임시 목 데이터 — Supabase 연동 전
const MOCK_BAGS: Bag[] = [
  {
    id: '1',
    name: '출근 가방',
    emoji: '💼',
    triggerLabel: '떠날 때',
    place: '집 · 합정동',
    lastChecked: '오늘 08:12 챙김',
    active: true,
    items: [
      { id: '1', name: '휴대폰', emoji: '📱' },
      { id: '2', name: '지갑', emoji: '👛' },
      { id: '3', name: '차 키', emoji: '🔑' },
      { id: '4', name: '사원증', emoji: '🪪' },
      { id: '5', name: '이어폰', emoji: '🎧' },
      { id: '6', name: '우산', emoji: '☂️' },
    ],
  },
];

const FREE_PACK_LIMIT = 2;

export default function BagListScreen() {
  const [bags, setBags] = useState<Bag[]>(MOCK_BAGS);
  const activeCount = bags.filter((b) => b.active).length;

  const toggleActive = (id: string, value: boolean) => {
    setBags((prev) => prev.map((b) => (b.id === id ? { ...b, active: value } : b)));
  };

  const handleAddBag = () => {
    if (bags.length >= FREE_PACK_LIMIT) {
      router.push('/paywall');
      return;
    }
    router.push('/(tabs)/bags/new');
  };

  return (
    <View style={styles.screen}>
      {/* 앱바 */}
      <View style={styles.appBar}>
        <View>
          <Text style={styles.brandTitle}>아맞다</Text>
          <Text style={styles.brandSub}>빠뜨린 거 없죠?</Text>
        </View>
        <Pressable style={styles.iconBtn} onPress={handleAddBag}>
          <Text style={styles.iconBtnText}>＋</Text>
        </Pressable>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {bags.length === 0 ? (
          <EmptyState onAdd={handleAddBag} />
        ) : (
          <>
            {/* 요약 행 */}
            <View style={styles.summaryRow}>
              <Text style={styles.summaryText}>내 가방 {bags.length}개</Text>
              {activeCount > 0 && (
                <View style={styles.livePill}>
                  <View style={styles.liveDot} />
                  <Text style={styles.livePillText}>{activeCount}개 감지 중</Text>
                </View>
              )}
            </View>

            {/* 가방 카드 목록 */}
            {bags.map((bag) => (
              <BagCard
                key={bag.id}
                name={bag.name}
                emoji={bag.emoji}
                items={bag.items}
                triggerLabel={bag.triggerLabel}
                place={bag.place}
                lastChecked={bag.lastChecked}
                active={bag.active}
                onToggle={(v) => toggleActive(bag.id, v)}
                onPress={() => router.push(`/(tabs)/bags/${bag.id}`)}
              />
            ))}

            {/* 가방 추가 카드 */}
            <Pressable onPress={handleAddBag}>
              <View style={styles.addCard}>
                <Text style={styles.addCardIcon}>＋</Text>
                <Text style={styles.addCardLabel}>가방 추가</Text>
                {bags.length >= FREE_PACK_LIMIT && (
                  <Text style={styles.addCardHint}>3개째부터 프로</Text>
                )}
              </View>
            </Pressable>
          </>
        )}
      </ScrollView>
    </View>
  );
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <View style={emptyStyles.container}>
      <View style={emptyStyles.art}>
        <Text style={[emptyStyles.chip, { transform: [{ rotate: '-9deg' }], top: 18, left: 6 }]}>👛 지갑</Text>
        <Text style={[emptyStyles.chip, { transform: [{ rotate: '7deg' }], top: 4, right: 2 }]}>🔑 차 키</Text>
        <Text style={[emptyStyles.chipSel, { transform: [{ rotate: '-3deg' }], bottom: 4, left: 22 }]}>📱 휴대폰</Text>
      </View>
      <Text style={emptyStyles.title}>아직 가방이 없어요</Text>
      <Text style={emptyStyles.body}>
        가방을 만들고 챙길 것·위치를 정해두면,{'\n'}집을 나설 때 알아서 "챙기셨나요?"를 띄워줄게요.
      </Text>
      <Pressable style={emptyStyles.btn} onPress={onAdd}>
        <Text style={emptyStyles.btnText}>＋ 첫 가방 만들기</Text>
      </Pressable>
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
    justifyContent: 'space-between',
    paddingHorizontal: spacing.screenH,
    paddingTop: Platform.OS === 'web' ? 16 : 56,
    paddingBottom: 12,
  },
  brandTitle: {
    fontSize: 23,
    fontWeight: '800',
    color: colors.ink,
    letterSpacing: -0.5,
    lineHeight: 28,
  },
  brandSub: {
    fontSize: 12.5,
    fontWeight: '500',
    color: colors.inkSoft,
    marginTop: 2,
  },
  iconBtn: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.line,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 11,
    borderBottomRightRadius: 13,
    borderBottomLeftRadius: 11,
    ...shadow.card,
  },
  iconBtnText: {
    fontSize: 20,
    color: colors.ink,
    lineHeight: 24,
    fontWeight: '400',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.screenH,
    paddingBottom: 32,
    gap: 13,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  summaryText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.inkSoft,
  },
  livePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 4,
    backgroundColor: colors.accent,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colors.coral600,
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  livePillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
  },
  addCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 15,
    borderWidth: 1.5,
    borderColor: colors.lineStrong,
    borderStyle: 'dashed',
    ...radiusExact.card,
    backgroundColor: 'transparent',
  },
  addCardIcon: {
    fontSize: 18,
    color: colors.inkSoft,
  },
  addCardLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.inkSoft,
  },
  addCardHint: {
    fontSize: 11,
    color: colors.inkFaint,
  },
});

const emptyStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 36,
    paddingBottom: 40,
    gap: 16,
    marginTop: 60,
  },
  art: {
    width: 132,
    height: 110,
    position: 'relative',
  },
  chip: {
    position: 'absolute',
    fontSize: 14,
    fontWeight: '600',
    color: colors.ink,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.ink,
    paddingVertical: 5,
    paddingHorizontal: 10,
    ...radiusExact.chip,
    ...shadow.sticker,
  },
  chipSel: {
    position: 'absolute',
    fontSize: 14,
    fontWeight: '600',
    color: colors.ink,
    backgroundColor: colors.coral50,
    borderWidth: 1.5,
    borderColor: colors.accent,
    paddingVertical: 5,
    paddingHorizontal: 10,
    ...radiusExact.chip,
    ...shadow.sticker,
  },
  title: {
    fontSize: 21,
    fontWeight: '800',
    color: colors.ink,
    letterSpacing: -0.4,
    marginTop: 8,
  },
  body: {
    fontSize: 14.5,
    color: colors.inkSoft,
    lineHeight: 23,
    textAlign: 'center',
  },
  btn: {
    marginTop: 6,
    paddingVertical: 14,
    paddingHorizontal: 22,
    backgroundColor: colors.accent,
    borderWidth: 1.5,
    borderColor: colors.coral600,
    ...radiusExact.btn,
    ...shadow.btn,
  },
  btnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: -0.2,
  },
});
