// components/ThemedText.tsx
import { Text, TextProps } from "react-native";

export function CustomText(props: TextProps) {
  return (
    <Text
      {...props}
      style={[{ fontFamily: "Urbanist_400Regular" }, props.style]}
    />
  );
}