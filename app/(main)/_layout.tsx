import { Tabs } from "expo-router";
import Ionicons from '@expo/vector-icons/Ionicons';

export default function Layout() {
    return (
        <Tabs screenOptions={{ headerShown: true }}>
            <Tabs.Screen name="home" options={{ title: "Chats", tabBarIcon: ({ size, color }) => <Ionicons name="chatbubbles-outline" size={size / 1.2} color={color} /> }} />
            {/* <Stack.Screen name="home" options={{title:"Home"}}/> */}
        </Tabs>
    )
}
