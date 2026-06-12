import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { colors } from '@/theme';

// Handles cold-start deep link: amatda://auth/callback?code=xxx
export default function AuthCallback() {
  const params = useLocalSearchParams<{ code?: string }>();
  const router = useRouter();

  useEffect(() => {
    const code = params.code;
    if (!code) {
      router.replace('/(auth)/login');
      return;
    }

    const fullUrl = `amatda://auth/callback?code=${code}`;
    supabase.auth
      .exchangeCodeForSession(fullUrl)
      .then(({ error }) => {
        if (error) router.replace('/(auth)/login');
        // success → _layout.tsx onAuthStateChange redirects to /(tabs)/bags
      });
  }, [params.code]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.paper, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator color={colors.accent} size="large" />
    </View>
  );
}
