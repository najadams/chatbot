import React, { useEffect } from "react";
import { useRouter } from "expo-router";
import { ActivityIndicator, View, Alert } from "react-native";
import { colors } from "@/app/theme/colors";
import { useUser } from "@/context/UserContext";

export default function NewChatScreen() {
  const router = useRouter();
  const user = useUser();

  useEffect(() => {
    const createNewConversation = async () => {
      if (!user?.id) {
        Alert.alert("Error", "Please sign in to create a new chat", [
          { text: "OK", onPress: () => router.back() },
        ]);
        return;
      }

      try {
        const response = await fetch("http://localhost:8000/conversation", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: user.id,
            username: user.name || "User",
            display_name: user.name || "User",
            message: "Hello",
            platform: "mobile",
            language: "en-US",
            topic: "general",
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to create conversation");
        }

        const data = await response.json();
        router.replace(`/chat/${data.conversation_id}`);
      } catch (error) {
        console.error("Error creating conversation:", error);
        Alert.alert("Error", "Failed to create a new chat. Please try again.", [
          { text: "OK", onPress: () => router.back() },
        ]);
      }
    };

    createNewConversation();
  }, [router, user]);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.background,
      }}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}
