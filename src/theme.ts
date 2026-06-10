export const colors = {
  // warm neutrals
  paper: '#f4f1ea',
  surface: '#fffefb',
  surface2: '#faf8f2',
  ink: '#2c2a26',
  inkSoft: '#6f6b62',
  inkFaint: '#a6a092',
  line: '#e6e1d5',
  lineStrong: '#d3cdbe',
  hairline: '#efebe1',

  // coral
  coral50: '#fdeee9',
  coral100: '#fbe0d7',
  coral200: '#f6c5b5',
  coral300: '#f0a088',
  coral400: '#ec7e5e',
  coral500: '#e8674a',
  coral600: '#d24e2f',
  coral700: '#ad3c21',

  // marker yellow (이모지 타일 배경 전용)
  mark: '#ffe7a0',
  markSoft: '#fff4d2',
  markEdge: '#f0cf7e',

  // semantic
  accent: '#e8674a',
  accentSoft: '#fbe0d7',
  accentInk: '#ad3c21',
  good: '#e8674a',
  goodSoft: '#fdeee9',
  danger: '#d24e2f',

  white: '#ffffff',
} as const;

// 비대칭 border-radius (스티커 DNA)
export const radius = {
  card: { borderRadius: 18 },       // 18/16/19/16 → RN은 단일값 근사
  btn: { borderRadius: 14 },
  chip: { borderRadius: 13 },
  tile: { borderRadius: 12 },
  field: { borderRadius: 12 },
  sheet: { borderTopLeftRadius: 22, borderTopRightRadius: 22 },
} as const;

// 비대칭 radius 정확 버전 (개별 모서리)
export const radiusExact = {
  card: {
    borderTopLeftRadius: 18,
    borderTopRightRadius: 16,
    borderBottomRightRadius: 19,
    borderBottomLeftRadius: 16,
  },
  btn: {
    borderTopLeftRadius: 14,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 15,
    borderBottomLeftRadius: 13,
  },
  chip: {
    borderTopLeftRadius: 13,
    borderTopRightRadius: 11,
    borderBottomRightRadius: 13,
    borderBottomLeftRadius: 10,
  },
  tile: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 11,
    borderBottomRightRadius: 13,
    borderBottomLeftRadius: 10,
  },
  field: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 11,
    borderBottomRightRadius: 13,
    borderBottomLeftRadius: 11,
  },
} as const;

// flat offset shadow (iOS)
export const shadow = {
  card: {
    shadowColor: '#2c2a26',
    shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 0,
    elevation: 2,
  },
  raise: {
    shadowColor: '#2c2a26',
    shadowOffset: { width: 3, height: 4 },
    shadowOpacity: 0.09,
    shadowRadius: 0,
    elevation: 3,
  },
  sticker: {
    shadowColor: '#2c2a26',
    shadowOffset: { width: 1.5, height: 2.5 },
    shadowOpacity: 0.12,
    shadowRadius: 0,
    elevation: 2,
  },
  btn: {
    shadowColor: '#cf492a',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.28,
    shadowRadius: 0,
    elevation: 3,
  },
  pop: {
    shadowColor: '#2c2a26',
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 12,
  },
} as const;

export const typography = {
  // Pretendard Variable — 앱 전체 기본
  family: 'Pretendard Variable',
  weights: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  screenH: 18,  // 좌우 화면 여백
} as const;
