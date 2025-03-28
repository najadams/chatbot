import { UserProvider } from "@/context/UserContext";
import { Stack } from "expo-router";
import React from "react";
import { SafeAreaView } from "react-native";

export default function MainLayout() {
  return (
      <SafeAreaView style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          {/* <Stack.Screen name="schedule" options={{ title: "Schedule" }} />
          <Stack.Screen name="profile" options={{ title: "Profile" }} />
          <Stack.Screen
            name="notifications"
            options={{ title: "Notifications" }}
          /> */}
        </Stack>
      </SafeAreaView>
  );
}
