import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Schedule, ScheduleType, DURATION_PRESETS } from "../types/schedule";

interface Tutor {
  id: string;
  name: string;
}

export default function AddScheduleScreen() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [type, setType] = useState<ScheduleType>("tutor");
  const [selectedTutor, setSelectedTutor] = useState<string>("");
  const [startDate, setStartDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [duration, setDuration] = useState(DURATION_PRESETS[0].value);

  // Mock tutors data - in a real app, this would come from an API
  const tutors: Tutor[] = [
    { id: "1", name: "John Smith" },
    { id: "2", name: "Sarah Johnson" },
    { id: "3", name: "Michael Brown" },
  ];

  const handleSave = () => {
    const newSchedule: Omit<Schedule, "id"> = {
      title,
      type,
      tutor: type === "tutor" ? selectedTutor : undefined,
      startDate: startDate.toISOString(),
      time: startDate.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      }),
      duration,
      status: "pending",
    };

    // Here you would typically save the schedule to your state management or API
    // For now, we'll just go back to the previous screen
    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add New Schedule</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Schedule Details</Text>
          <TextInput
            style={styles.input}
            placeholder="Schedule Title"
            value={title}
            onChangeText={setTitle}
          />

          <View style={styles.typeSelector}>
            <TouchableOpacity
              style={[
                styles.typeButton,
                type === "tutor" && styles.typeButtonActive,
              ]}
              onPress={() => setType("tutor")}>
              <Ionicons
                name="person"
                size={20}
                color={type === "tutor" ? "#FFFFFF" : "#8E8E93"}
              />
              <Text
                style={[
                  styles.typeButtonText,
                  type === "tutor" && styles.typeButtonTextActive,
                ]}>
                Tutor
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.typeButton,
                type === "ai" && styles.typeButtonActive,
              ]}
              onPress={() => setType("ai")}>
              <Ionicons
                name="robot"
                size={20}
                color={type === "ai" ? "#FFFFFF" : "#8E8E93"}
              />
              <Text
                style={[
                  styles.typeButtonText,
                  type === "ai" && styles.typeButtonTextActive,
                ]}>
                AI Learning
              </Text>
            </TouchableOpacity>
          </View>

          {type === "tutor" && (
            <View style={styles.tutorSelector}>
              <Text style={styles.label}>Select Tutor</Text>
              {tutors.map((tutor) => (
                <TouchableOpacity
                  key={tutor.id}
                  style={[
                    styles.tutorButton,
                    selectedTutor === tutor.id && styles.tutorButtonActive,
                  ]}
                  onPress={() => setSelectedTutor(tutor.id)}>
                  <Ionicons
                    name="person-circle"
                    size={24}
                    color={selectedTutor === tutor.id ? "#FFFFFF" : "#8E8E93"}
                  />
                  <Text
                    style={[
                      styles.tutorButtonText,
                      selectedTutor === tutor.id &&
                        styles.tutorButtonTextActive,
                    ]}>
                    {tutor.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}>
            <Ionicons name="calendar" size={20} color="#8E8E93" />
            <Text style={styles.dateButtonText}>
              {startDate.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })}
            </Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={startDate}
              mode="datetime"
              display="spinner"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) {
                  setStartDate(selectedDate);
                }
              }}
            />
          )}

          <View style={styles.durationSelector}>
            <Text style={styles.label}>Duration</Text>
            <View style={styles.durationButtons}>
              {DURATION_PRESETS.map((preset) => (
                <TouchableOpacity
                  key={preset.value}
                  style={[
                    styles.durationButton,
                    duration === preset.value && styles.durationButtonActive,
                  ]}
                  onPress={() => setDuration(preset.value)}>
                  <Text
                    style={[
                      styles.durationButtonText,
                      duration === preset.value &&
                        styles.durationButtonTextActive,
                    ]}>
                    {preset.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save Schedule</Text>
      </TouchableOpacity>
    </View>
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
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000000",
    marginLeft: 8,
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 16,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
  },
  typeSelector: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  typeButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  typeButtonActive: {
    backgroundColor: "#007AFF",
  },
  typeButtonText: {
    fontSize: 16,
    color: "#8E8E93",
  },
  typeButtonTextActive: {
    color: "#FFFFFF",
  },
  tutorSelector: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    color: "#000000",
    marginBottom: 8,
  },
  tutorButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    gap: 12,
  },
  tutorButtonActive: {
    backgroundColor: "#007AFF",
  },
  tutorButtonText: {
    fontSize: 16,
    color: "#000000",
  },
  tutorButtonTextActive: {
    color: "#FFFFFF",
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    gap: 12,
  },
  dateButtonText: {
    fontSize: 16,
    color: "#000000",
  },
  durationSelector: {
    marginBottom: 16,
  },
  durationButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  durationButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  durationButtonActive: {
    backgroundColor: "#007AFF",
  },
  durationButtonText: {
    fontSize: 14,
    color: "#000000",
  },
  durationButtonTextActive: {
    color: "#FFFFFF",
  },
  saveButton: {
    backgroundColor: "#007AFF",
    margin: 16,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
