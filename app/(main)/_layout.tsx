import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function Layout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Chats',
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="chatbubbles-outline" size={size / 1.2} color={color} />
          ),
          headerShown: false,
        }}
      />

      <Tabs.Screen
        name="pricing"
        options={{
          title: 'Pricing',
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="wallet-outline" size={size / 1.2} color={color} />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          href: null, // This hides the tab from the tab bar
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
