import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { colors } from "theme/colors";
import Logo from "./Logo";
import { CustomText } from "./Text";
import { auth } from "firebaseConfig";
import { useEffect, useState } from "react";
import { GoogleAuthProvider, signInWithCredential, } from "firebase/auth";
import { useRouter } from 'expo-router';
import * as Google from "expo-auth-session/providers/google";
import * as AuthSession from 'expo-auth-session';


export default function Welcome() {
  const [loader, setLoader] = useState(true)

  const redirectUri = AuthSession.makeRedirectUri({
    // path:"oauth/callback"
  });
  console.log("redirectUri", redirectUri);
  useEffect(() => {
    setTimeout(() => {
      setLoader(false)
    }, 1000);
  }, [])

  // const redirectUri = AuthSession.getRedirectUrl()
  // console.log("redirectUri", redirectUri);
  const [request, response, promptAsync] = Google.useAuthRequest({
    // clientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
    redirectUri: redirectUri,

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
      </ScrollView>}
    </>
  )
}