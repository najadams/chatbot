import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { auth } from "@/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { UserProvider, UserContextType } from "@/context/UserContext";
import { Slot } from "expo-router";
import Page from ".";
import { UserStateType } from "@/constants/types";

// Define the user type

export default function AuthGuard() {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const router = useRouter();
  const [initialUserState, setInitialUserState] =
    useState<UserContextType>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authenticatedUser) => {
      if (authenticatedUser) {
        setInitialUserState({
          name: authenticatedUser.displayName || "User",
          email: authenticatedUser.email || "",
          phone: authenticatedUser.phoneNumber || "",
          emailverified: authenticatedUser.emailVerified || false,
          isanonymous: authenticatedUser.isAnonymous || false,
          role: "User", // Replace with actual role from Firestore
          profilePicture:
            authenticatedUser.photoURL || "https://via.placeholder.com/150",
        });

        setCheckingAuth(false);
        router.replace("/(main)/(tabs)/home");
      } else {
        setCheckingAuth(false);
        router.replace("/(auth)/auth");
      }
    });

    return () => unsubscribe();
  }, []);

  if (checkingAuth) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  return (
    <UserProvider initialUser={initialUserState}>
      <Slot />
      {/* <Page onUserUpdated={onUserUpdated} /> */}
    </UserProvider>
  );
}
