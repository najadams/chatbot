import React from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";

const tasks = [
  { id: "1", title: "Watch Python Basics Video", time: "30 mins" },
  { id: "2", title: "Read Python for Beginners Article", time: "20 mins" },
  { id: "3", title: "Practice Python Exercises", time: "45 mins" },
];

const UpcomingTasks = () => {
  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 8 }}>
        Upcoming Tasks
      </Text>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              padding: 8,
              backgroundColor: "#f9f9f9",
              marginBottom: 8,
              borderRadius: 8,
            }}>
            <View>
              <Text style={{ fontSize: 16 }}>{item.title}</Text>
              <Text style={{ fontSize: 14, color: "#666" }}>{item.time}</Text>
            </View>
            <TouchableOpacity
              style={{
                padding: 8,
                backgroundColor: "#007BFF",
                borderRadius: 4,
              }}>
              <Text style={{ color: "#fff" }}>Complete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

export default UpcomingTasks;
