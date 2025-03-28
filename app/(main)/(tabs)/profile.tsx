import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
// import {auth, signOut} from '../../../firebaseConfig'
import { getAuth, signOut } from "firebase/auth";
import { MenuItemProps, Language } from "../../types/menu";
import { LanguageModal } from "../../components/LanguageModal";
import { useUser } from "@/context/UserContext";
import { colors } from "@/app/theme/colors";

export default function ProfileScreen() {
  const router = useRouter();
  const user = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [isLanguageModalVisible, setIsLanguageModalVisible] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState("en");

  const logout = async () => {
    const auth = getAuth();
    try {
      console.log("signing out");
      await signOut(auth);
      console.log("User logged out successfully");
      router.push("/(auth)/auth");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleLanguageSelect = (language: Language) => {
    setCurrentLanguage(language.code);
    // Here you would typically also update the app's language settings
    // using a language management system like i18n
  };

  const MenuItem: React.FC<MenuItemProps> = ({ icon, title, onPress }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuItemLeft}>
        <Ionicons name={icon} size={24} color="#007AFF" />
        <Text style={styles.menuItemText}>{title}</Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color="#8E8E93" />
    </TouchableOpacity>
  );

  if (!user) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{
            uri: user.profilePicture || "assets/images/avatar.jpg",
          }}
          style={styles.profileImage}
        />
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Settings</Text>
        <MenuItem
          icon="person-outline"
          title="Edit Profile"
          onPress={() => router.push("/(main)/profile/edit")}
        />
        <MenuItem
          icon="notifications-outline"
          title="Notifications"
          onPress={() => {}}
        />
        <MenuItem
          icon="lock-closed-outline"
          title="Privacy & Security"
          onPress={() => {}}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <MenuItem
          icon="calendar-outline"
          title="Schedule Preferences"
          onPress={() => {}}
        />
        <MenuItem
          icon="book-outline"
          title="Subject Preferences"
          onPress={() => {}}
        />
        <MenuItem
          icon="language-outline"
          title="Language"
          onPress={() => setIsLanguageModalVisible(true)}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        <MenuItem
          icon="help-circle-outline"
          title="Help Center"
          onPress={() => {}}
        />
        <MenuItem
          icon="mail-outline"
          title="Contact Support"
          onPress={() => {}}
        />
        <MenuItem
          icon="document-text-outline"
          title="Terms of Service"
          onPress={() => {}}
        />
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>

      <LanguageModal
        visible={isLanguageModalVisible}
        onClose={() => setIsLanguageModalVisible(false)}
        onSelectLanguage={handleLanguageSelect}
        currentLanguage={currentLanguage}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    alignItems: "center",
    padding: 20,
    backgroundColor: colors.backgroundLight,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  section: {
    backgroundColor: colors.backgroundLight,
    marginTop: 20,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: 15,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuItemText: {
    fontSize: 16,
    color: colors.textPrimary,
    marginLeft: 12,
  },
  logoutButton: {
    margin: 20,
    padding: 15,
    backgroundColor: colors.error,
    borderRadius: 10,
    alignItems: "center",
  },
  logoutText: {
    color: colors.textLight,
    fontSize: 16,
    fontWeight: "600",
  },
});
