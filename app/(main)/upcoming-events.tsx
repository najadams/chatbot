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

interface Event {
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  category: string;
  icon: keyof typeof Ionicons.glyphMap;
  image?: string;
}

export default function UpcomingEventsScreen() {
  const events: Event[] = [
    {
      title: "Annual Research Symposium",
      date: "March 15, 2024",
      time: "9:00 AM - 5:00 PM",
      location: "Great Hall",
      description: "Join us for presentations of groundbreaking research across all disciplines",
      category: "Academic",
      icon: "book",
      image: "https://picsum.photos/800/400?random=1"
    },
    {
      title: "Tech Innovation Fair",
      date: "March 20, 2024",
      time: "10:00 AM - 4:00 PM",
      location: "Engineering Complex",
      description: "Showcase of student projects and industry partnerships",
      category: "Technology",
      icon: "hardware-chip",
      image: "https://picsum.photos/800/400?random=2"
    },
    {
      title: "Cultural Festival",
      date: "March 25, 2024",
      time: "11:00 AM - 8:00 PM",
      location: "University Square",
      description: "Celebrate diversity with food, music, and performances",
      category: "Cultural",
      icon: "people",
      image: "https://picsum.photos/800/400?random=3"
    }
  ];

  const renderEventCard = (event: Event) => (
    <TouchableOpacity key={event.title} style={styles.eventCard}>
      {event.image && (
        <Image
          source={{ uri: event.image }}
          style={styles.eventImage}
          resizeMode="cover"
        />
      )}
      <View style={styles.eventContent}>
        <View style={styles.categoryBadge}>
          <Ionicons name={event.icon} size={16} color={colors.primary} />
          <Text style={styles.categoryText}>{event.category}</Text>
        </View>
        
        <Text style={styles.eventTitle}>{event.title}</Text>
        
        <View style={styles.eventDetails}>
          <View style={styles.detailRow}>
            <Ionicons name="calendar" size={16} color={colors.textSecondary} />
            <Text style={styles.detailText}>{event.date}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Ionicons name="time" size={16} color={colors.textSecondary} />
            <Text style={styles.detailText}>{event.time}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Ionicons name="location" size={16} color={colors.textSecondary} />
            <Text style={styles.detailText}>{event.location}</Text>
          </View>
        </View>
        
        <Text style={styles.eventDescription}>{event.description}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Upcoming Events</Text>
        <Text style={styles.headerSubtitle}>Stay updated with university activities</Text>
      </View>

      <View style={styles.content}>
        {events.map(renderEventCard)}
      </View>
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
  content: {
    padding: 16,
  },
  eventCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
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
  eventImage: {
    width: '100%',
    height: 200,
  },
  eventContent: {
    padding: 16,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  categoryText: {
    color: colors.primary,
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '600',
  },
  eventTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  eventDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    marginLeft: 8,
    color: colors.textSecondary,
    fontSize: 14,
  },
  eventDescription: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
  },
});