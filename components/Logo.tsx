import { Image, View } from "react-native";

export default function Logo () {
    return (
        <View className="bg-black rounded-full p-5">
            <Image source={require("../assets/logo.png")} alt="Image" className="h-[120px] w-[120px]" style={{objectFit:'contain'}}/>
        </View>
    )
}