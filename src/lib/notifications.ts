import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

export function setupNotificationHandler() {
  if (Platform.OS === 'web') return;

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });

  // Android notification channel
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('geofencing', {
      name: '위치 알림',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#e8674a',
    });
  }
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (Platform.OS === 'web') return false;
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}
