import { StatusBar } from 'expo-status-bar';
import { Urbanist_400Regular, useFonts } from '@expo-google-fonts/urbanist';
import Welcome from 'components/Welcome';
import { useTheme } from 'theme/useTheme';
import '../global.css';
import { useEffect, useLayoutEffect } from 'react';
import { auth } from 'firebaseConfig';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { onAuthStateChanged } from 'firebase/auth';
import { api } from 'server/api';
import { useProfileStore } from 'store/profile/store';

export default function App() {
  const theme = useTheme();
  const [loaded, error] = useFonts({
    Urbanist_400Regular,
  });
  const router = useRouter();

  const setUser = useProfileStore((state) => state.setUser);
  const setAppLoading = useProfileStore((state)=>state.setAppLoading)
  // const appL

  useEffect(() => {
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // setAppLoading(true)
      const handleUser = async () => {
      setAppLoading(true)
       try{
         if (user?.emailVerified && user.email) {
          const u = await api.getUser(user.email); 
          setUser(u);
          router.replace('/(main)/home');
        } else if (user && !user.emailVerified) {
          router.replace('/(auth)/verify-email');
        } else {
          router.replace('/(auth)/login');
        }
      }
        catch(error) {
          console.log(error)
        }
        finally {
          setAppLoading(false)
        }
       }
      
      handleUser();
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
