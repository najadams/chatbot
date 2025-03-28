import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ChatOptionsModalProps {
  visible: boolean;
  onClose: () => void;
  onOptionPress: (option: string) => void;
  chatName: string;
}

export default function ChatOptionsModal({
  visible,
  onClose,
  onOptionPress,
  chatName,
}: ChatOptionsModalProps) {
  const options = [
    {
      id: "prioritize",
      icon: "star",
      label: "Prioritize Chat",
      color: "#2C3E50",
    },
    {
      id: "raven",
      icon: "accessibility",
      label: "Give Raven Access",
      color: "#2C3E50",
    },
    {
      id: "mute",
      icon: "notifications-off",
      label: "Mute Notifications",
      color: "#2C3E50",
    },
    {
      id: "lock",
      icon: "lock-closed",
      label: "Lock Chat",
      color: "#2C3E50",
    },
    {
      id: "block",
      icon: "ban",
      label: "Block Chat",
      color: "#E74C3C",
    },
    {
      id: "delete",
      icon: "trash",
      label: "Delete Chat",
      color: "#E74C3C",
    },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Chat Options</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#2C3E50" />
            </TouchableOpacity>
          </View>
          <Text style={styles.chatName}>{chatName}</Text>
          <ScrollView style={styles.optionsContainer}>
            {options.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={styles.option}
                onPress={() => {
                  onOptionPress(option.id);
                  onClose();
                }}>
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: option.color + "10" },
                  ]}>
                  <Ionicons
                    name={option.icon as any}
                    size={24}
                    color={option.color}
                  />
                </View>
                <Text style={styles.optionText}>{option.label}</Text>
                <Ionicons name="chevron-forward" size={20} color="#95A5A6" />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

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
    paddingTop: 16,
    paddingBottom: Platform.OS === "ios" ? 34 : 16,
    maxHeight: "80%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#2C3E50",
  },
  closeButton: {
    padding: 8,
  },
  chatName: {
    fontSize: 16,
    color: "#95A5A6",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  optionsContainer: {
    paddingHorizontal: 16,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E8E8E8",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: "#2C3E50",
  },
});
