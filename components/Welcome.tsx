import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { colors } from "theme/colors";
import Logo from "./Logo";
import { CustomText } from "./Text";
import { auth } from "firebaseConfig";
import { useEffect } from "react";
import {  GoogleAuthProvider,  signInWithCredential, } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

import * as Google from "expo-auth-session/providers/google";

export default function Welcome() {


  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;
      const credential = GoogleAuthProvider.credential(
        null,
        authentication?.accessToken
      );
      signInWithCredential(auth, credential)
        .then((userCredential) => {
          console.log("Google user:", userCredential.user);
          alert("Logged in with Google!");
          alert(JSON.stringify(userCredential.user));
        })
        .catch((err) => console.error("Firebase error:", err));
    }
  }, [response]);

  useEffect(() => {
    const user = auth.currentUser;
    console.log("user", user);
    const storage = AsyncStorage.getAllKeys().then((res) => { console.log("storage", res) }).catch((err) => { console.log(err) });
  }, [auth])

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
        <TouchableOpacity className="bg-white rounded-full py-4 mt-3  flex flex-row gap-3 items-center justify-center"
          onPress={() => {
            promptAsync();
          }}
        >
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