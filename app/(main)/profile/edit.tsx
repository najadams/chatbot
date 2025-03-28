import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useUser, useSetUser } from "@/context/UserContext";
import { useRouter } from "expo-router";
import { auth, db } from "@/firebaseConfig";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import * as ImagePicker from "expo-image-picker";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { colors } from "@/app/theme/colors";

export default function EditProfileScreen() {
  const user = useUser();
  const setUser = useSetUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    profilePicture: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        profilePicture: user.profilePicture || "",
      });
    }
  }, [user]);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setFormData({ ...formData, profilePicture: result.assets[0].uri });
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image");
    }
  };

  const uploadImage = async (uri: string) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const storage = getStorage();
      const storageRef = ref(storage, `profile_pictures/${user?.email}`);
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setLoading(true);
    try {
      let profilePictureUrl = formData.profilePicture;

      // Upload new profile picture if changed
      if (profilePictureUrl && profilePictureUrl !== user.profilePicture) {
        profilePictureUrl = await uploadImage(profilePictureUrl);
      }

      // Update user profile in Firestore
      const userRef = doc(db, "users", user.email);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        await updateDoc(userRef, {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          profilePicture: profilePictureUrl,
          updatedAt: new Date(),
        });

        // Update local user state
        setUser({
          ...user,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          profilePicture: profilePictureUrl,
        });

        Alert.alert("Success", "Profile updated successfully");
        router.back();
      } else {
        Alert.alert("Error", "User document not found");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "Failed to update profile");
    } finally {
      setLoading(false);
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
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}>
          <MaterialIcons
            name="arrow-back"
            size={24}
            color={colors.textPrimary}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color={colors.primary} />
          ) : (
            <Text style={styles.saveButtonText}>Save</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.profileSection}>
        <TouchableOpacity onPress={pickImage}>
          <Image
            source={
              formData.profilePicture
                ? { uri: formData.profilePicture }
                : require("../../../assets/images/avatar.jpg")
            }
            style={styles.profileImage}
          />
          <View style={styles.editIconContainer}>
            <MaterialIcons name="edit" size={24} color={colors.primary} />
          </View>
        </TouchableOpacity>
        <Text style={styles.changePhotoText}>Change Photo</Text>
      </View>

      <View style={styles.formSection}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
            placeholder="Your name"
            placeholderTextColor={colors.textSecondary}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
            placeholder="Your email"
            placeholderTextColor={colors.textSecondary}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phone</Text>
          <TextInput
            style={styles.input}
            value={formData.phone}
            onChangeText={(text) => setFormData({ ...formData, phone: text })}
            placeholder="Your phone number"
            placeholderTextColor={colors.textSecondary}
            keyboardType="phone-pad"
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  saveButton: {
    padding: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.primary,
  },
  profileSection: {
    alignItems: "center",
    padding: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  editIconContainer: {
    position: "absolute",
    right: 0,
    bottom: 0,
    backgroundColor: colors.background,
    borderRadius: 15,
    padding: 5,
    elevation: 3,
    shadowColor: colors.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  changePhotoText: {
    marginTop: 10,
    fontSize: 16,
    color: colors.primary,
    fontWeight: "500",
  },
  formSection: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.textSecondary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.backgroundLight,
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    color: colors.textPrimary,
  },
});
