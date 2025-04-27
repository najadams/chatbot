import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
  useColorScheme,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useUser } from "@/context/UserContext";
import { colors } from "@/app/theme/colors";

const { width } = Dimensions.get("window");

interface QuickActionProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  onPress: () => void;
}

interface AchievementCardProps {
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
}

interface ProfessorCardProps {
  name: string;
  department: string;
  image: string;
}

export default function HomeScreen() {
  const user = useUser();
  const router = useRouter();
  const colorScheme = useColorScheme();

  // Sample data
  const achievements = [
    {
      title: "Research Excellence",
      description: "Ranked #1 in Research Output",
      icon: "trophy" as keyof typeof Ionicons.glyphMap,
    },
    {
      title: "Student Success",
      description: "95% Employment Rate",
      icon: "school" as keyof typeof Ionicons.glyphMap,
    },
    {
      title: "Innovation Hub",
      description: "State-of-the-art Facilities",
      icon: "bulb" as keyof typeof Ionicons.glyphMap,
    },
  ];

  const professors = [
    {
      name: "Dr. Sarah Johnson",
      department: "Computer Science",
      image: "https://randomuser.me/api/portraits/women/1.jpg",
    },
    {
      name: "Dr. Michael Chen",
      department: "Engineering",
      image: "https://randomuser.me/api/portraits/men/2.jpg",
    },
    {
      name: "Dr. Emily Rodriguez",
      department: "Business",
      image: "https://randomuser.me/api/portraits/women/3.jpg",
    },
  ];

  const facilities = [
    {
      name: "Library",
      description: "24/7 Access, Digital Resources",
      icon: "library" as keyof typeof Ionicons.glyphMap,
    },
    {
      name: "Sports Complex",
      description: "Olympic-sized Pool, Gym",
      icon: "fitness" as keyof typeof Ionicons.glyphMap,
    },
    {
      name: "Research Labs",
      description: "Advanced Equipment",
      icon: "flask" as keyof typeof Ionicons.glyphMap,
    },
    {
      name: "Stadium",
      description: "Advanced Equipment",
      icon: "football" as keyof typeof Ionicons.glyphMap,
    },
    {
      name: "Pool",
      description: "Advanced Equipment",
      icon: "water" as keyof typeof Ionicons.glyphMap,
    },
  ];

  const QuickAction = ({ icon, title, onPress }: QuickActionProps) => (
    <TouchableOpacity style={styles.quickAction} onPress={onPress}>
      <Ionicons name={icon} size={24} color={colors.primary} />
      <Text style={styles.quickActionText}>{title}</Text>
    </TouchableOpacity>
  );

  const AchievementCard = ({
    title,
    description,
    icon,
  }: AchievementCardProps) => (
    <View style={styles.achievementCard}>
      <Ionicons name={icon} size={32} color={colors.primary} />
      <Text style={styles.achievementTitle}>{title}</Text>
      <Text style={styles.achievementDescription}>{description}</Text>
    </View>
  );

  const ProfessorCard = ({ name, department, image }: ProfessorCardProps) => (
    <View style={styles.professorCard}>
      <Image source={{ uri: image }} style={styles.professorImage} />
      <Text style={styles.professorName}>{name}</Text>
      <Text style={styles.professorDepartment}>{department}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Welcome to KNUST</Text>
          <Text style={styles.subText}>Excellence in Education</Text>
        </View>

        <View style={styles.quickActions}>
          <QuickAction
            icon="school-outline"
            title="Programs"
            onPress={() => router.push("/(main)/programs")}
          />
          <QuickAction
            icon="people-outline"
            title="Faculty"
            onPress={() => router.push("/(main)/faculty")}
          />
          <QuickAction
            icon="calendar-outline"
            title="Events"
            onPress={() => router.push("/(main)/upcoming-events")}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Achievements</Text>
          <View style={styles.achievementsGrid}>
            {achievements.map((achievement, index) => (
              <AchievementCard key={index} {...achievement} />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Featured Lecuterers</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.professorsScroll}>
            {professors.map((professor, index) => (
              <ProfessorCard key={index} {...professor} />
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Facilities</Text>
          <View style={styles.facilitiesGrid}>
            {facilities.map((facility, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.facilityCard,
                  {
                    backgroundColor:
                      colorScheme === "dark" ? colors.surface : "#fff",
                  },
                ]}>
                <Ionicons
                  name={facility.icon}
                  size={24}
                  color={colors.primary}
                />
                <Text style={styles.facilityName}>{facility.name}</Text>
                <Text style={styles.facilityDescription}>
                  {facility.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.aiFab}
        onPress={() => router.push("/chat/new")}>
        <Ionicons
          name="chatbubble-ellipses"
          size={24}
          color={colors.textLight}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
  header: {
    padding: 20,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: "bold",
    color: colors.textPrimary,
  },
  subText: {
    fontSize: 18,
    color: colors.textSecondary,
    marginTop: 4,
  },
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 20,
    backgroundColor: colors.surface,
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  quickAction: {
    alignItems: "center",
    padding: 10,
    borderRadius: 12,
    backgroundColor: colors.surfaceLight,
  },
  quickActionText: {
    marginTop: 8,
    fontSize: 12,
    color: colors.textSecondary,
  },
  section: {
    marginTop: 20,
    padding: 20,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: 15,
  },
  achievementsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  achievementCard: {
    width: (width - 60) / 3,
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 15,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    shadowColor: colors.cardShadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textPrimary,
    marginTop: 8,
    textAlign: "center",
  },
  achievementDescription: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
    textAlign: "center",
  },
  professorsScroll: {
    flexDirection: "row",
  },
  professorCard: {
    width: 160,
    marginRight: 15,
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    shadowColor: colors.cardShadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  professorImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  professorName: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textPrimary,
    textAlign: "center",
  },
  professorDepartment: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
    textAlign: "center",
  },
  facilitiesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  facilityCard: {
    width: (width - 60) / 3,
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 15,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    shadowColor: colors.cardShadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  facilityName: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textPrimary,
    marginTop: 8,
    textAlign: "center",
  },
  facilityDescription: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
    textAlign: "center",
  },
  aiFab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: colors.cardShadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
});
