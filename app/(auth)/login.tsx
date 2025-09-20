import { useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { colors } from 'theme/colors';
import { useRouter } from 'expo-router';
import Logo from 'components/Logo';
import { CustomText } from 'components/Text';
import EmailInput from 'components/Inputs/EmailInput';
import PasswordInput from 'components/Inputs/PasswordInput';

import { auth } from 'firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { api } from 'server/api';
import { useProfileStore } from 'store/profile/store';
export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const setUser = useProfileStore((state) => state.setUser);
  const handleLogin = async () => {
    try {
      setIsLoading(true);
      const res = await signInWithEmailAndPassword(auth, email, password);
      console.log('User signed in:', res.user);
      if (res.user.emailVerified) {
        if (res.user.email) {
          const user = await api.getUser(res?.user?.email);
          setUser(user);
        }
        router.push('/(main)/home');
      } else if (res.user.emailVerified === false) {
        router.replace('/(auth)/verify-email');
      }
    } catch (error: { code?: string } | any) {
      if (error) {
        alert('Invalid Credentials');
      }
    } finally {
      setIsLoading(false);
    }
    // Handle login logic here
  };

  return (
    <ScrollView
      contentContainerClassName="flex-1 justify-center"
      style={{ backgroundColor: colors.background }}>
      <View className="mb-5 items-center">
        <Logo />
      </View>
      <View className="px-5 py-3">
        <CustomText className="pt-1 text-[26px] font-semibold">Sign In</CustomText>
        <CustomText className="pt-1 text-[16px] text-gray-500">Login to your account</CustomText>
      </View>
      <View className="px-5 py-5">
        <EmailInput placeholder="Enter Your Email" value={email} onChangeText={setEmail} />
        <PasswordInput placeholder="Enter Password" value={password} onChangeText={setPassword} />
        <TouchableOpacity
          className="mt-3 items-center justify-center rounded-full bg-black py-4"
          disabled={isLoading || email.trim() === '' || password.trim() === ''}
          onPress={handleLogin}>
          {!isLoading ? (
            <CustomText className="text-center text-[16px] text-white">Sign In</CustomText>
          ) : (
            <ActivityIndicator color={'#fefefe'} />
          )}
        </TouchableOpacity>
        <View className="mt-10" style={{ marginTop: 20 }}>
          <TouchableOpacity className="pt-12" onPress={() => router.push('/(auth)/signup')}>
            <CustomText className="text-center text-[16px] text-gray-600">
              Don't have an account?{' '}
              <Text className="underline" onPress={() => router.push('/(auth)/signup')}>
                Sign up
              </Text>
            </CustomText>
          </TouchableOpacity>
        </View>
      </View>
      <View className="my-12 px-12 text-center" style={{ marginTop: 10 }}>
        <CustomText className="text-center text-[16px]">
          By signing in, you agree to our{' '}
          <CustomText className="underline">Terms of Service</CustomText> and
          <Text className="underline"> Privacy Policy</Text>
        </CustomText>
      </View>
    </ScrollView>
  );
}
