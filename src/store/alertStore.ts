import { createContext, useContext, useState, useCallback, type ReactNode, createElement } from 'react';

export type AlertButton = {
  text: string;
  style?: 'default' | 'cancel' | 'destructive';
  onPress?: () => void;
};

export type AlertConfig = {
  title: string;
  message?: string;
  buttons: AlertButton[];
};

type AlertState = AlertConfig & { visible: true } | { visible: false };

type AlertContextValue = {
  alertState: AlertState;
  showAlert: (config: AlertConfig) => void;
  hideAlert: () => void;
};

const AlertContext = createContext<AlertContextValue | null>(null);

export function AlertProvider({ children }: { children: ReactNode }) {
  const [alertState, setAlertState] = useState<AlertState>({ visible: false });

  const showAlert = useCallback((config: AlertConfig) => {
    setAlertState({ visible: true, ...config });
  }, []);

  const hideAlert = useCallback(() => {
    setAlertState({ visible: false });
  }, []);

  return createElement(AlertContext.Provider, { value: { alertState, showAlert, hideAlert } }, children);
}

export function useAlert() {
  const ctx = useContext(AlertContext);
  if (!ctx) throw new Error('useAlert must be used within AlertProvider');
  return ctx.showAlert;
}

export function useAlertState() {
  const ctx = useContext(AlertContext);
  if (!ctx) throw new Error('useAlertState must be used within AlertProvider');
  return { alertState: ctx.alertState, hideAlert: ctx.hideAlert };
}
