import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#0f0f1a' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: '700' },
          contentStyle: { backgroundColor: '#0f0f1a' },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="auth" options={{ title: 'Sign In', presentation: 'modal' }} />
        <Stack.Screen name="camera" options={{ title: 'Scan Plate', headerShown: false }} />
        <Stack.Screen name="plate/[id]" options={{ title: 'Plate Details' }} />
        <Stack.Screen
          name="rate/[id]"
          options={{ title: 'Rate Driver', presentation: 'modal' }}
        />
        <Stack.Screen
          name="claim/[id]"
          options={{ title: 'Claim This Plate', presentation: 'modal' }}
        />
        <Stack.Screen
          name="search"
          options={{ title: 'Search Plates' }}
        />
      </Stack>
    </>
  );
}
