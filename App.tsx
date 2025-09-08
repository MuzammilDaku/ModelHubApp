import { StatusBar } from 'expo-status-bar';
import { Urbanist_400Regular, useFonts } from '@expo-google-fonts/urbanist';
import './global.css';
import Welcome from 'components/Welcome';
import { useTheme } from 'theme/useTheme';
export default function App() {
  const theme = useTheme();
  const [loaded, error] = useFonts({
    Urbanist_400Regular,
  });
  return (
    <>
      <Welcome />
      <StatusBar style="auto" />
    </>
  );
}
