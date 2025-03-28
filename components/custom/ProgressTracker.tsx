import React from "react";
import { View, Text } from "react-native";
import { ProgressBar } from "react-native-paper";

const ProgressTracker = () => {
  const progress = 0.6; // Example progress (60%)

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 8 }}>
        Progress
      </Text>
      <ProgressBar
        progress={progress}
        color="#007BFF"
        style={{ height: 10, borderRadius: 5 }}
      />
      <Text style={{ marginTop: 8, fontSize: 16 }}>
        {Math.round(progress * 100)}% Complete
      </Text>
    </View>
  );
};

export default ProgressTracker;
