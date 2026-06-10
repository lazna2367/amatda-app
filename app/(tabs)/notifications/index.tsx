import { View, Text, ScrollView, Pressable, StyleSheet, Platform } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, radiusExact, shadow, spacing } from '@/theme';

type NotiStatus = 'pending' | 'done';

type NotiRecord = {
  id: string;
  bagId: string;
  bagName: string;
  bagEmoji: string;
  time: string;
  status: NotiStatus;
  checked?: number;
  total?: number;
};

const MOCK_ACTIVE_BAGS = ['출근 가방'];

const MOCK_NOTIFS: NotiRecord[] = [
  {
    id: 'n1',
    bagId: '1',
    bagName: '출근 가방',
    bagEmoji: '💼',
    time: '방금',
    status: 'pending',
    total: 6,
  },
  {
    id: 'n2',
    bagId: '1',
    bagName: '출근 가방',
    bagEmoji: '💼',
    time: '어제 08:09',
    status: 'done',
    checked: 6,
    total: 6,
  },
  {
    id: 'n3',
    bagId: '1',
    bagName: '출근 가방',
    bagEmoji: '💼',
    time: '2일 전 08:22',
    status: 'done',
    checked: 5,
    total: 6,
  },
];

export default function NotificationsScreen() {
  const activeCount = MOCK_ACTIVE_BAGS.length;

  return (
    <View style={styles.screen}>
      {/* AppBar */}
      <View style={styles.appBar}>
        <View>
          <Text style={styles.appBarTitle}>알림</Text>
          <Text style={styles.appBarSub}>출발·도착 감지 기록</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 감지 상태 카드 */}
        <View style={[styles.statusCard, activeCount > 0 && styles.statusCardActive]}>
          <View style={styles.statusRow}>
            <View style={[styles.statusDot, activeCount > 0 && styles.statusDotActive]} />
            <View style={{ flex: 1, gap: 2 }}>
              <Text style={styles.statusTitle}>
                {activeCount > 0 ? `${activeCount}개 가방 감지 중` : '감지 중인 가방이 없어요'}
              </Text>
              <Text style={styles.statusSub}>
                {activeCount > 0
                  ? MOCK_ACTIVE_BAGS.join(' · ')
                  : '내 가방에서 토글을 켜면 감지를 시작해요'}
              </Text>
            </View>
          </View>
        </View>

        {/* 체험 카드 */}
        <Pressable
          style={styles.previewCard}
          onPress={() => router.push('/checklist')}
        >
          <View style={styles.previewIcon}>
            <Text style={{ fontSize: 22 }}>🚶</Text>
          </View>
          <View style={{ flex: 1, gap: 3 }}>
            <Text style={styles.previewTitle}>지금 집을 나선다면?</Text>
            <Text style={styles.previewSub}>출발 알림이 어떻게 오는지 미리보기</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.accent} />
        </Pressable>

        {/* 최근 기록 */}
        <Text style={styles.sectionLabel}>최근 기록</Text>
        <View style={styles.notiList}>
          {MOCK_NOTIFS.map((n) => {
            const pending = n.status === 'pending';
            return (
              <Pressable
                key={n.id}
                style={[styles.notiCard, pending && styles.notiCardPending]}
                onPress={pending ? () => router.push('/checklist') : undefined}
              >
                <View style={styles.notiEmoji}>
                  <Text style={{ fontSize: 21 }}>{n.bagEmoji}</Text>
                </View>
                <View style={{ flex: 1, gap: 3 }}>
                  <View style={styles.notiTopRow}>
                    <Text style={styles.notiBagName}>{n.bagName}</Text>
                    <Text style={styles.notiTime}>{n.time}</Text>
                  </View>
                  {pending ? (
                    <Text style={styles.notiStatusPending}>● 집을 나섬 · 확인 필요</Text>
                  ) : (
                    <Text style={styles.notiStatusDone}>✓ {n.checked}/{n.total} 챙김 완료</Text>
                  )}
                </View>
                {pending && (
                  <Ionicons name="chevron-forward" size={18} color={colors.accent} />
                )}
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  appBar: {
    paddingHorizontal: spacing.screenH,
    paddingTop: Platform.OS === 'web' ? 16 : 56,
    paddingBottom: 12,
  },
  appBarTitle: {
    fontSize: 23,
    fontWeight: '800',
    color: colors.ink,
    letterSpacing: -0.5,
    lineHeight: 28,
  },
  appBarSub: {
    fontSize: 12.5,
    fontWeight: '500',
    color: colors.inkSoft,
    marginTop: 2,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.screenH,
    paddingBottom: 32,
    gap: 14,
  },
  /* 감지 상태 */
  statusCard: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.line,
    ...radiusExact.card,
    padding: 15,
    ...shadow.card,
  },
  statusCardActive: {
    borderColor: colors.coral50,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statusDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: colors.inkFaint,
  },
  statusDotActive: {
    backgroundColor: colors.accent,
  },
  statusTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.ink,
  },
  statusSub: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.inkSoft,
  },
  /* 체험 카드 */
  previewCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.coral50,
    borderWidth: 1.5,
    borderColor: colors.accent,
    ...radiusExact.card,
    padding: 14,
    ...shadow.card,
  },
  previewIcon: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.coral50,
    borderTopLeftRadius: 13,
    borderTopRightRadius: 11,
    borderBottomRightRadius: 14,
    borderBottomLeftRadius: 10,
    flexShrink: 0,
  },
  previewTitle: {
    fontSize: 15.5,
    fontWeight: '700',
    color: colors.ink,
  },
  previewSub: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.accentInk,
  },
  /* 섹션 라벨 */
  sectionLabel: {
    fontSize: 11.5,
    fontWeight: '700',
    color: colors.inkSoft,
    letterSpacing: 0.2,
    paddingLeft: 2,
    marginTop: 2,
  },
  /* 알림 기록 */
  notiList: {
    gap: 11,
  },
  notiCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.line,
    ...radiusExact.card,
    padding: 13,
    ...shadow.card,
  },
  notiCardPending: {
    borderColor: colors.accent,
  },
  notiEmoji: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface2,
    borderWidth: 1.5,
    borderColor: colors.line,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 13,
    borderBottomLeftRadius: 9,
    flexShrink: 0,
  },
  notiTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
  },
  notiBagName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.ink,
  },
  notiTime: {
    fontSize: 11.5,
    fontWeight: '500',
    color: colors.inkFaint,
  },
  notiStatusPending: {
    fontSize: 12.5,
    fontWeight: '700',
    color: colors.accent,
  },
  notiStatusDone: {
    fontSize: 12.5,
    fontWeight: '700',
    color: colors.coral600,
  },
});
