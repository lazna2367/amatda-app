import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  Platform,
  Dimensions,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { useState, useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { colors, radiusExact, shadow, spacing } from '@/theme';

type TriggerTab = 'depart' | 'arrive';
type BagItem = { id: string; name: string; emoji: string };

/* ---------- emoji lookup ---------- */
const EMO: Record<string, string> = {
  휴대폰: '📱', 지갑: '👛', '차 키': '🔑', 사원증: '🪪', 이어폰: '🎧', 우산: '☂️',
  운동복: '👕', 수건: '🧺', 셰이커: '🥤', 노트북: '💻', 충전기: '🔌', 텀블러: '🥤',
  마스크: '😷', 약: '💊', 여권: '🛂', 카드: '💳', 물병: '💧', 책: '📖',
  우유: '🥛', 달걀: '🥚', 식빵: '🍞', 처방전: '📄', 세탁물: '🧺', 커피: '☕',
};
const emo = (name: string) => EMO[name] ?? '📦';

const KEYWORD_EMOJIS: Record<string, string[]> = {
  출근: ['💼', '🏢', '📊', '💻', '👔', '🗂️'],
  직장: ['💼', '🏢', '📊', '💻', '👔', '🗂️'],
  헬스: ['🏋️', '💪', '👟', '🥤', '👕', '🧺'],
  운동: ['🏋️', '💪', '👟', '🥤', '👕', '🧺'],
  여행: ['🧳', '✈️', '🗺️', '🌏', '📷', '🛂'],
  출장: ['🧳', '💼', '✈️', '💻', '📊', '🗂️'],
  학교: ['🎒', '📚', '✏️', '📝', '🏫', '💊'],
  마트: ['🛒', '🛍️', '🥦', '🥛', '🧴', '📝'],
  쇼핑: ['🛒', '🛍️', '👗', '👟', '💄', '💳'],
};

const getEmojiSuggestions = (name: string): string[] => {
  if (!name) return [];
  for (const [key, emojis] of Object.entries(KEYWORD_EMOJIS)) {
    if (name.includes(key)) return emojis;
  }
  return ['💼', '🎒', '👜', '🧳', '🛒', '📦'];
};

/* ---------- item pool for picker ---------- */
const POOL_ITEMS: BagItem[] = [
  { id: 'p1', name: '휴대폰', emoji: '📱' },
  { id: 'p2', name: '지갑', emoji: '👛' },
  { id: 'p3', name: '차 키', emoji: '🔑' },
  { id: 'p4', name: '사원증', emoji: '🪪' },
  { id: 'p5', name: '이어폰', emoji: '🎧' },
  { id: 'p6', name: '우산', emoji: '☂️' },
  { id: 'p7', name: '노트북', emoji: '💻' },
  { id: 'p8', name: '충전기', emoji: '🔌' },
  { id: 'p9', name: '텀블러', emoji: '🥤' },
  { id: 'p10', name: '마스크', emoji: '😷' },
  { id: 'p11', name: '약', emoji: '💊' },
  { id: 'p12', name: '카드', emoji: '💳' },
  { id: 'p13', name: '운동복', emoji: '👕' },
  { id: 'p14', name: '수건', emoji: '🧺' },
  { id: 'p15', name: '물병', emoji: '💧' },
  { id: 'p16', name: '책', emoji: '📖' },
];

/* ---------- map constants ---------- */
const { width: SCREEN_W } = Dimensions.get('window');
const MAP_W = SCREEN_W - spacing.screenH * 2;
const MAP_H = 184;

/* ---------- blank map card ---------- */
function BlankMapCard({ onPress }: { onPress: () => void }) {
  return (
    <Pressable onPress={onPress}>
      <View style={mapSt.blank}>
        <View style={mapSt.blankPill}>
          <Ionicons name="location-outline" size={14} color={colors.inkSoft} />
          <Text style={mapSt.blankPillText}>탭해서 위치 · 반경 정하기</Text>
        </View>
      </View>
    </Pressable>
  );
}

const mapSt = StyleSheet.create({
  blank: {
    height: MAP_H,
    marginHorizontal: spacing.screenH,
    ...radiusExact.card,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.lineStrong,
    backgroundColor: colors.surface2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  blankPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.lineStrong,
    borderRadius: 20,
  },
  blankPillText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: colors.inkSoft,
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

/* ---------- small chip (for added items) ---------- */
function AddedChip({ name, emoji }: { name: string; emoji: string }) {
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
  icoText: { fontSize: 15, lineHeight: 20 },
  label: { fontSize: 15, fontWeight: '600', color: colors.ink, letterSpacing: -0.1 },
  divider: { width: 1.5, height: 22, backgroundColor: colors.hairline, marginLeft: 3 },
  menuBtn: { width: 28, height: 28, alignItems: 'center', justifyContent: 'center', marginHorizontal: 1 },
});

/* ---------- add chip ---------- */
function AddChip({ onPress }: { onPress: () => void }) {
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
  label: { fontSize: 15, fontWeight: '600', color: colors.inkSoft },
});

/* ---------- pick chip (for bottom sheet picker) ---------- */
function PickChip({ item, selected, onPress }: { item: BagItem; selected: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress}>
      <View style={[pickSt.chip, selected && pickSt.chipSel]}>
        <View style={pickSt.ico}>
          <Text style={pickSt.icoText}>{item.emoji}</Text>
        </View>
        <Text style={[pickSt.label, selected && pickSt.labelSel]}>{item.name}</Text>
        {selected && (
          <View style={pickSt.badge}>
            <Ionicons name="checkmark" size={10} color="#fff" />
          </View>
        )}
      </View>
    </Pressable>
  );
}

const pickSt = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingLeft: 5,
    paddingRight: 11,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.ink,
    borderTopLeftRadius: 13,
    borderTopRightRadius: 11,
    borderBottomRightRadius: 13,
    borderBottomLeftRadius: 10,
    shadowColor: '#2c2a26',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 0,
    elevation: 1,
    position: 'relative',
  },
  chipSel: {
    borderColor: colors.accent,
    backgroundColor: colors.coral50,
  },
  ico: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.mark,
    borderWidth: 1.5,
    borderColor: colors.ink,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 11,
    borderBottomRightRadius: 13,
    borderBottomLeftRadius: 10,
  },
  icoText: { fontSize: 13, lineHeight: 18 },
  label: { fontSize: 13.5, fontWeight: '600', color: colors.ink },
  labelSel: { color: colors.accentInk },
  badge: {
    position: 'absolute',
    top: -7,
    right: -7,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.accent,
    borderWidth: 1.5,
    borderColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

/* ---------- picker bottom sheet ---------- */
function PickerSheet({
  visible,
  activeTab,
  currentIds,
  onClose,
  onAdd,
}: {
  visible: boolean;
  activeTab: TriggerTab;
  currentIds: string[];
  onClose: () => void;
  onAdd: (items: BagItem[]) => void;
}) {
  const [pickerTab, setPickerTab] = useState<TriggerTab>(activeTab);
  const [selected, setSelected] = useState<Set<string>>(new Set(currentIds));

  if (!visible) return null;

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleAdd = () => {
    const items = POOL_ITEMS.filter((it) => selected.has(it.id));
    onAdd(items);
    onClose();
  };

  const selectedCount = selected.size;

  return (
    <>
      <Pressable style={sheetSt.scrim} onPress={onClose} />
      <View style={sheetSt.sheet}>
        <View style={sheetSt.grab} />
        <View style={sheetSt.head}>
          <Text style={sheetSt.headTitle}>챙길 것 담기</Text>
          <Pressable style={sheetSt.closeBtn} onPress={onClose}>
            <Ionicons name="close" size={18} color={colors.ink} />
          </Pressable>
        </View>

        {/* Picker segment */}
        <View style={[segSt.container, { marginBottom: 8 }]}>
          <Pressable style={[segSt.tab, pickerTab === 'depart' && segSt.tabActive]} onPress={() => setPickerTab('depart')}>
            <Ionicons name="log-out-outline" size={15} color={pickerTab === 'depart' ? '#fff' : colors.inkSoft} />
            <Text style={[{ fontSize: 13.5, fontWeight: '700', color: pickerTab === 'depart' ? '#fff' : colors.inkSoft }]}>떠날 때</Text>
          </Pressable>
          <Pressable style={[segSt.tab, pickerTab === 'arrive' && segSt.tabActive]} onPress={() => setPickerTab('arrive')}>
            <Ionicons name="flag-outline" size={15} color={pickerTab === 'arrive' ? '#fff' : colors.inkSoft} />
            <Text style={[{ fontSize: 13.5, fontWeight: '700', color: pickerTab === 'arrive' ? '#fff' : colors.inkSoft }]}>도착할 때</Text>
          </Pressable>
        </View>

        <Text style={sheetSt.hint}>
          {pickerTab === 'depart' ? '떠날 때 = 챙길 소지품' : '도착할 때 = 챙길 것 (살 것·받을 것 등)'}
        </Text>

        {/* New item creation field */}
        <View style={sheetSt.createField}>
          <Ionicons name="add" size={16} color={colors.accent} />
          <Text style={sheetSt.createFieldText}>새 소지품 만들기</Text>
        </View>

        {/* Pool items */}
        <Text style={sheetSt.poolLabel}>내 소지품 — 탭해서 담기</Text>
        <View style={sheetSt.pool}>
          {POOL_ITEMS.map((item) => (
            <PickChip
              key={item.id}
              item={item}
              selected={selected.has(item.id)}
              onPress={() => toggle(item.id)}
            />
          ))}
        </View>

        {/* CTA */}
        <Pressable
          style={[sheetSt.cta, selectedCount === 0 && sheetSt.ctaDisabled]}
          onPress={selectedCount > 0 ? handleAdd : undefined}
        >
          <Text style={[sheetSt.ctaText, selectedCount === 0 && sheetSt.ctaTextDisabled]}>
            {selectedCount > 0 ? `가방에 담기 · ${selectedCount}개` : '담을 것을 골라주세요'}
          </Text>
        </Pressable>
      </View>
    </>
  );
}

const sheetSt = StyleSheet.create({
  scrim: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(36,33,29,0.42)',
    zIndex: 20,
  },
  sheet: {
    position: 'absolute',
    left: 0, right: 0, bottom: 0,
    zIndex: 30,
    backgroundColor: colors.surface,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    borderTopWidth: 1.5,
    borderColor: colors.line,
    padding: 12,
    paddingHorizontal: spacing.screenH,
    paddingBottom: Platform.OS === 'ios' ? 32 : 22,
    shadowColor: '#2c2a26',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 10,
  },
  grab: {
    width: 40,
    height: 5,
    borderRadius: 4,
    backgroundColor: colors.lineStrong,
    alignSelf: 'center',
    marginBottom: 12,
  },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  headTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: colors.ink,
    letterSpacing: -0.3,
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
  hint: {
    fontSize: 11.5,
    fontWeight: '500',
    color: colors.inkSoft,
    marginBottom: 13,
  },
  createField: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 13,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.accent,
    borderRadius: 12,
    marginBottom: 14,
  },
  createFieldText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.accent,
  },
  poolLabel: {
    fontSize: 11.5,
    fontWeight: '700',
    color: colors.inkSoft,
    letterSpacing: 0.2,
    marginBottom: 10,
  },
  pool: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
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
});

/* ---------- main screen ---------- */
export default function BagCreateScreen() {
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [activeTab, setActiveTab] = useState<TriggerTab>('depart');
  const [departItems, setDepartItems] = useState<BagItem[]>([]);
  const [arriveItems, setArriveItems] = useState<BagItem[]>([]);
  const [showPicker, setShowPicker] = useState(false);

  const suggestions = getEmojiSuggestions(name);
  const autoEmoji = suggestions[0] ?? '💼';
  const displayEmoji = emoji || (name ? autoEmoji : '');
  const currentItems = activeTab === 'depart' ? departItems : arriveItems;
  const currentIds = currentItems.map((i) => i.id);
  const canCreate = name.trim().length > 0;

  const tabLabel = activeTab === 'depart' ? '떠날 때' : '도착할 때';

  const handleAdd = (items: BagItem[]) => {
    if (activeTab === 'depart') setDepartItems(items);
    else setArriveItems(items);
  };

  return (
    <View style={styles.screen}>
      {/* AppBar */}
      <View style={styles.appBar}>
        <Pressable style={styles.ghostBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color={colors.ink} />
        </Pressable>
        <Text style={styles.appBarTitle}>새 가방</Text>
        <View style={{ flex: 1 }} />
      </View>

      {/* Body */}
      <View style={styles.body}>
        {/* Name + emoji row */}
        <View style={styles.nameRow}>
          <Pressable
            style={[styles.emojiBtn, displayEmoji ? styles.emojiBtnFilled : styles.emojiBtnEmpty]}
            onPress={() => setShowEmojiPicker((v) => !v)}
          >
            <Text style={[styles.emojiBtnText, !displayEmoji && styles.emojiBtnTextFaded]}>
              {displayEmoji || '💼'}
            </Text>
          </Pressable>
          <TextInput
            style={[styles.nameField, isFocused && styles.nameFieldFocused]}
            value={name}
            onChangeText={(t) => { setName(t); setEmoji(''); }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="가방 이름 (예: 출근 가방)"
            placeholderTextColor={colors.inkFaint}
          />
        </View>

        {/* Emoji suggestions (shown when focused or has name) */}
        {(isFocused || name.length > 0) && suggestions.length > 0 && (
          <View style={styles.emojiSugRow}>
            <Text style={styles.emojiSugLabel}>🔍 '{name}' 에 어울리는 이모지</Text>
            <View style={styles.emojiSugList}>
              {suggestions.slice(0, 6).map((e, i) => (
                <Pressable
                  key={i}
                  style={[styles.emojiSugBtn, (emoji || autoEmoji) === e && styles.emojiSugBtnActive]}
                  onPress={() => setEmoji(e)}
                >
                  <Text style={{ fontSize: 22 }}>{e}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {/* Blank map card */}
        <BlankMapCard onPress={() => router.push('/(tabs)/bags/location')} />

        {/* Content */}
        <View style={styles.content}>
          <TriggerSeg active={activeTab} onPress={setActiveTab} />

          <View style={styles.itemsHeader}>
            <Text style={styles.itemsTitle}>
              {tabLabel} 챙길 것
              {currentItems.length > 0 && (
                <Text style={styles.itemsCount}> {currentItems.length}</Text>
              )}
            </Text>
          </View>

          {/* Chips */}
          <View style={styles.chipsWrap}>
            {currentItems.map((item) => (
              <AddedChip key={item.id} name={item.name} emoji={item.emoji} />
            ))}
            <AddChip onPress={() => setShowPicker(true)} />
          </View>

          {/* Empty hint */}
          {currentItems.length === 0 && (
            <View style={styles.hint}>
              <Text style={styles.hintText}>
                이름·위치·챙길 것을 채우면{'\n'}가방이 완성돼요
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Footer CTA */}
      <View style={styles.footer}>
        <Pressable style={[styles.cta, !canCreate && styles.ctaDisabled]}>
          <Text style={[styles.ctaText, !canCreate && styles.ctaTextDisabled]}>가방 만들기</Text>
        </Pressable>
      </View>

      {/* Picker sheet */}
      <PickerSheet
        visible={showPicker}
        activeTab={activeTab}
        currentIds={currentIds}
        onClose={() => setShowPicker(false)}
        onAdd={handleAdd}
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
  },
  body: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    paddingHorizontal: spacing.screenH,
    paddingBottom: 4,
    marginBottom: 2,
  },
  emojiBtn: {
    width: 52,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    borderWidth: 1.5,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 15,
    borderBottomLeftRadius: 12,
  },
  emojiBtnEmpty: {
    backgroundColor: colors.surface2,
    borderColor: colors.lineStrong,
  },
  emojiBtnFilled: {
    backgroundColor: colors.mark,
    borderColor: colors.ink,
  },
  emojiBtnText: {
    fontSize: 24,
  },
  emojiBtnTextFaded: {
    opacity: 0.4,
  },
  nameField: {
    flex: 1,
    height: 50,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 15,
    fontWeight: '500',
    color: colors.ink,
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: colors.lineStrong,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 11,
    borderBottomRightRadius: 13,
    borderBottomLeftRadius: 11,
  },
  nameFieldFocused: {
    borderColor: colors.accent,
    backgroundColor: colors.coral50,
  },
  emojiSugRow: {
    paddingHorizontal: spacing.screenH,
    paddingVertical: 11,
    backgroundColor: colors.surface,
    borderTopWidth: 1.5,
    borderBottomWidth: 1.5,
    borderColor: colors.line,
    marginBottom: 4,
  },
  emojiSugLabel: {
    fontSize: 11.5,
    fontWeight: '700',
    color: colors.inkSoft,
    marginBottom: 9,
  },
  emojiSugList: {
    flexDirection: 'row',
    gap: 9,
  },
  emojiSugBtn: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: colors.line,
    backgroundColor: '#fff',
  },
  emojiSugBtnActive: {
    borderColor: colors.accent,
    backgroundColor: colors.coral50,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.screenH,
    paddingTop: 16,
    gap: 12,
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
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 9,
  },
  hint: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 20,
    gap: 7,
  },
  hintText: {
    fontSize: 13.5,
    fontWeight: '500',
    color: colors.inkFaint,
    textAlign: 'center',
    lineHeight: 21,
  },
  footer: {
    paddingHorizontal: spacing.screenH,
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 24 : 16,
    backgroundColor: colors.paper,
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
});
