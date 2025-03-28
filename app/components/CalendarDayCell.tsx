import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { DaySchedule } from "../types/schedule";

interface CalendarDayCellProps {
  date: Date;
  daySchedule: DaySchedule;
  isCurrentMonth: boolean;
  isToday: boolean;
  onPress: () => void;
}

export const CalendarDayCell: React.FC<CalendarDayCellProps> = ({
  date,
  daySchedule,
  isCurrentMonth,
  isToday,
  onPress,
}) => {
  const getBusynessColor = (busyness: number) => {
    if (busyness === 0) return "transparent";
    if (busyness < 0.3) return "rgba(255, 0, 0, 0.1)";
    if (busyness < 0.6) return "rgba(255, 0, 0, 0.2)";
    if (busyness < 0.9) return "rgba(255, 0, 0, 0.3)";
    return "rgba(255, 0, 0, 0.4)";
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        !isCurrentMonth && styles.otherMonth,
        isToday && styles.today,
        { backgroundColor: getBusynessColor(daySchedule.busyness) },
      ]}
      onPress={onPress}>
      <Text
        style={[
          styles.dayText,
          !isCurrentMonth && styles.otherMonthText,
          isToday && styles.todayText,
        ]}>
        {date.getDate()}
      </Text>
      {daySchedule.schedules.length > 0 && (
        <View style={styles.scheduleIndicator}>
          <View style={styles.scheduleDot} />
          {daySchedule.schedules.length > 1 && (
            <View style={styles.scheduleDot} />
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    margin: 2,
  },
  otherMonth: {
    opacity: 0.3,
  },
  today: {
    backgroundColor: "#007AFF",
  },
  dayText: {
    fontSize: 16,
    color: "#000000",
    fontWeight: "500",
  },
  otherMonthText: {
    color: "#8E8E93",
  },
  todayText: {
    color: "#FFFFFF",
  },
  scheduleIndicator: {
    flexDirection: "row",
    position: "absolute",
    bottom: 2,
    gap: 2,
  },
  scheduleDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#007AFF",
  },
});
