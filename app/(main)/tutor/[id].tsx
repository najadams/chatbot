import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Tutor } from "../../types/tutor";

// This would typically come from an API or database
const mockTutorDetails: Tutor = {
  id: "1",
  name: "Sarah Johnson",
  subjects: ["Chemistry", "Biology"],
  rating: 4.9,
  experience: 3,
  image: "https://randomuser.me/api/portraits/women/1.jpg",
  description:
    "Experienced tutor with a passion for helping students excel in science subjects. Specialized in Chemistry and Biology with a proven track record of improving student grades.",
  hourlyRate: 45,
  availability: ["Monday", "Wednesday", "Friday"],
};

export default function TutorDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const tutor = mockTutorDetails; // In a real app, fetch based on ID

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tutor Profile</Text>
      </View>

      <View style={styles.profileSection}>
        <Image source={{ uri: tutor.image }} style={styles.profileImage} />
        <Text style={styles.name}>{tutor.name}</Text>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={20} color="#FFD700" />
          <Text style={styles.rating}>{tutor.rating}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.description}>{tutor.description}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Subjects</Text>
        <View style={styles.subjectsContainer}>
          {tutor.subjects.map((subject, index) => (
            <View key={index} style={styles.subjectTag}>
              <Text style={styles.subjectText}>{subject}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Experience</Text>
        <Text style={styles.experienceText}>{tutor.experience} years</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Availability</Text>
        <View style={styles.availabilityContainer}>
          {tutor.availability?.map((day, index) => (
            <View key={index} style={styles.availabilityTag}>
              <Text style={styles.availabilityText}>{day}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Rate</Text>
        <Text style={styles.rateText}>${tutor.hourlyRate}/hour</Text>
      </View>

      <TouchableOpacity style={styles.bookButton}>
        <Text style={styles.bookButtonText}>Book a Session</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#FFFFFF",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginLeft: 16,
  },
  profileSection: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "#FFFFFF",
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rating: {
    fontSize: 16,
    marginLeft: 4,
  },
  section: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: "#666",
  },
  subjectsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  subjectTag: {
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  subjectText: {
    color: "#2E7D32",
    fontSize: 14,
  },
  experienceText: {
    fontSize: 16,
    color: "#666",
  },
  availabilityContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  availabilityTag: {
    backgroundColor: "#E3F2FD",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  availabilityText: {
    color: "#1976D2",
    fontSize: 14,
  },
  rateText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
  },
  bookButton: {
    backgroundColor: "#007AFF",
    margin: 20,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  bookButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
});
