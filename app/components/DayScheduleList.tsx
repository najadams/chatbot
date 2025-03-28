import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Schedule } from "../types/schedule";

interface DayScheduleListProps {
  date: Date;
  schedules: Schedule[];
}

export const DayScheduleList: React.FC<DayScheduleListProps> = ({
  date,
  schedules,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.dateText}>
          {date.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </Text>
        <Text style={styles.scheduleCount}>
          {schedules.length} {schedules.length === 1 ? "schedule" : "schedules"}
        </Text>
      </View>

      <ScrollView style={styles.scheduleList}>
        {schedules.map((schedule) => (
          <TouchableOpacity key={schedule.id} style={styles.scheduleCard}>
            <View style={styles.scheduleHeader}>
              <View style={styles.timeContainer}>
                <Ionicons name="time-outline" size={16} color="#8E8E93" />
                <Text style={styles.timeText}>{schedule.time}</Text>
              </View>
              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor:
                      schedule.status === "confirmed" ? "#E8F5E9" : "#FFF3E0",
                  },
                ]}>
                <Text
                  style={[
                    styles.statusText,
                    {
                      color:
                        schedule.status === "confirmed" ? "#2E7D32" : "#F57C00",
                    },
                  ]}>
                  {schedule.status === "confirmed" ? "Confirmed" : "Pending"}
                </Text>
              </View>
            </View>

            <Text style={styles.titleText}>{schedule.title}</Text>

            <View style={styles.footer}>
              <View style={styles.typeContainer}>
                <Ionicons
                  name={schedule.type === "tutor" ? "person" : "robot"}
                  size={16}
                  color="#8E8E93"
                />
                <Text style={styles.typeText}>
                  {schedule.type === "tutor"
                    ? schedule.tutor
                    : "AI Learning with Reaven"}
                </Text>
              </View>
              <Text style={styles.durationText}>
                {schedule.duration} minutes
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  header: {
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  dateText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000000",
  },
  scheduleCount: {
    fontSize: 14,
    color: "#8E8E93",
    marginTop: 4,
  },
  scheduleList: {
    flex: 1,
    padding: 16,
  },
  scheduleCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  scheduleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  timeText: {
    fontSize: 14,
    color: "#8E8E93",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
  },
  titleText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 8,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  typeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  typeText: {
    fontSize: 14,
    color: "#8E8E93",
  },
  durationText: {
    fontSize: 14,
    color: "#8E8E93",
  },
});
