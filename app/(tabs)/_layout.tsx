import { Tabs } from 'expo-router'
import React from 'react'
import { UiIconSymbol } from '@/components/ui/ui-icon-symbol'
import { Colors } from '@/constants/colors'
import { useColorScheme } from '@/hooks/use-color-scheme'

export default function TabLayout() {
  const theme = useColorScheme() ?? 'light'
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors[theme].tabIconSelected,
        tabBarInactiveTintColor: Colors[theme].tabIconDefault,
        tabBarStyle: {
          backgroundColor: Colors[theme].background,
          borderTopColor: Colors[theme].border,
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
      }}
    >
      {/* The index redirects to the home screen */}
      <Tabs.Screen name="index" options={{ tabBarItemStyle: { display: 'none' } }} />
      {/* Hide deprecated tabs */}
      <Tabs.Screen name="account" options={{ tabBarItemStyle: { display: 'none' } }} />
      <Tabs.Screen name="demo" options={{ tabBarItemStyle: { display: 'none' } }} />
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <UiIconSymbol name="house.fill" color={color} size={size ?? 24} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <UiIconSymbol name="gearshape.fill" color={color} size={size ?? 24} />
          ),
        }}
      />
    </Tabs>
  )
}
