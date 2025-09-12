import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { colors } from "theme/colors";
import { useRouter } from "expo-router";
import Logo from "components/Logo";
import { CustomText } from "components/Text";
import EmailInput from "components/Inputs/EmailInput";
import PasswordInput from "components/Inputs/PasswordInput";
import '../global.css'
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "firebaseConfig";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async () => {
    try {
      setIsLoading(true);
      const res = await createUserWithEmailAndPassword(auth, email, password)
      console.log(res);
      router.push('/(auth)/verify-email');
    }
    catch (error: { code?: string } | any) {
      console.log(error.code, "error");
      if (error.code === 'auth/email-already-in-use') {
        alert('Email already in use');
      }
      else if (error.code === 'auth/invalid-email') {
        alert('Invalid email');
      }
      else if (error.code === 'auth/weak-password error') {
        alert('Weak password');
      }
      else {
        alert('Something went wrong');
      }
    }
    finally {
      setIsLoading(false);
    }
  };


  return (
    <ScrollView
      contentContainerClassName="flex-1 justify-center"
      style={{ backgroundColor: colors.background }}
    >
      <View className="items-center mb-5">
        <Logo />
      </View>
      <View className="px-5 py-3">
        <CustomText className="text-[26px] pt-1 font-semibold">Create Account</CustomText>
        <CustomText className="text-[16px] pt-1 text-gray-500">Sign up to get started</CustomText>
      </View>
      <View className="px-5 py-5">
        <EmailInput placeholder="Please Enter Your Email" onChangeText={(value) => setEmail(value)} value={email} />
        <PasswordInput placeholder="Enter Password"
          onChangeText={(value) => setPassword(value)}
          value={password}
        />
        <TouchableOpacity
          className="bg-black rounded-full py-4 mt-3 items-center justify-center"
          onPress={handleSignup}
          disabled={!email || !password || isLoading}
          style={{ backgroundColor: !email || !password ? colors.gray : colors.black }}
        >
          {isLoading ? (
            <ActivityIndicator color={"#fefefe"} />
          ) : <CustomText className="text-white text-center text-[16px]">Sign Up</CustomText>}

        </TouchableOpacity>
        <View className="mt-10"
          style={{ marginTop: 20 }}
        >
          <TouchableOpacity
            className="pt-12"
            onPress={() => router.push("/(auth)/signin")}
          >
            <CustomText className="text-center text-[16px] text-gray-600 py">
              Already have an account? <Text className="underline" onPress={() => router.push('/(auth)/login')}>Sign in</Text>
            </CustomText>
          </TouchableOpacity>

        </View>
      </View>
      <View className="px-12 my-12 text-center"
        style={{ marginTop: 10 }}
      >
        <CustomText className="text-center text-[16px]">
          By signing up, you agree to our
          <CustomText className="underline">Terms of Service</CustomText> and
          <Text className="underline"> Privacy Policy</Text>
        </CustomText>
      </View>
    </ScrollView>
  );
}