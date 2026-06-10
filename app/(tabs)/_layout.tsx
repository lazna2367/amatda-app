import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#e8674a',
        tabBarInactiveTintColor: '#9e9b95',
        tabBarStyle: { backgroundColor: '#fff', borderTopColor: '#e8e6e0' },
      }}
    >
      <Tabs.Screen name="bags" options={{ title: '내 가방' }} />
      <Tabs.Screen name="notifications" options={{ title: '알림' }} />
      <Tabs.Screen name="settings" options={{ title: '설정' }} />
    </Tabs>
  );
}
