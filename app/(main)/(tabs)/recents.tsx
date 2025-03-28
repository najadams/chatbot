import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { colors } from "@/app/theme/colors";

interface ChatTopic {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
}

export default function RecentsScreen() {
  const router = useRouter();

  // Sample data for recent chats
  const recentChats: ChatTopic[] = [
    {
      id: "1",
      title: "Course Registration Help",
      lastMessage: "I can help you with the registration process...",
      timestamp: "2:30 PM",
      unreadCount: 0,
    },
    {
      id: "2",
      title: "Library Resources",
      lastMessage: "Here are the available online resources...",
      timestamp: "Yesterday",
      unreadCount: 2,
    },
    {
      id: "3",
      title: "Campus Navigation",
      lastMessage: "The main building is located at...",
      timestamp: "2 days ago",
      unreadCount: 0,
    },
  ];

  const renderChatItem = ({ item }: { item: ChatTopic }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => router.push(`/chat/${item.id}`)}>
      <View style={styles.avatarContainer}>
        <Ionicons name="chatbubble-ellipses" size={24} color={colors.primary} />
      </View>
      <View style={styles.chatInfo}>
        <View style={styles.chatHeader}>
          <Text style={styles.chatTitle}>{item.title}</Text>
          <Text style={styles.timestamp}>{item.timestamp}</Text>
        </View>
        <Text style={styles.lastMessage} numberOfLines={1}>
          {item.lastMessage}
        </Text>
        {item.unreadCount > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadCount}>{item.unreadCount}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Recent Chats</Text>
        <TouchableOpacity
          style={styles.newChatButton}
          onPress={() => router.push("/chat/new")}>
          <Ionicons name="add" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={recentChats}
        renderItem={renderChatItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  newChatButton: {
    padding: 8,
  },
  listContent: {
    padding: 16,
  },
  chatItem: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: colors.surface,
    borderRadius: 12,
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
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surfaceLight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  chatInfo: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  chatTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  timestamp: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  lastMessage: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  unreadBadge: {
    position: "absolute",
    right: 0,
    top: 0,
    backgroundColor: colors.primary,
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
  },
  unreadCount: {
    color: colors.textLight,
    fontSize: 12,
    fontWeight: "600",
  },
}); 