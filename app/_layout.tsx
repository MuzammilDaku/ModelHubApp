import { Stack } from "expo-router/stack";
import './global.css'

export default function RootLayout(){
    return (
        <Stack screenOptions={{headerShown:false}}>
            <Stack.Screen name="(welcome)/index" />
            <Stack.Screen name="(auth)/signup" />
            <Stack.Screen name="(auth)/login" />
            <Stack.Screen name="(auth)/verify-email" />
        </Stack>
    )
}