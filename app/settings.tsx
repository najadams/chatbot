import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useUser, useSetUser } from "@/context/UserContext";
import { useRouter } from "expo-router";
import { auth } from "@/firebaseConfig";
import { signOut } from "firebase/auth";

const Settings = () => {
  const user = useUser()
  const setUser = useSetUser()
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      router.replace("/(auth)/auth");
    } catch (error) {
      Alert.alert("Logout Failed", "There was a problem logging out.");
    }
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Loading user data...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <MaterialIcons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>

      {/* Profile Picture Section */}
      <View style={styles.profileSection}>
        <Image
          source={{ uri: user.profilePicture }}
          style={styles.profileImage}
        />
        <TouchableOpacity style={styles.editIcon}>
          <MaterialIcons name="edit" size={24} color="#007BFF" />
        </TouchableOpacity>
      </View>

      {/* User Details Section */}
      <View style={styles.detailsSection}>
        <Text style={styles.userName}>{user.name}</Text>
        <Text style={styles.userEmail}>{user.email}</Text>
        <Text style={styles.userRole}>Role: {user.role}</Text>
      </View>

      {/* Quick Actions Section */}
      <View style={styles.actionsSection}>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.logoutButton]}
          onPress={handleLogout}>
          <Text style={styles.actionButtonText}>Log Out</Text>
        </TouchableOpacity>
      </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    position: "relative",
  },
  backButton: {
    position: "absolute",
    top: 10,
    left: 10,
    padding: 10,
    zIndex: 10,
  },
  profileSection: {
    alignItems: "center",
    marginBottom: 20,
    marginTop: 40, // Ensure content does not overlap back button
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: "#007BFF",
  },
  editIcon: {
    position: "absolute",
    right: 0,
    bottom: 0,
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 5,
    elevation: 3,
  },
  detailsSection: {
    alignItems: "center",
    marginBottom: 30,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  userEmail: {
    fontSize: 16,
    color: "#666",
    marginBottom: 5,
  },
  userRole: {
    fontSize: 14,
    color: "#888",
  },
  actionsSection: {
    width: "100%",
  },
  actionButton: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  logoutButton: {
    backgroundColor: "#dc3545",
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Settings;
