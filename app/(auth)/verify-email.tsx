"use client"

import { useState, useEffect } from "react"
import { ScrollView, View, TouchableOpacity } from "react-native"
import { colors } from "theme/colors"
import { useRouter } from "expo-router"
import Logo from "components/Logo"
import { CustomText } from "components/Text"
import { AntDesign } from "@expo/vector-icons"
import { sendEmailVerification } from "firebase/auth"
import { auth } from "firebaseConfig"

export default function VerifyEmail() {
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState("")
    const [canResend, setCanResend] = useState(false)
    const [countdown, setCountdown] = useState(30)
    const router = useRouter()

    useEffect(() => {
        let timer: NodeJS.Timeout | any;
        let countdownInterval: NodeJS.Timeout

        if (!canResend && countdown > 0) {
            countdownInterval = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        setCanResend(true)
                        return 0
                    }
                    return prev - 1
                })
            }, 1000)
        }

        return () => {
            clearTimeout(timer)
            clearInterval(countdownInterval)
        }
    }, [canResend, countdown])

    const handleSendVerification = async () => {
        try {
            setIsLoading(true)
            setCanResend(false)
            setCountdown(30)
            if (auth.currentUser) {
                await sendEmailVerification(auth.currentUser)
                setMessage(
                    "Verification email sent! Please check your inbox. If you don't see it, check your Spam or Junk folder.",
                )
            } else {
                setMessage("No user is signed in.")
            }
        } catch (error) {
            setMessage("Failed to send verification email.")
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <ScrollView
            contentContainerStyle={{
                flexGrow: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: colors.background || "#f8f9ff",
                paddingVertical: 40,
                paddingHorizontal: 20,
            }}
        >
            {/* Logo Container */}
            <View
                style={{
                    alignItems: "center",
                    marginBottom: 40,
                }}
            >
                <Logo />
            </View>

            {/* Header Section */}
            <View
                style={{
                    paddingHorizontal: 20,
                    paddingVertical: 12,
                    alignItems: "center",
                    marginBottom: 30,
                }}
            >
                <CustomText
                    style={{
                        fontSize: 28,
                        fontWeight: "600",
                        textAlign: "center",
                        color: "#1a1a1a",
                        marginBottom: 8,
                        letterSpacing: -0.5,
                    }}
                >
                    Verify Your Email
                </CustomText>
                <CustomText
                    style={{
                        fontSize: 16,
                        textAlign: "center",
                        color: "#6b7280",
                        lineHeight: 22,
                        maxWidth: 280,
                    }}
                >
                    Please check your email inbox for the verification link.
                </CustomText>
                <CustomText style={{ marginTop: 12 }} className="text-[16px]">{auth?.currentUser?.email}</CustomText>
            </View>

            {/* Main Content */}
            <View
                style={{
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                    alignItems: "center",
                    width: "100%",
                    maxWidth: 350,
                }}
            >
                {/* Email Icon */}
                <View
                    style={{
                        backgroundColor: "#e8f2ff",
                        borderRadius: 50,
                        padding: 20,
                        marginBottom: 24,
                    }}
                >
                    <AntDesign name="mail" size={50} color={colors.primary || "#3b82f6"} />
                </View>

                {/* Main Message */}
                <CustomText
                    style={{
                        textAlign: "center",
                        fontSize: 18,
                        color: "#374151",
                        fontWeight: "500",
                        marginBottom: 16,
                        lineHeight: 24,
                    }}
                >
                    We've sent you a verification email.
                </CustomText>

                {/* Instructions */}
                <CustomText
                    style={{
                        textAlign: "center",
                        fontSize: 16,
                        color: "#6b7280",
                        lineHeight: 22,
                        marginBottom: 32,
                        paddingHorizontal: 10,
                    }}
                >
                    Go to your inbox and click on the "Verify Email" button. If you don't see the email, check your Spam or Junk
                    folder.
                </CustomText>

                {/* Back to Sign In Button */}
                <TouchableOpacity
                    style={{
                        backgroundColor: "#1a1a1a",
                        borderRadius: 25,
                        paddingVertical: 16,
                        paddingHorizontal: 32,
                        width: "100%",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: 16,
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                        elevation: 3,
                    }}
                    onPress={() => router.push("/(auth)/login")}
                >
                    <CustomText
                        style={{
                            color: "#ffffff",
                            textAlign: "center",
                            fontSize: 16,
                            fontWeight: "600",
                        }}
                    >
                        Back to Sign In
                    </CustomText>
                </TouchableOpacity>

                {/* Resend Button or Timer */}
                {canResend ? (
                    <TouchableOpacity
                        style={{
                            backgroundColor: colors.primary || "#3b82f6",
                            borderRadius: 25,
                            paddingVertical: 14,
                            paddingHorizontal: 32,
                            width: "100%",
                            alignItems: "center",
                            justifyContent: "center",
                            marginBottom: 16,
                            shadowColor: colors.primary || "#3b82f6",
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.2,
                            shadowRadius: 4,
                            elevation: 3,
                            opacity: isLoading ? 0.7 : 1,
                        }}
                        onPress={handleSendVerification}
                        disabled={isLoading}
                    >
                        <CustomText
                            style={{
                                color: "#ffffff",
                                textAlign: "center",
                                fontSize: 16,
                                fontWeight: "600",
                            }}
                        >
                            Resend Verification Email
                        </CustomText>
                    </TouchableOpacity>
                ) : (
                    <View
                        style={{
                            backgroundColor: "#f8fafc",
                            borderRadius: 20,
                            paddingVertical: 12,
                            paddingHorizontal: 20,
                            marginBottom: 16,
                            borderWidth: 1,
                            borderColor: "#e2e8f0",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <AntDesign name="clockcircleo" size={16} color="#64748b" style={{ marginRight: 8 }} />
                            <CustomText
                                style={{
                                    textAlign: "center",
                                    color: "#64748b",
                                    fontSize: 14,
                                    fontWeight: "500",
                                }}
                            >
                                Resend available in {countdown} seconds
                            </CustomText>
                        </View>
                    </View>
                )}

                {/* Loading Indicator */}
                {isLoading && (
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center",
                            marginTop: 20,
                            backgroundColor: "#f3f4f6",
                            paddingVertical: 12,
                            paddingHorizontal: 20,
                            borderRadius: 20,
                        }}
                    >
                        <AntDesign name="loading1" size={20} color={colors.primary || "#3b82f6"} />
                        <CustomText
                            style={{
                                marginLeft: 8,
                                fontSize: 16,
                                color: "#374151",
                                fontWeight: "500",
                            }}
                        >
                            Sending...
                        </CustomText>
                    </View>
                )}

                {/* Status Message */}
                {message ? (
                    <View
                        style={{
                            backgroundColor: message.includes("Failed") ? "#fef2f2" : "#f0f9ff",
                            borderRadius: 12,
                            padding: 16,
                            marginTop: 20,
                            borderLeftWidth: 4,
                            borderLeftColor: message.includes("Failed") ? "#ef4444" : "#3b82f6",
                        }}
                    >
                        <CustomText
                            style={{
                                textAlign: "center",
                                fontSize: 15,
                                color: message.includes("Failed") ? "#dc2626" : "#1e40af",
                                lineHeight: 20,
                                fontWeight: "500",
                            }}
                        >
                            {message}
                        </CustomText>
                    </View>
                ) : null}

                <TouchableOpacity
                    style={{
                        backgroundColor: "#1a1a1a",
                        borderRadius: 25,
                        paddingVertical: 16,
                        paddingHorizontal: 32,
                        width: "100%",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: 16,
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                        elevation: 3,
                    }}
                    onPress={() => router.push("/(auth)/signup")}
                >
                    <CustomText
                        style={{
                            color: "#ffffff",
                            textAlign: "center",
                            fontSize: 16,
                            fontWeight: "600",
                        }}
                    >
                        Change Email Address
                    </CustomText>
                </TouchableOpacity>
            </View>
        </ScrollView>
    )
}
