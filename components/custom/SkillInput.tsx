import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

interface SkillInputProps {
  onSubmit: (skill: string, pace: string) => void;
}

const SkillInput: React.FC<SkillInputProps> = ({ onSubmit }) => {
  const [skill, setSkill] = useState("");
  const [pace, setPace] = useState("medium");

  const handleSubmit = () => {
    if (!skill.trim()) return;
    onSubmit(skill, pace);
    setSkill(""); // Reset input after submission
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>What skill do you want to learn?</Text>

      <TextInput
        placeholder="Enter a skill (e.g., Web Development)"
        value={skill}
        onChangeText={setSkill}
        style={styles.input}
      />

      <Text style={styles.label}>Select Learning Pace:</Text>
      <Picker
        selectedValue={pace}
        onValueChange={(itemValue) => setPace(itemValue)}
        style={styles.picker}>
        <Picker.Item label="Slow (Few hours per week)" value="slow" />
        <Picker.Item label="Medium (Regular pace)" value="medium" />
        <Picker.Item label="Fast (Intensive learning)" value="fast" />
      </Picker>

      <Button title="Generate Learning Plan" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  picker: {
    height: 50,
    marginBottom: 10,
  },
});

export default SkillInput;
