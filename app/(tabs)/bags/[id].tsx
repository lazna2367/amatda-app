import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Platform,
  Dimensions,
  ActivityIndicator,
  Modal,
  TextInput,
} from 'react-native';
import { router, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { useState, useCallback } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { colors, radiusExact, shadow, spacing } from '@/theme';
import { supabase } from '@/lib/supabase';
import { useAlert } from '@/store/alertStore';
import type { PackWithTriggers, TriggerWithItems } from '@/types/db';

type TriggerTab = 'depart' | 'arrive';

/* ---------- map constants ---------- */
const { width: SCREEN_W } = Dimensions.get('window');
const MAP_W = SCREEN_W - spacing.screenH * 2;
const MAP_H = 184;
const GEO_SIZE = 124;

/* ---------- decorative map ---------- */
function DecorativeMap({ place, radius }: { place?: string | null; radius: string }) {
  const geoLeft = (MAP_W - GEO_SIZE) / 2;
  const geoTop = (MAP_H - GEO_SIZE) / 2;
  const placeLabel = place ?? '위치 미설정';

  return (
    <View style={mapSt.card}>
      <View style={[mapSt.road, { left: 0, right: 0, top: MAP_H * 0.56, height: 13 }]} />
      <View style={[mapSt.road, { top: 0, bottom: 0, left: MAP_W * 0.30, width: 12 }]} />
      <View style={[mapSt.road, { top: MAP_H * 0.56, bottom: 0, left: MAP_W * 0.70, width: 8 }]} />
      <View style={{
        position: 'absolute', left: MAP_W * 0.06, top: MAP_H * 0.63,
        width: MAP_W * 0.20, height: MAP_H * 0.30,
        backgroundColor: 'rgba(79,157,122,0.18)', borderWidth: 1.5, borderColor: 'rgba(79,157,122,0.32)', borderRadius: 6,
      }} />
      <View style={{
        position: 'absolute', right: -4, top: MAP_H * 0.64,
        width: MAP_W * 0.24, height: MAP_H * 0.40,
        backgroundColor: 'rgba(95,150,200,0.16)', borderWidth: 1.5, borderColor: 'rgba(95,150,200,0.28)', borderTopLeftRadius: 40,
      }} />
      {([
        [0.46, 0.08, 0.12, 0.12, '#ece8dd'],
        [0.60, 0.10, 0.09, 0.09, '#e7e2d6'],
        [0.74, 0.14, 0.11, 0.14, '#ece8dd'],
        [0.46, 0.24, 0.10, 0.16, '#e7e2d6'],
        [0.08, 0.08, 0.16, 0.09, '#ece8dd'],
        [0.08, 0.20, 0.13, 0.12, '#e7e2d6'],
        [0.60, 0.26, 0.13, 0.11, '#ece8dd'],
        [0.46, 0.70, 0.14, 0.16, '#e7e2d6'],
      ] as [number, number, number, number, string][]).map(([l, t, w, h, c], i) => (
        <View key={i} style={[mapSt.block, {
          left: MAP_W * l, top: MAP_H * t,
          width: MAP_W * w, height: MAP_H * h,
          backgroundColor: c,
        }]} />
      ))}
      {place ? <View style={[mapSt.geo, { left: geoLeft, top: geoTop }]} /> : null}
      <View style={{
        position: 'absolute', left: MAP_W * 0.32, top: MAP_H * 0.70,
        width: 13, height: 13, borderRadius: 6.5,
        backgroundColor: '#5f96c8', borderWidth: 2, borderColor: '#fff',
      }} />
      <View style={{ position: 'absolute', top: MAP_H / 2 - 22, left: 0, right: 0, alignItems: 'center' }}>
        <Ionicons name="location" size={22} color={place ? colors.accent : colors.inkFaint} />
      </View>
      <View style={{ position: 'absolute', top: MAP_H / 2 + 5, left: 0, right: 0, alignItems: 'center' }}>
        <View style={[mapSt.placeSticker, !place && mapSt.placeStickerEmpty]}>
          <Text style={[mapSt.placeStickerText, !place && mapSt.placeStickerTextEmpty]}>{placeLabel}</Text>
        </View>
      </View>
      <View style={mapSt.streetLabel}>
        <Text style={mapSt.streetLabelText}>합정로</Text>
      </View>
      {place && (
        <View style={mapSt.radiusPill}>
          <Ionicons name="location-outline" size={11} color={colors.inkSoft} />
          <Text style={mapSt.radiusPillText}>반경 {radius}</Text>
        </View>
      )}
      <View style={mapSt.locateBtn}>
        <Ionicons name="locate-outline" size={18} color={colors.ink} />
      </View>
    </View>
  );
}

const mapSt = StyleSheet.create({
  card: {
    height: MAP_H,
    marginHorizontal: spacing.screenH,
    ...radiusExact.card,
    borderWidth: 1.5,
    borderColor: colors.ink,
    overflow: 'hidden',
    backgroundColor: '#faf8f2',
    ...shadow.card,
  },
  road: {
    position: 'absolute',
    backgroundColor: '#fff',
    borderColor: '#e4e0d4',
    borderWidth: 0.5,
  },
  block: {
    position: 'absolute',
    borderRadius: 3,
    borderWidth: 0.5,
    borderColor: 'rgba(44,42,38,0.05)',
  },
  geo: {
    position: 'absolute',
    width: GEO_SIZE,
    height: GEO_SIZE,
    borderRadius: GEO_SIZE / 2,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.accent,
    backgroundColor: 'rgba(232,103,74,0.10)',
  },
  placeSticker: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.ink,
    paddingVertical: 4,
    paddingHorizontal: 10,
    ...radiusExact.chip,
    ...shadow.sticker,
  },
  placeStickerEmpty: {
    borderStyle: 'dashed',
    borderColor: colors.lineStrong,
  },
  placeStickerText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.ink,
  },
  placeStickerTextEmpty: {
    color: colors.inkFaint,
  },
  streetLabel: {
    position: 'absolute',
    top: 11,
    left: 11,
    backgroundColor: 'rgba(255,255,255,0.6)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
  },
  streetLabelText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: colors.inkFaint,
    letterSpacing: 0.4,
  },
  radiusPill: {
    position: 'absolute',
    bottom: 11,
    right: 11,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 9,
    paddingVertical: 4,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.lineStrong,
    borderRadius: 20,
  },
  radiusPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.inkSoft,
  },
  locateBtn: {
    position: 'absolute',
    top: 9,
    right: 9,
    width: 30,
    height: 30,
    borderRadius: 9,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

/* ---------- trigger segment ---------- */
function TriggerSeg({ active, onPress }: { active: TriggerTab; onPress: (t: TriggerTab) => void }) {
  return (
    <View style={segSt.container}>
      <Pressable style={[segSt.tab, active === 'depart' && segSt.tabActive]} onPress={() => onPress('depart')}>
        <Ionicons name="log-out-outline" size={16} color={active === 'depart' ? '#fff' : colors.inkSoft} />
        <Text style={[segSt.tabText, active === 'depart' && segSt.tabTextActive]}>떠날 때</Text>
      </Pressable>
      <Pressable style={[segSt.tab, active === 'arrive' && segSt.tabActive]} onPress={() => onPress('arrive')}>
        <Ionicons name="flag-outline" size={16} color={active === 'arrive' ? '#fff' : colors.inkSoft} />
        <Text style={[segSt.tabText, active === 'arrive' && segSt.tabTextActive]}>도착할 때</Text>
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
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
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
});

/* ---------- item chip ---------- */
function DetailItemChip({ name, emoji }: { name: string; emoji: string }) {
  return (
    <View style={chipSt.chip}>
      <View style={chipSt.ico}>
        <Text style={chipSt.icoText}>{emoji}</Text>
      </View>
      <Text style={chipSt.label}>{name}</Text>
      <View style={chipSt.divider} />
      <Pressable style={chipSt.menuBtn}>
        <Ionicons name="ellipsis-horizontal" size={15} color={colors.inkFaint} />
      </Pressable>
    </View>
  );
}

const chipSt = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 7,
    paddingLeft: 7,
    paddingRight: 0,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.ink,
    ...radiusExact.chip,
    ...shadow.sticker,
  },
  ico: {
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.mark,
    borderWidth: 1.5,
    borderColor: colors.ink,
    ...radiusExact.tile,
  },
  icoText: {
    fontSize: 15,
    lineHeight: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.ink,
    letterSpacing: -0.1,
  },
  divider: {
    width: 1.5,
    height: 22,
    backgroundColor: colors.hairline,
    marginLeft: 3,
  },
  menuBtn: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 1,
  },
});

/* ---------- add chip ---------- */
function AddChip({ onPress }: { onPress?: () => void }) {
  return (
    <Pressable onPress={onPress}>
      <View style={addSt.chip}>
        <Ionicons name="add" size={16} color={colors.inkSoft} />
        <Text style={addSt.label}>챙길 것 담기</Text>
      </View>
    </Pressable>
  );
}

const addSt = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.lineStrong,
    ...radiusExact.chip,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.inkSoft,
  },
});

/* ---------- rename modal ---------- */
function RenameModal({
  visible,
  initialName,
  initialEmoji,
  onCancel,
  onSave,
}: {
  visible: boolean;
  initialName: string;
  initialEmoji: string;
  onCancel: () => void;
  onSave: (name: string, emoji: string) => void;
}) {
  const [name, setName] = useState(initialName);
  const [emoji, setEmoji] = useState(initialEmoji);

  const handleSave = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    onSave(trimmed, emoji.trim() || initialEmoji);
  };

  return (
    <Modal transparent animationType="fade" visible={visible} statusBarTranslucent>
      <View style={renameSt.overlay}>
        <View style={renameSt.card}>
          <Text style={renameSt.title}>이름·이모지 변경</Text>
          <View style={renameSt.row}>
            <TextInput
              style={renameSt.emojiInput}
              value={emoji}
              onChangeText={setEmoji}
              maxLength={2}
              placeholder="💼"
              placeholderTextColor={colors.inkFaint}
            />
            <TextInput
              style={renameSt.nameInput}
              value={name}
              onChangeText={setName}
              placeholder="가방 이름"
              placeholderTextColor={colors.inkFaint}
              autoFocus
              returnKeyType="done"
              onSubmitEditing={handleSave}
            />
          </View>
          <View style={renameSt.btnRow}>
            <Pressable style={[renameSt.btn, renameSt.btnCancel]} onPress={onCancel}>
              <Text style={renameSt.btnCancelText}>취소</Text>
            </Pressable>
            <Pressable style={[renameSt.btn, renameSt.btnSave]} onPress={handleSave}>
              <Text style={renameSt.btnSaveText}>저장</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const renameSt = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(44,42,38,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  card: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.line,
    ...radiusExact.card,
    padding: 22,
    gap: 16,
    ...shadow.pop,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.ink,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  emojiInput: {
    width: 52,
    height: 48,
    backgroundColor: colors.surface2,
    borderWidth: 1.5,
    borderColor: colors.line,
    ...radiusExact.field,
    fontSize: 22,
    textAlign: 'center',
    color: colors.ink,
  },
  nameInput: {
    flex: 1,
    height: 48,
    backgroundColor: colors.surface2,
    borderWidth: 1.5,
    borderColor: colors.line,
    ...radiusExact.field,
    paddingHorizontal: 14,
    fontSize: 16,
    fontWeight: '600',
    color: colors.ink,
  },
  btnRow: {
    flexDirection: 'row',
    gap: 8,
  },
  btn: {
    flex: 1,
    paddingVertical: 11,
    alignItems: 'center',
    justifyContent: 'center',
    ...radiusExact.btn,
  },
  btnCancel: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.line,
  },
  btnSave: {
    backgroundColor: colors.accent,
    borderWidth: 1.5,
    borderColor: colors.coral600,
    ...shadow.btn,
  },
  btnCancelText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.inkSoft,
  },
  btnSaveText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
});

/* ---------- screen ---------- */
export default function BagDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const showAlert = useAlert();

  const [pack, setPack] = useState<PackWithTriggers | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TriggerTab>('depart');
  const [menuOpen, setMenuOpen] = useState(false);
  const [renameOpen, setRenameOpen] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      const load = async () => {
        setLoading(true);
        const { data } = await supabase
          .from('packs')
          .select('*, triggers(*, items(*))')
          .eq('id', id)
          .single();
        if (active && data) setPack(data as PackWithTriggers);
        if (active) setLoading(false);
      };
      load();
      return () => { active = false; };
    }, [id])
  );

  const depTrigger = pack?.triggers.find((t) => t.type === 'departure') as TriggerWithItems | undefined;
  const arrTrigger = pack?.triggers.find((t) => t.type === 'arrival') as TriggerWithItems | undefined;
  const activeTrigger = activeTab === 'depart' ? depTrigger : arrTrigger;
  const items = activeTrigger?.items ?? [];
  const isActive = pack?.triggers.some((t) => t.is_active) ?? false;
  const place = depTrigger?.label ?? null;
  const radius = depTrigger?.radius_meters ? `${depTrigger.radius_meters}m` : '200m';
  const tabLabel = activeTab === 'depart' ? '떠날 때' : '도착할 때';
  const hintText =
    activeTab === 'depart'
      ? '이 구역을 나가면 "챙겼나요?" 알림'
      : '이 구역에 들어오면 "챙길 것" 알림';

  const menuTop = Platform.OS === 'web' ? 72 : 112;

  const handleDelete = () => {
    setMenuOpen(false);
    showAlert({
      title: '가방 삭제',
      message: `"${pack?.name}" 가방을 삭제할까요? 되돌릴 수 없어요.`,
      buttons: [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: async () => {
            await supabase.from('packs').delete().eq('id', id);
            router.back();
          },
        },
      ],
    });
  };

  const handleRenameSave = async (name: string, emoji: string) => {
    setRenameOpen(false);
    await supabase.from('packs').update({ name, emoji }).eq('id', id);
    setPack((prev) => prev ? { ...prev, name, emoji } : prev);
  };

  if (loading) {
    return (
      <View style={[styles.screen, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator color={colors.accent} size="large" />
      </View>
    );
  }

  if (!pack) {
    return (
      <View style={[styles.screen, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: colors.inkSoft }}>가방을 찾을 수 없어요.</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      {/* AppBar */}
      <View style={styles.appBar}>
        <Pressable style={styles.ghostBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color={colors.ink} />
        </Pressable>
        <Text style={styles.appBarTitle} numberOfLines={1}>
          {pack.emoji} {pack.name}
        </Text>
        <View style={{ flex: 1 }} />
        <Pressable style={styles.iconBtn} onPress={() => setMenuOpen(true)}>
          <Ionicons name="ellipsis-horizontal" size={20} color={colors.ink} />
        </Pressable>
      </View>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Map card */}
        <Pressable onPress={() => router.push('/(tabs)/bags/location')}>
          <DecorativeMap place={place} radius={radius} />
        </Pressable>

        {/* Content */}
        <View style={styles.content}>
          {/* Info row */}
          <View style={styles.infoRow}>
            <View style={styles.infoLeft}>
              <Ionicons name="location-outline" size={16} color={place ? colors.accent : colors.inkFaint} />
              <Text style={styles.infoText}>
                {place ? (
                  <>{place} · 반경 <Text style={styles.infoAccent}>{radius}</Text></>
                ) : (
                  '위치 미설정'
                )}
              </Text>
            </View>
            {isActive ? (
              <View style={styles.livePill}>
                <View style={styles.liveDot} />
                <Text style={styles.livePillText}>켜짐</Text>
              </View>
            ) : (
              <View style={styles.offPill}>
                <Text style={styles.offPillText}>꺼짐</Text>
              </View>
            )}
          </View>

          {/* Trigger segment */}
          <TriggerSeg active={activeTab} onPress={setActiveTab} />

          {/* Hint */}
          <Text style={styles.hint}>{hintText}</Text>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Items header */}
          <View style={styles.itemsHeader}>
            <Text style={styles.itemsTitle}>
              {tabLabel} 챙길 것{' '}
              <Text style={styles.itemsCount}>{items.length}</Text>
            </Text>
            <View style={styles.savedRow}>
              <Ionicons name="checkmark" size={13} color={colors.accent} />
              <Text style={styles.savedText}>저장됨</Text>
            </View>
          </View>

          {/* Chips */}
          <View style={styles.chipsWrap}>
            {items.map((item) => (
              <DetailItemChip key={item.id} name={item.name} emoji={item.emoji ?? '📦'} />
            ))}
            <AddChip />
          </View>
        </View>
      </ScrollView>

      {/* Kebab overlay */}
      {menuOpen && (
        <>
          <Pressable style={styles.scrim} onPress={() => setMenuOpen(false)} />
          <View style={[styles.menuCard, { top: menuTop }]}>
            <Pressable
              style={styles.menuItem}
              onPress={() => { setMenuOpen(false); setRenameOpen(true); }}
            >
              <Ionicons name="pencil-outline" size={17} color={colors.ink} />
              <Text style={styles.menuItemText}>이름·이모지 변경</Text>
            </Pressable>
            <View style={styles.menuDivider} />
            <Pressable style={styles.menuItem} onPress={handleDelete}>
              <Ionicons name="trash-outline" size={17} color={colors.danger} />
              <Text style={[styles.menuItemText, { color: colors.danger }]}>가방 삭제</Text>
            </Pressable>
          </View>
        </>
      )}

      {/* Rename modal */}
      <RenameModal
        visible={renameOpen}
        initialName={pack.name}
        initialEmoji={pack.emoji ?? '💼'}
        onCancel={() => setRenameOpen(false)}
        onSave={handleRenameSave}
      />
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
    flexShrink: 1,
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
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  content: {
    paddingHorizontal: spacing.screenH,
    paddingTop: 16,
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  infoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.inkSoft,
  },
  infoAccent: {
    color: colors.accent,
    fontWeight: '700',
  },
  livePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colors.coral600,
    backgroundColor: colors.accent,
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
  offPill: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colors.lineStrong,
    backgroundColor: colors.surface,
  },
  offPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.inkSoft,
  },
  hint: {
    fontSize: 11.5,
    fontWeight: '500',
    color: colors.inkSoft,
    letterSpacing: 0.1,
  },
  divider: {
    height: 1.5,
    backgroundColor: colors.hairline,
  },
  itemsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemsTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.ink,
  },
  itemsCount: {
    color: colors.inkSoft,
  },
  savedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  savedText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: colors.accent,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 9,
    paddingBottom: 8,
  },
  scrim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(36,33,29,0.42)',
    zIndex: 20,
  },
  menuCard: {
    position: 'absolute',
    right: spacing.screenH,
    width: 204,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.line,
    ...radiusExact.card,
    padding: 7,
    zIndex: 30,
    ...shadow.pop,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    paddingVertical: 11,
    paddingHorizontal: 12,
  },
  menuItemText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.ink,
  },
  menuDivider: {
    height: 1.5,
    backgroundColor: colors.hairline,
    marginHorizontal: 4,
  },
});
