import { Appearance, useColorScheme } from 'react-native';

export type Theme = 'light' | 'dark';

export const useTheme = (): Theme => {
//   const colorScheme = useColorScheme();

//   if (colorScheme) {
//     return colorScheme;
//   }

  const systemPreference = Appearance.getColorScheme();
  return systemPreference === 'dark' ? 'dark' : 'light';
}