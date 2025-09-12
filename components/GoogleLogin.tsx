
import { CustomText } from "./Text";
import { auth } from "firebaseConfig";
import { useEffect } from "react";
import { GoogleAuthProvider, signInWithCredential, } from "firebase/auth";
import * as Google from "expo-auth-session/providers/google";
import { Image, TouchableOpacity } from "react-native";


export default function Welcome() {

    const [request, response, promptAsync] = Google.useAuthRequest({
        androidClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
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

    return (
        <TouchableOpacity className="bg-white rounded-full py-4 mt-3  flex flex-row gap-3 items-center justify-center"
            onPress={() => {
                promptAsync();
            }}
        >
            <Image source={require("../assets/google.png")} className="h-[23px] w-[23px]" />
            <CustomText className="text-black text-center text-[16px]">Continue With Google</CustomText>
        </TouchableOpacity>
    )
}