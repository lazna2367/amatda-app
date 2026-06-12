import { Modal, View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, radiusExact, shadow } from '@/theme';
import { useAlertState, type AlertButton } from '@/store/alertStore';

export default function AlertModal() {
  const { alertState, hideAlert } = useAlertState();

  if (!alertState.visible) return null;

  const { title, message, buttons } = alertState;
  const isRow = buttons.length === 2;

  function handlePress(btn: AlertButton) {
    hideAlert();
    btn.onPress?.();
  }

  return (
    <Modal transparent animationType="fade" visible statusBarTranslucent>
      <View style={st.overlay}>
        <View style={st.card}>
          <View style={st.body}>
            <Text style={st.title}>{title}</Text>
            {message ? <Text style={st.message}>{message}</Text> : null}
          </View>
          <View style={[st.btnArea, isRow && st.btnAreaRow]}>
            {buttons.map((btn, i) => {
              const isDestructive = btn.style === 'destructive';
              const isCancel = btn.style === 'cancel';
              return (
                <Pressable
                  key={i}
                  onPress={() => handlePress(btn)}
                  style={({ pressed }) => [
                    st.btn,
                    isRow && st.btnFlex,
                    isDestructive && st.btnDestructive,
                    isCancel && st.btnCancel,
                    !isDestructive && !isCancel && st.btnDefault,
                    pressed && { opacity: 0.8 },
                  ]}
                >
                  <Text
                    style={[
                      st.btnText,
                      isDestructive && st.btnTextDestructive,
                      isCancel && st.btnTextCancel,
                    ]}
                  >
                    {btn.text}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const st = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(44, 42, 38, 0.45)',
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
    ...(shadow.pop as object),
  },
  body: {
    padding: 22,
    gap: 8,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.ink,
  },
  message: {
    fontSize: 14.5,
    color: colors.inkSoft,
    lineHeight: 22,
  },
  btnArea: {
    borderTopWidth: 1,
    borderTopColor: colors.line,
    padding: 14,
    gap: 8,
  },
  btnAreaRow: {
    flexDirection: 'row',
  },
  btn: {
    paddingVertical: 11,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnFlex: {
    flex: 1,
  },
  btnDefault: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.line,
    ...radiusExact.btn,
    shadowColor: '#2c2a26',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 0,
    elevation: 2,
  },
  btnDestructive: {
    backgroundColor: colors.accent,
    borderWidth: 1.5,
    borderColor: colors.coral600,
    ...radiusExact.btn,
    ...(shadow.btn as object),
  },
  btnCancel: {
    backgroundColor: 'transparent',
  },
  btnText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.ink,
  },
  btnTextDestructive: {
    color: colors.white,
  },
  btnTextCancel: {
    color: colors.inkSoft,
  },
});
