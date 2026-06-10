import { type ReactNode, type ComponentProps } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Platform } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, radiusExact, shadow, spacing } from '@/theme';

type IoniconName = ComponentProps<typeof Ionicons>['name'];

/* ---------- setting row ---------- */
function SettRow({
  icon,
  label,
  value,
  danger,
  showChevron = true,
  right,
  onPress,
}: {
  icon?: IoniconName;
  label: string;
  value?: string;
  danger?: boolean;
  showChevron?: boolean;
  right?: ReactNode;
  onPress?: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={rowSt.row}>
      {icon && (
        <View style={[rowSt.ico, danger && rowSt.icoDanger]}>
          <Ionicons name={icon} size={16} color={danger ? colors.danger : colors.inkSoft} />
        </View>
      )}
      <Text style={[rowSt.label, danger && rowSt.labelDanger]}>{label}</Text>
      {value && <Text style={rowSt.value}>{value}</Text>}
      {right}
      {showChevron && !right && (
        <Ionicons name="chevron-forward" size={16} color={colors.inkFaint} />
      )}
    </Pressable>
  );
}

const rowSt = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 4,
  },
  ico: {
    width: 30,
    height: 30,
    borderRadius: 9,
    backgroundColor: colors.surface2,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  icoDanger: {
    backgroundColor: colors.coral50,
  },
  label: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: colors.ink,
  },
  labelDanger: {
    color: colors.danger,
  },
  value: {
    fontSize: 12.5,
    fontWeight: '600',
    color: colors.inkSoft,
  },
});

/* ---------- divider ---------- */
function Hr() {
  return <View style={{ height: 1, backgroundColor: colors.line, marginLeft: 46 }} />;
}

/* ---------- section ---------- */
function Section({ label, children }: { label: string; children: ReactNode }) {
  return (
    <View>
      <Text style={secSt.label}>{label}</Text>
      <View style={secSt.card}>{children}</View>
    </View>
  );
}

const secSt = StyleSheet.create({
  label: {
    fontSize: 11.5,
    fontWeight: '700',
    color: colors.inkSoft,
    letterSpacing: 0.2,
    paddingLeft: 4,
    marginBottom: 6,
  },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.line,
    ...radiusExact.card,
    paddingHorizontal: 14,
    ...shadow.card,
  },
});

/* ---------- permission pill ---------- */
function PermPill({ ok }: { ok: boolean }) {
  return (
    <View style={[pillSt.pill, ok ? pillSt.pillOk : pillSt.pillOff]}>
      <Text style={[pillSt.text, ok ? pillSt.textOk : pillSt.textOff]}>
        {ok ? '정상' : '미허용'}
      </Text>
    </View>
  );
}

const pillSt = StyleSheet.create({
  pill: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  pillOk: {
    backgroundColor: colors.coral50,
    borderColor: colors.accent,
  },
  pillOff: {
    backgroundColor: colors.surface2,
    borderColor: colors.line,
  },
  text: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  textOk: { color: colors.coral600 },
  textOff: { color: colors.inkFaint },
});

/* ---------- toggle ---------- */
function Toggle({ on }: { on?: boolean }) {
  return (
    <View style={[togSt.track, on && togSt.trackOn]}>
      <View style={[togSt.thumb, on && togSt.thumbOn]} />
    </View>
  );
}

const togSt = StyleSheet.create({
  track: {
    width: 40,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.lineStrong,
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  trackOn: { backgroundColor: colors.accent },
  thumb: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  thumbOn: { alignSelf: 'flex-end' },
});

/* ---------- main screen ---------- */
export default function SettingsScreen() {
  return (
    <View style={styles.screen}>
      {/* AppBar */}
      <View style={styles.appBar}>
        <Text style={styles.appBarTitle}>설정</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 프로필 카드 */}
        <View style={styles.profileCard}>
          <View style={styles.profileAvatar}>
            <Text style={{ fontSize: 24 }}>🦊</Text>
          </View>
          <View style={{ flex: 1, gap: 3 }}>
            <Text style={styles.profileName}>김아맞</Text>
            <Text style={styles.profileEmail}>amat@kakao.com</Text>
          </View>
          <View style={styles.planBadge}>
            <Text style={styles.planBadgeText}>스탠다드</Text>
          </View>
        </View>

        {/* 권한 */}
        <Section label="권한">
          <SettRow
            icon="location-outline"
            label="위치"
            value="항상 허용"
            showChevron={false}
            right={<PermPill ok />}
          />
          <Hr />
          <SettRow
            icon="notifications-outline"
            label="알림"
            showChevron={false}
            right={<Toggle on />}
          />
        </Section>

        {/* 구독 */}
        <Section label="구독">
          <SettRow
            icon="bag-outline"
            label="구독 관리"
            value="스탠다드"
            onPress={() => router.push('/plans')}
          />
        </Section>

        {/* 계정 */}
        <Section label="계정">
          <SettRow icon="document-text-outline" label="개인정보처리방침" />
          <Hr />
          <SettRow icon="document-outline" label="이용약관" />
          <Hr />
          <SettRow icon="log-out-outline" label="로그아웃" />
          <Hr />
          <SettRow icon="trash-outline" label="회원 탈퇴" danger />
        </Section>

        <Text style={styles.version}>amatda v1.0.0 · Surmise Lab</Text>
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
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: spacing.screenH,
    paddingBottom: 32,
    gap: 16,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.line,
    ...radiusExact.card,
    padding: 15,
    ...shadow.card,
  },
  profileAvatar: {
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.coral50,
    borderWidth: 1.5,
    borderColor: colors.accent,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 13,
    borderBottomRightRadius: 16,
    borderBottomLeftRadius: 12,
    flexShrink: 0,
  },
  profileName: {
    fontSize: 16.5,
    fontWeight: '700',
    color: colors.ink,
  },
  profileEmail: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.inkSoft,
  },
  planBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: colors.accent,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colors.coral600,
  },
  planBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
  },
  version: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '500',
    color: colors.inkFaint,
    paddingBottom: 6,
  },
});
