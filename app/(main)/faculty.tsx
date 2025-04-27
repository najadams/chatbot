import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/app/theme/colors';

const { width } = Dimensions.get('window');

interface Faculty {
  name: string;
  description: string;
  departments: Department[];
  icon: keyof typeof Ionicons.glyphMap;
}

interface Department {
  name: string;
  programs: string[];
  hod: {
    name: string;
    image: string;
    title: string;
  };
}

export default function FacultyScreen() {
  const faculties: Faculty[] = [
    {
      name: 'Faculty of Engineering',
      description: 'Leading innovation in engineering education and research',
      icon: 'construct',
      departments: [
        {
          name: 'Computer Engineering',
          programs: ['BSc Computer Engineering', 'MSc Computer Engineering', 'PhD Computer Engineering'],
          hod: {
            name: 'Prof. James Wilson',
            image: 'https://randomuser.me/api/portraits/men/4.jpg',
            title: 'Head of Department'
          }
        },
        {
          name: 'Electrical Engineering',
          programs: ['BSc Electrical Engineering', 'MSc Electrical Engineering', 'PhD Electrical Engineering'],
          hod: {
            name: 'Dr. Lisa Chen',
            image: 'https://randomuser.me/api/portraits/women/5.jpg',
            title: 'Head of Department'
          }
        }
      ]
    },
    {
      name: 'Faculty of Sciences',
      description: 'Advancing scientific knowledge and discovery',
      icon: 'flask',
      departments: [
        {
          name: 'Computer Science',
          programs: ['BSc Computer Science', 'MSc Computer Science', 'PhD Computer Science'],
          hod: {
            name: 'Prof. Sarah Johnson',
            image: 'https://randomuser.me/api/portraits/women/6.jpg',
            title: 'Head of Department'
          }
        },
        {
          name: 'Mathematics',
          programs: ['BSc Mathematics', 'MSc Mathematics', 'PhD Mathematics'],
          hod: {
            name: 'Dr. Michael Brown',
            image: 'https://randomuser.me/api/portraits/men/7.jpg',
            title: 'Head of Department'
          }
        }
      ]
    }
  ];

  const renderDepartment = (department: Department) => (
    <View key={department.name} style={styles.departmentCard}>
      <View style={styles.hodSection}>
        <Image source={{ uri: department.hod.image }} style={styles.hodImage} />
        <View style={styles.hodInfo}>
          <Text style={styles.hodName}>{department.hod.name}</Text>
          <Text style={styles.hodTitle}>{department.hod.title}</Text>
        </View>
      </View>
      <Text style={styles.departmentName}>{department.name}</Text>
      <View style={styles.programsList}>
        {department.programs.map((program, index) => (
          <Text key={index} style={styles.programText}>• {program}</Text>
        ))}
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Academic Faculties</Text>
        <Text style={styles.headerSubtitle}>Explore our diverse academic departments</Text>
      </View>

      {faculties.map((faculty) => (
        <View key={faculty.name} style={styles.facultySection}>
          <View style={styles.facultyHeader}>
            <Ionicons name={faculty.icon} size={32} color={colors.primary} />
            <View style={styles.facultyTitleContainer}>
              <Text style={styles.facultyName}>{faculty.name}</Text>
              <Text style={styles.facultyDescription}>{faculty.description}</Text>
            </View>
          </View>
          
          <View style={styles.departmentsGrid}>
            {faculty.departments.map(renderDepartment)}
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
  facultySection: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  facultyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: colors.surface,
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  facultyTitleContainer: {
    marginLeft: 15,
    flex: 1,
  },
  facultyName: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  facultyDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  departmentsGrid: {
    flexDirection: 'column',
  },
  departmentCard: {
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
  hodSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  hodImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  hodInfo: {
    flex: 1,
  },
  hodName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  hodTitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  departmentName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  programsList: {
    marginTop: 8,
  },
  programText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
    paddingLeft: 8,
  },
});