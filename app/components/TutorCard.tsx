import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Tutor } from "../types/tutor";

interface TutorCardProps {
  tutor: Tutor;
  onPress: (tutor: Tutor) => void;
}

export const TutorCard: React.FC<TutorCardProps> = ({ tutor, onPress }) => {
  return (
    <TouchableOpacity style={styles.tutorCard} onPress={() => onPress(tutor)}>
      <Image source={{ uri: tutor.image }} style={styles.tutorImage} />
      <View style={styles.tutorInfo}>
        <Text style={styles.tutorName}>{tutor.name}</Text>
        <View style={styles.subjectsContainer}>
          {tutor.subjects.map((subject: string, index: number) => (
            <View key={index} style={styles.subjectTag}>
              <Text style={styles.subjectText}>{subject}</Text>
            </View>
          ))}
        </View>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={16} color="#FFD700" />
          <Text style={styles.ratingText}>{tutor.rating}</Text>
        </View>
        <Text style={styles.experienceText}>
          {tutor.experience} years experience
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  tutorCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  tutorImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  tutorInfo: {
    flex: 1,
  },
  tutorName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 8,
  },
  subjectsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 8,
  },
  subjectTag: {
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  subjectText: {
    fontSize: 12,
    color: "#2E7D32",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  ratingText: {
    fontSize: 14,
    color: "#000000",
    marginLeft: 4,
  },
  experienceText: {
    fontSize: 14,
    color: "#8E8E93",
  },
});
