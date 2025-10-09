import { Stack } from "expo-router/stack";
import { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import './global.css';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout(){
    useEffect(() => {
        // Hide splash screen after a brief delay for smooth transition
        const prepare = async () => {
            try {
                // Simulate minimum splash screen time for branding
                await new Promise(resolve => setTimeout(resolve, 1500));
            } catch (e) {
                console.warn(e);
            } finally {
                await SplashScreen.hideAsync();
            }
        };

        prepare();
    }, []);

    return (
        <Stack screenOptions={{headerShown:false}}>
            <Stack.Screen name="(welcome)/index" />
            <Stack.Screen name="(auth)/signup" />
            <Stack.Screen name="(auth)/login" />
            <Stack.Screen name="(auth)/verify-email" />
        </Stack>
    )
}