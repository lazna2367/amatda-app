import { View, Text, StyleSheet } from 'react-native';
import { colors, radiusExact, shadow } from '@/theme';

type Props = {
  name: string;
  emoji: string;
  small?: boolean;
};

export function ItemChip({ name, emoji, small }: Props) {
  return (
    <View style={[styles.chip, small && styles.chipSm]}>
      <View style={[styles.ico, small && styles.icoSm]}>
        <Text style={[styles.icoText, small && styles.icoTextSm]}>{emoji}</Text>
      </View>
      <Text style={[styles.label, small && styles.labelSm]}>{name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 7,
    paddingLeft: 7,
    paddingRight: 13,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.ink,
    ...radiusExact.chip,
    ...shadow.sticker,
  },
  chipSm: {
    paddingVertical: 5,
    paddingLeft: 5,
    paddingRight: 10,
    gap: 6,
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
  icoSm: {
    width: 21,
    height: 21,
  },
  icoTextSm: {
    fontSize: 12,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.ink,
    letterSpacing: -0.1,
  },
  labelSm: {
    fontSize: 13,
  },
});
