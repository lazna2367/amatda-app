import 'react-native-url-polyfill/auto';
import '@/lib/geofencing'; // register background task at module level
import { Slot, useRouter, useSegments, useRootNavigationState } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { AlertProvider } from '@/store/alertStore';
import AlertModal from '@/components/AlertModal';
import { setupNotificationHandler } from '@/lib/notifications';
import { requestBackgroundLocationPermission } from '@/lib/geofencing';

setupNotificationHandler();

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const navigationState = useRootNavigationState();
  const [session, setSession] = useState<Session | null | undefined>(undefined);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!navigationState?.key) return;
    if (session === undefined) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inCallbackRoute = segments[0] === 'auth';

    if (!session && !inAuthGroup && !inCallbackRoute) {
      router.replace('/(auth)/login');
    } else if (session && inAuthGroup) {
      router.replace('/(tabs)/bags');
    }
  }, [session, segments, navigationState?.key]);

  // 로그인 후 백그라운드 위치 권한 요청
  useEffect(() => {
    if (session) {
      requestBackgroundLocationPermission();
    }
  }, [session]);

  return (
    <AlertProvider>
      <SafeAreaProvider>
        <Slot />
        <AlertModal />
      </SafeAreaProvider>
    </AlertProvider>
  );
}

