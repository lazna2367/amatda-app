import { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  Platform,
  Dimensions,
  PanResponder,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, radiusExact, shadow, spacing } from '@/theme';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');
const MAP_H = Platform.OS === 'web' ? SCREEN_H * 0.5 : SCREEN_H * 0.55;

/* ---------- map decorations ---------- */
function MapBlocks() {
  const W = SCREEN_W;
  const H = MAP_H;
  return (
    <>
      {/* Roads */}
      <View style={[mapSt.road, { left: 0, right: 0, top: H * 0.56, height: 14 }]} />
      <View style={[mapSt.road, { top: 0, bottom: 0, left: W * 0.30, width: 13 }]} />
      <View style={[mapSt.road, { top: H * 0.56, bottom: 0, left: W * 0.70, width: 9 }]} />
      {/* Park */}
      <View style={{
        position: 'absolute', left: W * 0.05, top: H * 0.64,
        width: W * 0.22, height: H * 0.28,
        backgroundColor: 'rgba(79,157,122,0.18)', borderWidth: 1.5, borderColor: 'rgba(79,157,122,0.32)', borderRadius: 6,
      }} />
      {/* Water */}
      <View style={{
        position: 'absolute', right: -4, top: H * 0.65,
        width: W * 0.26, height: H * 0.38,
        backgroundColor: 'rgba(95,150,200,0.16)', borderWidth: 1.5, borderColor: 'rgba(95,150,200,0.28)', borderTopLeftRadius: 40,
      }} />
      {/* Building blocks */}
      {([
        [0.46, 0.07, 0.13, 0.12, '#ece8dd'],
        [0.62, 0.10, 0.10, 0.10, '#e7e2d6'],
        [0.74, 0.13, 0.12, 0.15, '#ece8dd'],
        [0.46, 0.22, 0.11, 0.18, '#e7e2d6'],
        [0.06, 0.07, 0.18, 0.10, '#ece8dd'],
        [0.06, 0.20, 0.15, 0.13, '#e7e2d6'],
        [0.62, 0.25, 0.14, 0.12, '#ece8dd'],
        [0.47, 0.70, 0.15, 0.16, '#e7e2d6'],
      ] as [number, number, number, number, string][]).map(([l, t, w, h, c], i) => (
        <View key={i} style={[mapSt.block, {
          left: W * l, top: H * t,
          width: W * w, height: H * h,
          backgroundColor: c,
        }]} />
      ))}
    </>
  );
}

const GEO_SIZE = 190;

/* ---------- custom radius slider ---------- */
function RadiusSlider({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const MIN = 50, MAX = 1000;
  const trackWRef = useRef(0);
  const [trackW, setTrackW] = useState(0);

  const toVal = (x: number) => {
    if (trackWRef.current === 0) return value;
    const ratio = Math.max(0, Math.min(1, x / trackWRef.current));
    return Math.round((MIN + ratio * (MAX - MIN)) / 50) * 50;
  };

  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: (e) => onChange(toVal(e.nativeEvent.locationX)),
      onPanResponderMove: (e, gs) => onChange(toVal(e.nativeEvent.locationX - gs.dx + gs.dx)),
    })
  ).current;

  const posRatio = Math.max(0, Math.min(1, (value - MIN) / (MAX - MIN)));
  const fillW = posRatio * trackW;
  const thumbL = Math.max(0, fillW - 11);

  return (
    <View
      style={slSt.area}
      onLayout={(e) => {
        const w = e.nativeEvent.layout.width;
        trackWRef.current = w;
        setTrackW(w);
      }}
      {...pan.panHandlers}
    >
      <View style={slSt.track} />
      <View style={[slSt.fill, { width: fillW }]} />
      <View style={[slSt.thumb, { left: thumbL }]} />
    </View>
  );
}

const slSt = StyleSheet.create({
  area: {
    height: 22,
    marginBottom: 4,
    justifyContent: 'center',
  },
  track: {
    position: 'absolute',
    top: 8.5,
    left: 0,
    right: 0,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.line,
  },
  fill: {
    position: 'absolute',
    top: 8.5,
    left: 0,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.accent,
  },
  thumb: {
    position: 'absolute',
    top: 0,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: colors.accent,
    shadowColor: '#2c2a26',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 3,
  },
});

const mapSt = StyleSheet.create({
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
});

/* ---------- location setup screen ---------- */
export default function LocationSetupScreen() {
  const [locationName, setLocationName] = useState('집');
  const [radius, setRadius] = useState(200);

  const formatRadius = (r: number) => r >= 1000 ? '1km' : `${r}m`;

  return (
    <View style={styles.screen}>
      {/* AppBar */}
      <View style={styles.appBar}>
        <Pressable style={styles.ghostBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color={colors.ink} />
        </Pressable>
        <Text style={styles.appBarTitle}>위치 정하기</Text>
        <View style={{ flex: 1 }} />
      </View>

      {/* Full-screen map area */}
      <View style={styles.mapArea}>
        {/* Map background */}
        <View style={StyleSheet.absoluteFillObject}>
          <View style={[StyleSheet.absoluteFillObject, { backgroundColor: '#faf8f2' }]} />
          <MapBlocks />
        </View>

        {/* Geofence circle */}
        <View style={styles.geoWrapper}>
          <View style={styles.geo} />
        </View>

        {/* Pin + label centered */}
        <View style={styles.pinWrapper}>
          <Ionicons name="location" size={28} color={colors.accent} style={{ filter: 'drop-shadow(1px 3px 2px rgba(44,42,38,0.35))' } as any} />
          <View style={styles.pinSticker}>
            <Text style={styles.pinStickerText}>여기로 설정</Text>
          </View>
        </View>

        {/* Search bar (visual only) */}
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color={colors.inkSoft} />
          <Text style={styles.searchPlaceholder}>주소·장소 검색</Text>
        </View>

        {/* Locate button */}
        <View style={styles.locateBtn}>
          <Ionicons name="locate-outline" size={20} color={colors.ink} />
        </View>
      </View>

      {/* Bottom panel */}
      <View style={styles.panel}>
        {/* Location name */}
        <Text style={styles.fieldLabel}>이 위치 이름</Text>
        <TextInput
          style={styles.field}
          value={locationName}
          onChangeText={setLocationName}
          placeholder="위치 이름"
          placeholderTextColor={colors.inkFaint}
        />

        {/* Radius */}
        <View style={styles.radiusHeader}>
          <Text style={styles.fieldLabel}>감지 반경</Text>
          <Text style={styles.radiusValue}>{formatRadius(radius)}</Text>
        </View>
        <RadiusSlider value={radius} onChange={setRadius} />
        <View style={styles.radiusRange}>
          <Text style={styles.rangeLabel}>50m</Text>
          <Text style={styles.rangeLabel}>1km</Text>
        </View>

        {/* CTA */}
        <Pressable style={styles.cta} onPress={() => router.back()}>
          <Text style={styles.ctaText}>이 위치로 정하기</Text>
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
    gap: 10,
    paddingHorizontal: spacing.screenH,
    paddingTop: Platform.OS === 'web' ? 16 : 56,
    paddingBottom: 12,
    backgroundColor: colors.paper,
    zIndex: 10,
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
  mapArea: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  geoWrapper: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  geo: {
    width: GEO_SIZE,
    height: GEO_SIZE,
    borderRadius: GEO_SIZE / 2,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.accent,
    backgroundColor: 'rgba(232,103,74,0.10)',
  },
  pinWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: '8%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinSticker: {
    marginTop: 2,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.ink,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderTopLeftRadius: 13,
    borderTopRightRadius: 11,
    borderBottomRightRadius: 13,
    borderBottomLeftRadius: 10,
    ...shadow.sticker,
  },
  pinStickerText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.ink,
  },
  searchBar: {
    position: 'absolute',
    top: 12,
    left: 14,
    right: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.line,
    ...radiusExact.card,
    paddingHorizontal: 13,
    paddingVertical: 11,
    ...shadow.card,
  },
  searchPlaceholder: {
    fontSize: 14.5,
    fontWeight: '500',
    color: colors.inkSoft,
  },
  locateBtn: {
    position: 'absolute',
    bottom: 14,
    right: 14,
    width: 40,
    height: 40,
    borderRadius: 11,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.card,
  },
  panel: {
    backgroundColor: colors.surface,
    borderTopWidth: 1.5,
    borderTopColor: colors.line,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: spacing.screenH,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 32 : 20,
    shadowColor: '#2c2a26',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
  },
  fieldLabel: {
    fontSize: 11.5,
    fontWeight: '700',
    color: colors.inkSoft,
    letterSpacing: 0.2,
    marginBottom: 7,
  },
  field: {
    borderWidth: 1.5,
    borderColor: colors.lineStrong,
    ...radiusExact.field,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 15,
    fontWeight: '500',
    color: colors.ink,
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  radiusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 9,
  },
  radiusValue: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.accent,
  },
  radiusRange: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  rangeLabel: {
    fontSize: 11.5,
    fontWeight: '500',
    color: colors.inkSoft,
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
});
