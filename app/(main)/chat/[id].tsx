import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { colors } from "@/app/theme/colors";
import { useUser } from "@/context/UserContext";

interface Message {
  message_id: string;
  sender: "user" | "ai";
  content: string;
  timestamp: string;
  status: string;
  metadata: {
    input_type?: string;
    device?: string;
    response_time_ms?: number;
    confidence_score?: number;
  };
}

interface Conversation {
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
  messages: Message[];
  status: string;
  summary: {
    total_messages: number;
    last_message_id: string;
    last_message_timestamp: string;
  };
}

export default function ChatScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const user = useUser();
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const fetchConversation = useCallback(async () => {
    try {
      setError(null);
      const response = await fetch(`http://localhost:8000/chat/${id}`);

      if (!response.ok) {
        if (response.status === 404) {
          const newResponse = await fetch("http://localhost:8000/chat", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              user_id: user?.id || "anonymous",
              username: user?.name || "User",
              display_name: user?.name || "User",
              message: "Hello",
              platform: "mobile",
              language: "en-US",
              topic: "general",
              timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            }),
          });

          if (!newResponse.ok) {
            throw new Error("Failed to create conversation");
          }

          const data = await newResponse.json();
          setConversation(data);
        } else {
          throw new Error("Failed to fetch conversation");
        }
      } else {
        const data = await response.json();
        setConversation(data);
      }
    } catch (error) {
      console.error("Error fetching conversation:", error);
      setError("Failed to load conversation. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [id, user]);

  useEffect(() => {
    console.log(id, "id in the id.tsx file");
    fetchConversation();
  }, [fetchConversation]);

  const sendMessage = async () => {
    if (!message.trim() || !conversation) return;

    try {
      setSending(true);
      const response = await fetch(`http://localhost:8000/chat/${id}/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sender: "user",
          content: message,
          metadata: {
            input_type: "text",
            device: Platform.OS,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      setMessage("");
      fetchConversation();
    } catch (error) {
      console.error("Error sending message:", error);
      setError("Failed to send message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View
      style={[
        styles.messageContainer,
        item.sender === "user" ? styles.userMessage : styles.aiMessage,
      ]}>
      <View
        style={[
          styles.messageBubble,
          item.sender === "user" ? styles.userBubble : styles.aiBubble,
        ]}>
        <Text style={styles.messageText}>{item.content}</Text>
        <Text style={styles.timestamp}>{formatTimestamp(item.timestamp)}</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={fetchConversation}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>
            {conversation?.participants.user.display_name} &{" "}
            {conversation?.participants.ai.name}
          </Text>
          <Text style={styles.headerSubtitle}>
            {conversation?.metadata.context.topic}
          </Text>
        </View>
      </View>

      <FlatList
        data={conversation?.messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.message_id}
        contentContainerStyle={styles.messagesContainer}
        inverted
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="Type a message..."
          placeholderTextColor={colors.textSecondary}
          multiline
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            !message.trim() && styles.sendButtonDisabled,
          ]}
          onPress={sendMessage}
          disabled={!message.trim() || sending}>
          {sending ? (
            <ActivityIndicator size="small" color={colors.textLight} />
          ) : (
            <Ionicons name="send" size={24} color={colors.textLight} />
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: colors.background,
  },
  errorText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  retryButtonText: {
    color: colors.textLight,
    fontSize: 16,
    fontWeight: "600",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  backButton: {
    marginRight: 16,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  messagesContainer: {
    padding: 16,
  },
  messageContainer: {
    marginBottom: 16,
  },
  userMessage: {
    alignItems: "flex-end",
  },
  aiMessage: {
    alignItems: "flex-start",
  },
  messageBubble: {
    maxWidth: "80%",
    padding: 12,
    borderRadius: 16,
  },
  userBubble: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    backgroundColor: colors.surface,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  messageText: {
    fontSize: 16,
    color: colors.textPrimary,
  },
  timestamp: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
    alignSelf: "flex-end",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  input: {
    flex: 1,
    backgroundColor: colors.surfaceLight,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    fontSize: 16,
    color: colors.textPrimary,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: colors.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonDisabled: {
    backgroundColor: colors.textTertiary,
  },
});
