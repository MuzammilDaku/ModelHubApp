import { useState } from "react";
import { TextInput, TextInputProps, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function PasswordInput(props: TextInputProps) {
  const [focused, setFocused] = useState(false);
  const [secure, setSecure] = useState(true);

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: focused ? "#2563EB" : "#E5E7EB", // blue when focused, gray otherwise
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginBottom: 16,
        backgroundColor: "white",
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
      }}
    >
      {/* Lock Icon */}
      <Ionicons
        name="lock-closed-outline"
        size={20}
        color={focused ? "#2563EB" : "#9CA3AF"}
        style={{ marginRight: 8 }}
      />

      {/* Input Field */}
      <TextInput
        {...props}
        secureTextEntry={secure}
        placeholderTextColor="#9CA3AF"
        style={[
          {
            flex: 1,
            fontSize: 16,
            color: "#111827",
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

      {/* Show/Hide Password Toggle */}
      <TouchableOpacity onPress={() => setSecure(!secure)}>
        <Ionicons
          name={secure ? "eye-off-outline" : "eye-outline"}
          size={20}
          color="#6B7280"
        />
      </TouchableOpacity>
    </View>
  );
}
