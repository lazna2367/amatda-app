import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Platform,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, radiusExact, shadow, spacing } from '@/theme';

const { width: SCREEN_W } = Dimensions.get('window');
const TILE_GAP = 11;
const TILE_W = (SCREEN_W - spacing.screenH * 2 - TILE_GAP) / 2;

type CheckItem = { id: string; name: string; emoji: string; checked: boolean };

const MOCK_ITEMS: CheckItem[] = [
  { id: '1', name: '휴대폰', emoji: '📱', checked: false },
  { id: '2', name: '지갑', emoji: '👛', checked: false },
  { id: '3', name: '차 키', emoji: '🔑', checked: false },
  { id: '4', name: '사원증', emoji: '🪪', checked: false },
  { id: '5', name: '이어폰', emoji: '🎧', checked: false },
  { id: '6', name: '우산', emoji: '☂️', checked: false },
];

/* ---------- check tile ---------- */
function CheckTile({ item, onPress }: { item: CheckItem; onPress: () => void }) {
  const done = item.checked;
  return (
    <Pressable onPress={onPress} style={{ width: TILE_W }}>
      <View style={[tileSt.tile, done && tileSt.tileDone]}>
        <View style={[tileSt.ico, done && tileSt.icoDone]}>
          <Text style={tileSt.icoText}>{item.emoji}</Text>
        </View>
        <Text style={[tileSt.label, done && tileSt.labelDone]}>{item.name}</Text>
        <View style={[tileSt.circle, done && tileSt.circleDone]}>
          {done && <Ionicons name="checkmark" size={12} color="#fff" />}
        </View>
      </View>
    </Pressable>
  );
}

const tileSt = StyleSheet.create({
  tile: {
    alignItems: 'center',
    gap: 9,
    paddingTop: 16,
    paddingBottom: 13,
    paddingHorizontal: 8,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 13,
    borderBottomRightRadius: 16,
    borderBottomLeftRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.line,
    ...shadow.card,
    position: 'relative',
  },
  tileDone: {
    backgroundColor: colors.coral50,
    borderColor: colors.accent,
    shadowOpacity: 0,
    elevation: 0,
  },
  ico: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: 14,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 15,
    borderBottomLeftRadius: 11,
    backgroundColor: colors.surface2,
    borderWidth: 1.5,
    borderColor: colors.line,
  },
  icoDone: {
    backgroundColor: '#fff',
    borderColor: colors.accent,
  },
  icoText: { fontSize: 27 },
  label: {
    fontSize: 14.5,
    fontWeight: '600',
    color: colors.ink,
  },
  labelDone: {
    color: colors.coral600,
  },
  circle: {
    position: 'absolute',
    top: 9,
    right: 9,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.lineStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleDone: {
    backgroundColor: colors.accent,
    borderColor: colors.coral600,
  },
});

/* ---------- main screen ---------- */
export default function ChecklistScreen() {
  const [items, setItems] = useState<CheckItem[]>(MOCK_ITEMS);

  const doneN = items.filter((i) => i.checked).length;
  const total = items.length;
  const allDone = doneN === total;
  const progress = total > 0 ? doneN / total : 0;

  const toggle = (id: string) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, checked: !it.checked } : it)));
  };

  const checkAll = () => {
    setItems((prev) => prev.map((it) => ({ ...it, checked: true })));
  };

  return (
    <View style={styles.screen}>
      {/* AppBar */}
      <View style={styles.appBar}>
        <Pressable style={styles.ghostBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color={colors.ink} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={styles.appBarTitle}>출근 가방</Text>
          <Text style={styles.appBarSub}>떠날 때 · 집 근처</Text>
        </View>
        <View style={styles.livePill}>
          <View style={styles.liveDot} />
          <Text style={styles.livePillText}>방금</Text>
        </View>
      </View>

      <View style={styles.body}>
        {/* Progress card */}
        <View style={styles.padSection}>
          <View style={[styles.progressCard, allDone && styles.progressCardDone]}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressTitle}>{allDone ? '다 챙겼어요!' : '챙기셨나요?'}</Text>
              <Text>
                <Text style={styles.countNum}>{doneN}</Text>
                <Text style={styles.countTotal}>/{total}</Text>
              </Text>
            </View>
            {/* Progress bar */}
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${Math.round(progress * 100)}%` as any },
                ]}
              />
            </View>
            {/* 전부 챙겼어요 — 미완료 시만 표시 */}
            {!allDone && (
              <Pressable style={styles.quickDoneBtn} onPress={checkAll}>
                <Ionicons name="checkmark" size={15} color={colors.accent} />
                <Text style={styles.quickDoneBtnText}>전부 챙겼어요</Text>
              </Pressable>
            )}
          </View>
        </View>

        {/* Grid */}
        <ScrollView
          style={styles.gridScroll}
          contentContainerStyle={styles.gridContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.grid}>
            {items.map((item) => (
              <CheckTile key={item.id} item={item} onPress={() => toggle(item.id)} />
            ))}
          </View>
        </ScrollView>

        {/* Footer CTA */}
        <View style={styles.footer}>
          <Pressable
            style={[styles.cta, !allDone && styles.ctaDisabled]}
            onPress={allDone ? () => router.back() : undefined}
          >
            {allDone && <Ionicons name="checkmark" size={18} color="#fff" />}
            <Text style={[styles.ctaText, !allDone && styles.ctaTextDisabled]}>
              확인 끝 · 가방 닫기
            </Text>
          </Pressable>
          {!allDone && (
            <Pressable style={styles.skipBtn} onPress={() => router.back()}>
              <Text style={styles.skipBtnText}>미완료로 닫기</Text>
            </Pressable>
          )}
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
    fontSize: 18,
    fontWeight: '800',
    color: colors.ink,
    letterSpacing: -0.4,
    lineHeight: 22,
  },
  appBarSub: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.inkSoft,
    marginTop: 1,
  },
  livePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
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
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
  },
  body: {
    flex: 1,
  },
  padSection: {
    paddingHorizontal: spacing.screenH,
    paddingTop: 4,
    paddingBottom: 10,
  },
  progressCard: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.line,
    ...radiusExact.card,
    padding: 15,
    ...shadow.card,
  },
  progressCardDone: {
    borderColor: colors.accent,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  progressTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.ink,
  },
  countNum: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.accent,
  },
  countTotal: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.inkFaint,
  },
  progressTrack: {
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.line,
    overflow: 'hidden',
  },
  progressFill: {
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.accent,
  },
  quickDoneBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    marginTop: 12,
    paddingVertical: 10,
    borderRadius: 11,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.accent,
  },
  quickDoneBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.accent,
  },
  gridScroll: {
    flex: 1,
  },
  gridContent: {
    paddingHorizontal: spacing.screenH,
    paddingBottom: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: TILE_GAP,
  },
  footer: {
    paddingHorizontal: spacing.screenH,
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 32 : 20,
    backgroundColor: colors.paper,
    borderTopWidth: 1.5,
    borderTopColor: colors.line,
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.accent,
    borderWidth: 1.5,
    borderColor: colors.coral600,
    ...radiusExact.btn,
    paddingVertical: 14,
    ...shadow.btn,
  },
  ctaDisabled: {
    backgroundColor: colors.surface2,
    borderColor: colors.line,
    borderStyle: 'dashed',
    shadowOpacity: 0,
    elevation: 0,
  },
  ctaText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: -0.2,
  },
  ctaTextDisabled: {
    color: colors.inkFaint,
  },
  skipBtn: {
    alignItems: 'center',
    marginTop: 9,
    paddingVertical: 4,
  },
  skipBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.inkSoft,
  },
});
