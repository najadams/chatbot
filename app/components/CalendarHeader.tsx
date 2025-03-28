import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface CalendarHeaderProps {
  date: Date;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onAddSchedule: () => void;
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  date,
  onPreviousMonth,
  onNextMonth,
  onAddSchedule,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.headerTop}>
        <View style={styles.monthContainer}>
          <TouchableOpacity onPress={onPreviousMonth} style={styles.navButton}>
            <Ionicons name="chevron-back" size={24} color="#007AFF" />
          </TouchableOpacity>
          <Text style={styles.monthText}>
            {date.toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </Text>
          <TouchableOpacity onPress={onNextMonth} style={styles.navButton}>
            <Ionicons name="chevron-forward" size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={onAddSchedule}>
          <Ionicons name="add-circle" size={24} color="#FFFFFF" />
          <Text style={styles.addButtonText}>New </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.weekDaysContainer}>
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <Text key={day} style={styles.weekDayText}>
            {day}
          </Text>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  monthContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  navButton: {
    padding: 8,
  },
  monthText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000000",
    marginHorizontal: 16,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007AFF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  weekDaysContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 4,
  },
  weekDayText: {
    width: 40,
    textAlign: "center",
    fontSize: 12,
    color: "#8E8E93",
    fontWeight: "500",
  },
});
