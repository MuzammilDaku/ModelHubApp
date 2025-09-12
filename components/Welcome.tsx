import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { colors } from "theme/colors";
import Logo from "./Logo";
import { CustomText } from "./Text";
import { useEffect, useState } from "react";
import { useRouter } from 'expo-router';
import GoogleLogin from "./GoogleLogin";


export default function Welcome() {
  const [loader, setLoader] = useState(true)
  useEffect(() => {
    setTimeout(() => {
      setLoader(false)
    }, 1000);
  }, [])

  const router = useRouter();
  return (
    <>
      {loader && <ActivityIndicator size="large" color="#0000ff" style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, zIndex: 9999 }} />}
      {!loader && <ScrollView
        contentContainerClassName="flex-1 justify-center"
        style={{ backgroundColor: colors.background }}
      >
        <View className="items-center mb-5 ">
          <Logo />
        </View>
        <View className="px-5 py-3">
          <CustomText style={{ fontFamily: 'Urbanist_400Regular' }} className="text-[26px] pt-1 font-semibold">Hey there 👋</CustomText>
          <CustomText className="text-[26px] pt-1 font-semibold">I’m ModelHub </CustomText>
          <CustomText className="text-[26px] pt-1 font-semibold">Your all-in-one AI buddy</CustomText>
        </View>
        <View className="px-5 py-10">
          <TouchableOpacity className="bg-black rounded-full py-4 mt-3 items-center justify-center" onPress={() => router.push('/(auth)/login')}>
            <CustomText className="text-white text-center text-[16px]">Sign in with email</CustomText>
          </TouchableOpacity>
        
        <GoogleLogin />
        </View>
        <View className="px-12 pt-10 text-center">
          <CustomText className="text-center text-[16px]">By signing in, you agree to our <CustomText className="underline">Terms of Service</CustomText> and <Text className="underline">Privacy Policy</Text></CustomText>
        </View>
      </ScrollView>}
    </>
  )
}