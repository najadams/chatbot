import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { colors } from "@/app/theme/colors";
import { useUser } from "@/context/UserContext";

interface ChatTopic {
  conversation_id: string;
  started_at: string;
  updated_at: string;
  participants: {
    user: {
      user_id: string;
      username: string;
      display_name: string;
    };
    ai: {
      ai_id: string;
      name: string;
      version: string;
    };
  };
  metadata: {
    platform: string;
    language: string;
    session_id: string;
    context: {
      topic: string;
      user_timezone: string;
    };
  };
  status: string;
  summary: {
    total_messages: number;
    last_message_id: string;
    last_message_timestamp: string;
  };
  last_message: string;
  last_message_timestamp: string;
}

interface PaginationInfo {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

const DEFAULT_PAGE_SIZE = 20;

export default function RecentsScreen() {
  const router = useRouter();
  const [recentChats, setRecentChats] = useState<ChatTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    per_page: DEFAULT_PAGE_SIZE,
    total: 0,
    total_pages: 0,
  });

  const user = useUser();

  const fetchRecentChats = useCallback(
    async (page: number = 1) => {
      try {
        setError(null);
        if (!user?.id) {
          setRecentChats([]);
          setLoading(false);
          return;
        }

        const response = await fetch(
          `http://localhost:8000/recent-chats?page=${page}&per_page=${DEFAULT_PAGE_SIZE}&user_id=${user.id}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (!data.conversations) {
          throw new Error("No conversations data in response");
        }

        // Handle case where pagination data might be missing
        const paginationData = data.pagination || {
          page: page,
          per_page: DEFAULT_PAGE_SIZE,
          total: data.conversations?.length || 0,
          total_pages: 1,
        };

        setRecentChats((prev) =>
          page === 1 ? data.conversations : [...prev, ...data.conversations]
        );
        setPagination(paginationData);
      } catch (error) {
        setError("Failed to load conversations. Please try again.");
        Alert.alert(
          "Error",
          "Failed to load conversations. Please try again.",
          [{ text: "OK" }]
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [user]
  );

  useEffect(() => {
    // console.log(user.name)
    if (user?.id) {
      fetchRecentChats();
    }
  }, [fetchRecentChats, user]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchRecentChats(1);
  };

  const loadMore = () => {
    if (!loading && pagination.page < pagination.total_pages) {
      fetchRecentChats(pagination.page + 1);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (days === 1) {
      return "Yesterday";
    } else if (days < 7) {
      return date.toLocaleDateString([], { weekday: "long" });
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    }
  };

  const renderChatItem = ({ item }: { item: ChatTopic }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => {
        router.push({
          pathname: "/chat/[id]" as const,
          params: { id: item.conversation_id },
        });
      }}>
      <View style={styles.avatarContainer}>
        <Ionicons name="chatbubble-ellipses" size={24} color={colors.primary} />
      </View>
      <View style={styles.chatInfo}>
        <View style={styles.chatHeader}>
          <Text style={styles.chatTitle}>
            {item.participants.user.display_name} & {item.participants.ai.name}
          </Text>
          <Text style={styles.timestamp}>
            {formatTimestamp(item.last_message_timestamp)}
          </Text>
        </View>
        <Text style={styles.lastMessage} numberOfLines={1}>
          {item.last_message}
        </Text>
        <View style={styles.metadataContainer}>
          <Text style={styles.metadataText}>
            {item.metadata.context.topic} •
            {/* {item.summary.total_messages}{" "} */}
            messages
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderSectionHeader = ({
    section: { date },
  }: {
    section: { date: string };
  }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderText}>
        {new Date(date).toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </Text>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

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

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <FlatList
        data={recentChats}
        renderItem={renderChatItem}
        keyExtractor={(item) => item.conversation_id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
          />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loading && refreshing ? (
            <ActivityIndicator
              style={styles.footerLoader}
              color={colors.primary}
            />
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
    marginBottom: 4,
  },
  metadataContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  metadataText: {
    fontSize: 12,
    color: colors.textTertiary,
  },
  sectionHeader: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: colors.background,
  },
  sectionHeaderText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  errorContainer: {
    padding: 16,
    backgroundColor: colors.error,
    margin: 16,
    borderRadius: 8,
  },
  errorText: {
    color: colors.textLight,
    textAlign: "center",
  },
  footerLoader: {
    paddingVertical: 16,
  },
});
