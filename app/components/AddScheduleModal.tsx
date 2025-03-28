import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Schedule, ScheduleType, DURATION_PRESETS } from "../types/schedule";

interface AddScheduleModalProps {
  visible: boolean;
  onClose: () => void;
  onAddSchedule: (schedule: Omit<Schedule, "id">) => void;
  tutors: Array<{ id: string; name: string }>;
}

export const AddScheduleModal: React.FC<AddScheduleModalProps> = ({
  visible,
  onClose,
  onAddSchedule,
  tutors,
}) => {
  const [title, setTitle] = useState("");
  const [type, setType] = useState<ScheduleType>("tutor");
  const [selectedTutor, setSelectedTutor] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [duration, setDuration] = useState(DURATION_PRESETS[0].value);
  const [customDuration, setCustomDuration] = useState("");
  const [time, setTime] = useState("09:00");

  const handleAddSchedule = () => {
    const endDate = new Date(startDate);
    endDate.setMinutes(endDate.getMinutes() + duration);

    onAddSchedule({
      title,
      time,
      tutor: type === "tutor" ? selectedTutor : undefined,
      status: "pending",
      type,
      startDate,
      endDate,
      duration,
    });

    // Reset form
    setTitle("");
    setType("tutor");
    setSelectedTutor("");
    setStartDate(new Date());
    setDuration(DURATION_PRESETS[0].value);
    setCustomDuration("");
    setTime("09:00");
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add New Schedule</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Title</Text>
              <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="Enter session title"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Type</Text>
              <View style={styles.typeSelector}>
                <TouchableOpacity
                  style={[
                    styles.typeButton,
                    type === "tutor" && styles.selectedType,
                  ]}
                  onPress={() => setType("tutor")}>
                  <Text
                    style={[
                      styles.typeButtonText,
                      type === "tutor" && styles.selectedTypeText,
                    ]}>
                    Tutor
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.typeButton,
                    type === "ai" && styles.selectedType,
                  ]}
                  onPress={() => setType("ai")}>
                  <Text
                    style={[
                      styles.typeButtonText,
                      type === "ai" && styles.selectedTypeText,
                    ]}>
                    AI Learning
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {type === "tutor" && (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Select Tutor</Text>
                <ScrollView style={styles.tutorList}>
                  {tutors.map((tutor) => (
                    <TouchableOpacity
                      key={tutor.id}
                      style={[
                        styles.tutorItem,
                        selectedTutor === tutor.id && styles.selectedTutor,
                      ]}
                      onPress={() => setSelectedTutor(tutor.id)}>
                      <Text
                        style={[
                          styles.tutorName,
                          selectedTutor === tutor.id &&
                            styles.selectedTutorText,
                        ]}>
                        {tutor.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Start Time</Text>
              <TextInput
                style={styles.input}
                value={time}
                onChangeText={setTime}
                placeholder="HH:MM"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Duration</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.durationPresets}>
                {DURATION_PRESETS.map((preset) => (
                  <TouchableOpacity
                    key={preset.label}
                    style={[
                      styles.durationPreset,
                      duration === preset.value && styles.selectedPreset,
                    ]}
                    onPress={() => setDuration(preset.value)}>
                    <Text
                      style={[
                        styles.presetText,
                        duration === preset.value && styles.selectedPresetText,
                      ]}>
                      {preset.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              {duration === 0 && (
                <TextInput
                  style={styles.input}
                  value={customDuration}
                  onChangeText={setCustomDuration}
                  placeholder="Enter duration in minutes"
                  keyboardType="numeric"
                />
              )}
            </View>

            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddSchedule}
              disabled={!title || (type === "tutor" && !selectedTutor)}>
              <Text style={styles.addButtonText}>Add Schedule</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "90%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000000",
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 20,
    color: "#8E8E93",
  },
  form: {
    maxHeight: 600,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000000",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E5E5EA",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  typeSelector: {
    flexDirection: "row",
    gap: 10,
  },
  typeButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E5EA",
    alignItems: "center",
  },
  selectedType: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  typeButtonText: {
    fontSize: 16,
    color: "#000000",
  },
  selectedTypeText: {
    color: "#FFFFFF",
  },
  tutorList: {
    maxHeight: 200,
  },
  tutorItem: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#E5E5EA",
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedTutor: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  tutorName: {
    fontSize: 16,
    color: "#000000",
  },
  selectedTutorText: {
    color: "#FFFFFF",
  },
  durationPresets: {
    flexDirection: "row",
    marginBottom: 10,
  },
  durationPreset: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F2F2F7",
    marginRight: 8,
  },
  selectedPreset: {
    backgroundColor: "#007AFF",
  },
  presetText: {
    fontSize: 14,
    color: "#000000",
  },
  selectedPresetText: {
    color: "#FFFFFF",
  },
  addButton: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
