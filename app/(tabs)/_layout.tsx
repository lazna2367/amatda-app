import { Tabs } from 'expo-router';
import { Platform, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/theme';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

function TabIcon({
  name,
  activeName,
  focused,
  color,
}: {
  name: IoniconName;
  activeName: IoniconName;
  focused: boolean;
  color: string;
}) {
  return <Ionicons name={focused ? activeName : name} size={22} color={color} />;
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.inkFaint,
        tabBarLabelPosition: 'below-icon',
        tabBarShowLabel: true,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.label,
      }}
    >
      <Tabs.Screen
        name="bags"
        options={{
          title: '내 가방',
          tabBarLabelPosition: 'below-icon',
          tabBarShowLabel: true,
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name="bag-outline" activeName="bag" focused={focused} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: '알림',
          tabBarLabelPosition: 'below-icon',
          tabBarShowLabel: true,
          tabBarIcon: ({ focused, color }) => (
            <TabIcon
              name="notifications-outline"
              activeName="notifications"
              focused={focused}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: '설정',
          tabBarLabelPosition: 'below-icon',
          tabBarShowLabel: true,
          tabBarIcon: ({ focused, color }) => (
            <TabIcon
              name="settings-outline"
              activeName="settings"
              focused={focused}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.surface,
    borderTopWidth: 1.5,
    borderTopColor: colors.line,
    paddingTop: 8,
    paddingBottom: 12,
    height: 'auto'
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 0,
  },
});
