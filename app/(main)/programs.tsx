import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/app/theme/colors';

const { width } = Dimensions.get('window');

interface ProgramCategory {
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  programs: Program[];
}

interface Program {
  name: string;
  duration: string;
  description: string;
}

export default function ProgramsScreen() {
  const programCategories: ProgramCategory[] = [
    {
      name: 'Engineering',
      icon: 'construct',
      programs: [
        {
          name: 'Computer Engineering',
          duration: '4 years',
          description: 'Design and development of computer systems and networks',
        },
        {
          name: 'Electrical Engineering',
          duration: '4 years',
          description: 'Study of electrical systems and power distribution',
        },
        {
          name: 'Mechanical Engineering',
          duration: '4 years',
          description: 'Design and manufacturing of mechanical systems',
        },
      ],
    },
    {
      name: 'Sciences',
      icon: 'flask',
      programs: [
        {
          name: 'Computer Science',
          duration: '4 years',
          description: 'Study of computation and information processing',
        },
        {
          name: 'Physics',
          duration: '4 years',
          description: 'Study of matter, energy, and their interactions',
        },
        {
          name: 'Mathematics',
          duration: '4 years',
          description: 'Advanced study of mathematical theories and applications',
        },
      ],
    },
    {
      name: 'Business',
      icon: 'business',
      programs: [
        {
          name: 'Business Administration',
          duration: '4 years',
          description: 'Management and administration of business operations',
        },
        {
          name: 'Economics',
          duration: '4 years',
          description: 'Study of production, distribution, and consumption',
        },
        {
          name: 'Accounting',
          duration: '4 years',
          description: 'Financial record-keeping and business reporting',
        },
      ],
    },
  ];

  const renderProgram = (program: Program) => (
    <TouchableOpacity
      key={program.name}
      style={styles.programCard}
    >
      <Text style={styles.programName}>{program.name}</Text>
      <Text style={styles.programDuration}>{program.duration}</Text>
      <Text style={styles.programDescription}>{program.description}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Academic Programs</Text>
        <Text style={styles.headerSubtitle}>
          Explore our diverse range of programs
        </Text>
      </View>

      {programCategories.map((category) => (
        <View key={category.name} style={styles.categorySection}>
          <View style={styles.categoryHeader}>
            <Ionicons name={category.icon} size={24} color={colors.primary} />
            <Text style={styles.categoryTitle}>{category.name}</Text>
          </View>
          <View style={styles.programsGrid}>
            {category.programs.map(renderProgram)}
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 20,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 4,
  },
  categorySection: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  categoryTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.textPrimary,
    marginLeft: 10,
  },
  programsGrid: {
    flexDirection: 'column',
  },
  programCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
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
  programName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  programDuration: {
    fontSize: 14,
    color: colors.primary,
    marginTop: 4,
  },
  programDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
    lineHeight: 20,
  },
});