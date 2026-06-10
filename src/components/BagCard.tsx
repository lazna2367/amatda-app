import { View, Text, StyleSheet, ScrollView, Switch, Pressable } from 'react-native';
import { colors, radiusExact, shadow, spacing } from '@/theme';
import { ItemChip } from './ItemChip';

export type BagItem = { id: string; name: string; emoji: string };

type Props = {
  name: string;
  emoji: string;
  items: BagItem[];
  triggerLabel: string;   // "떠날 때" | "도착할 때" | "위치 미설정"
  place?: string;         // "집 · 합정동"
  lastChecked?: string;   // "오늘 08:12 챙김"
  active: boolean;
  onToggle: (v: boolean) => void;
  onPress: () => void;
};

export function BagCard({ name, emoji, items, triggerLabel, place, lastChecked, active, onToggle, onPress }: Props) {
  return (
    <Pressable onPress={onPress}>
      <View style={[styles.card, active && styles.cardActive]}>
        {/* 헤더 */}
        <View style={styles.header}>
          <View style={styles.left}>
            <View style={[styles.emojiBox, active && styles.emojiBoxActive]}>
              <Text style={styles.emoji}>{emoji}</Text>
            </View>
            <View style={styles.meta}>
              <Text style={styles.name}>{name}</Text>
              <View style={styles.statusRow}>
                <View style={[styles.dot, { backgroundColor: active ? colors.accent : colors.inkFaint }]} />
                <Text style={[styles.statusText, active && styles.statusTextActive]}>
                  {active ? '감지 중' : '꺼짐'}
                </Text>
                <Text style={styles.metaSub}>· {triggerLabel} · 챙길 것 {items.length}</Text>
              </View>
            </View>
          </View>
          <Switch
            value={active}
            onValueChange={onToggle}
            trackColor={{ false: colors.line, true: colors.coral200 }}
            thumbColor={active ? colors.accent : colors.surface}
            ios_backgroundColor={colors.line}
          />
        </View>

        {/* 챙길 것 스트립 */}
        {items.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.strip}
            contentContainerStyle={styles.stripContent}
          >
            {items.map((item) => (
              <ItemChip key={item.id} name={item.name} emoji={item.emoji} small />
            ))}
          </ScrollView>
        )}

        {/* 푸터 */}
        <View style={styles.divider} />
        <View style={styles.footer}>
          <Text style={styles.place}>📍 {place ?? '위치 미설정'}</Text>
          <Text style={[styles.lastChecked, active && styles.lastCheckedActive]}>
            {active && '✓ '}{lastChecked ?? ''}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.line,
    ...radiusExact.card,
    ...shadow.card,
    padding: 15,
    paddingBottom: 13,
  },
  cardActive: {
    borderColor: colors.coral200,
    shadowColor: '#e8674a',
    shadowOpacity: 0.07,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    minWidth: 0,
  },
  emojiBox: {
    width: 46,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface2,
    borderWidth: 1.5,
    borderColor: colors.line,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 15,
    borderBottomLeftRadius: 12,
    flexShrink: 0,
  },
  emojiBoxActive: {
    backgroundColor: colors.coral50,
    borderColor: colors.coral200,
  },
  emoji: {
    fontSize: 25,
  },
  meta: {
    flex: 1,
    gap: 4,
    minWidth: 0,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.ink,
    letterSpacing: -0.2,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.inkSoft,
  },
  statusTextActive: {
    color: colors.accent,
  },
  metaSub: {
    fontSize: 12,
    color: colors.inkSoft,
  },
  strip: {
    marginTop: 12,
  },
  stripContent: {
    gap: 7,
    paddingRight: 4,
  },
  divider: {
    height: 1.5,
    backgroundColor: colors.hairline,
    marginVertical: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  place: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.inkSoft,
  },
  lastChecked: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.inkFaint,
  },
  lastCheckedActive: {
    color: colors.accent,
    fontWeight: '700',
  },
});
