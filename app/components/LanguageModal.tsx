import React from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Language, SUPPORTED_LANGUAGES } from "../types/menu";

interface LanguageModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectLanguage: (language: Language) => void;
  currentLanguage: string;
}

export const LanguageModal: React.FC<LanguageModalProps> = ({
  visible,
  onClose,
  onSelectLanguage,
  currentLanguage,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Language</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.languageList}>
            {SUPPORTED_LANGUAGES.map((language) => (
              <TouchableOpacity
                key={language.code}
                style={[
                  styles.languageItem,
                  currentLanguage === language.code && styles.selectedLanguage,
                ]}
                onPress={() => {
                  onSelectLanguage(language);
                  onClose();
                }}>
                <Text style={styles.languageFlag}>{language.flag}</Text>
                <Text style={styles.languageName}>{language.name}</Text>
                {currentLanguage === language.code && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
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
    maxHeight: "80%",
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
  languageList: {
    maxHeight: 400,
  },
  languageItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  selectedLanguage: {
    backgroundColor: "#F2F2F7",
  },
  languageFlag: {
    fontSize: 24,
    marginRight: 15,
  },
  languageName: {
    flex: 1,
    fontSize: 16,
    color: "#000000",
  },
  checkmark: {
    fontSize: 20,
    color: "#007AFF",
  },
});
