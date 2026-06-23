import { Tabs } from 'expo-router';
import { Text } from 'react-native';

function TabIcon({ emoji, label }: { emoji: string; label: string }) {
  return <Text style={{ fontSize: 22 }}>{emoji}</Text>;
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#0f0f1a',
          borderTopColor: '#1e1e2e',
        },
        tabBarActiveTintColor: '#7c6ff7',
        tabBarInactiveTintColor: '#555',
        headerStyle: { backgroundColor: '#0f0f1a' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: '700' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 22 }}>🏠</Text>,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'My Plates',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 22 }}>🚗</Text>,
        }}
      />
    </Tabs>
  );
}
