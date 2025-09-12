import { useState } from "react";
import { TextInput, TextInputProps, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function EmailInput(props: TextInputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: focused ? "#2563EB" : "#E5E7EB", 
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginBottom: 16,
        backgroundColor: "white",
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2, // Android shadow
      }}
    >
      {/* Email Icon */}
      <Ionicons
        name="mail-outline"
        size={20}
        color={focused ? "#2563EB" : "#9CA3AF"} // blue on focus, gray otherwise
        style={{ marginRight: 8 }}
      />

      {/* Input Field */}
      <TextInput
        {...props}
        placeholderTextColor="#9CA3AF"
        style={[
          {
            flex: 1,
            fontSize: 16,
            color: "#111827", // dark text
          },
          props.style,
        ]}
        onFocus={(e) => {
          setFocused(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          props.onBlur?.(e);
        }}
      />
    </View>
  );
}
