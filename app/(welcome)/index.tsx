import { StatusBar } from 'expo-status-bar';
import { Urbanist_400Regular, useFonts } from '@expo-google-fonts/urbanist';
import Welcome from 'components/Welcome';
import { useTheme } from 'theme/useTheme';
import '../global.css'
import { useEffect, useLayoutEffect } from 'react';
import { auth } from 'firebaseConfig';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { onAuthStateChanged } from 'firebase/auth';

export default function App() {
  const theme = useTheme();
  const [loaded, error] = useFonts({
    Urbanist_400Regular,
  });
  const router = useRouter()
  useLayoutEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user?.emailVerified) {
        router.replace("/(main)/home");
      } else if (user && !user.emailVerified) {
        router.replace("/(auth)/verify-email");
      } else {
        router.replace("/(auth)/login");
      }
    });

    return unsubscribe; // cleanup
  }, []);
  return (
    <>
      <Welcome />
      <StatusBar style="auto" />
    </>
  );
}
