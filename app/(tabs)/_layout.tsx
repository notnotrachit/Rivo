import { Tabs } from 'expo-router'
import React from 'react'

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      {/* The index redirects to the home screen */}
      <Tabs.Screen name="index" options={{ tabBarItemStyle: { display: 'none' } }} />
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarItemStyle: { display: 'none' },
        }}
      />
    </Tabs>
  )
}
