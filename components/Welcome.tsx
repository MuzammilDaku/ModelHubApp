import { Image, ScrollView, Text, Touchable, TouchableOpacity, View } from "react-native";
import { colors } from "theme/colors";
import Logo from "./Logo";
import { CustomText } from "./Text";

export default function Welcome() {
  return (
    <ScrollView
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
        <TouchableOpacity className="bg-black rounded-full py-4 mt-3 items-center justify-center">
          <CustomText className="text-white text-center text-[16px]">Sign in with email</CustomText>
        </TouchableOpacity>
        <TouchableOpacity className="bg-white rounded-full py-4 mt-3  flex flex-row gap-3 items-center justify-center">
          <Image source={require("../assets/google.png")} className="h-[23px] w-[23px]" />
          <CustomText className="text-black text-center text-[16px]">Continue With Google</CustomText>
        </TouchableOpacity>
      </View>
      <View className="px-12 pt-10 text-center">
        <CustomText className="text-center text-[16px]">By signing in, you agree to our <CustomText className="underline">Terms of Service</CustomText> and <Text className="underline">Privacy Policy</Text></CustomText>
      </View>
    </ScrollView>
  )
}