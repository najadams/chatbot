import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Image,
  Animated,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";

interface Message {
  id: string;
  text: string;
  sender: "user" | "other";
  timestamp: string;
  status?: "sending" | "sent" | "delivered" | "read";
  type?: "text" | "image" | "file";
}

// Mock messages for the chat
const mockMessages: Message[] = [
  {
    id: "1",
    text: "Hi! I'm Reaven, your AI learning assistant. How can I help you today?",
    sender: "other",
    timestamp: "2:30 PM",
    status: "read",
  },
  {
    id: "2",
    text: "I need help with my math homework",
    sender: "user",
    timestamp: "2:31 PM",
    status: "read",
  },
  {
    id: "3",
    text: "Of course! What topic are you working on? I can help you with algebra, calculus, or any other math subject.",
    sender: "other",
    timestamp: "2:32 PM",
    status: "read",
  },
];

export default function ChatDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const inputHeight = useRef(new Animated.Value(40)).current;
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);

  const handleSend = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        text: newMessage.trim(),
        sender: "user",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        status: "sending",
      };
      setMessages([...messages, message]);
      setNewMessage("");
      setIsTyping(false);

      // Reset input height
      Animated.spring(inputHeight, {
        toValue: 40,
        useNativeDriver: false,
        tension: 50,
        friction: 7,
      }).start();

      // Dismiss keyboard
      Keyboard.dismiss();

      // Simulate message sending
      setTimeout(() => {
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === message.id ? { ...msg, status: "sent" } : msg
          )
        );
      }, 1000);

      flatListRef.current?.scrollToEnd({ animated: true });
    }
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View
      style={[
        styles.messageContainer,
        item.sender === "user" ? styles.userMessage : styles.otherMessage,
      ]}>
      {item.sender === "other" && (
        <Image
          source={require("../../../assets/images/ai-avatar.jpg")}
          style={styles.avatar}
        />
      )}
      <View style={styles.messageContent}>
        <View
          style={[
            styles.messageBubble,
            item.sender === "user" ? styles.userBubble : styles.otherBubble,
          ]}>
          <Text
            style={[
              styles.messageText,
              item.sender === "user"
                ? styles.userMessageText
                : styles.otherMessageText,
            ]}>
            {item.text}
          </Text>
        </View>
        <View style={styles.messageFooter}>
          <Text style={styles.timestamp}>{item.timestamp}</Text>
          {item.sender === "user" && item.status && (
            <View style={styles.statusContainer}>
              {item.status === "sending" ? (
                <ActivityIndicator size={12} color="#8E8E93" />
              ) : (
                <Ionicons
                  name={
                    item.status === "read"
                      ? "checkmark-done"
                      : item.status === "delivered"
                      ? "checkmark-done-outline"
                      : "checkmark"
                  }
                  size={16}
                  color={item.status === "read" ? "#4FC3F7" : "#8E8E93"}
                />
              )}
            </View>
          )}
        </View>
      </View>
    </View>
  );

  const handleInputChange = (text: string) => {
    setNewMessage(text);
    setIsTyping(text.length > 0);

    const lines = text.split("\n").length;
    const newHeight = Math.min(Math.max(40, lines * 20 + 20), 120);

    Animated.spring(inputHeight, {
      toValue: newHeight,
      useNativeDriver: false,
      tension: 50,
      friction: 7,
    }).start();
  };

  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
        flatListRef.current?.scrollToEnd({ animated: true });
      }
    );

    const keyboardWillHide = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => {
        setKeyboardHeight(0);
      }
    );

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, []);

  const renderAttachmentMenu = () => (
    <View style={styles.attachmentMenu}>
      <TouchableOpacity style={styles.attachmentOption}>
        <Ionicons name="camera" size={24} color="#007AFF" />
        <Text style={styles.attachmentText}>Camera</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.attachmentOption}>
        <Ionicons name="image" size={24} color="#007AFF" />
        <Text style={styles.attachmentText}>Gallery</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.attachmentOption}>
        <Ionicons name="document" size={24} color="#007AFF" />
        <Text style={styles.attachmentText}>Document</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.attachmentOption}>
        <Ionicons name="location" size={24} color="#007AFF" />
        <Text style={styles.attachmentText}>Location</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#2C3E50" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <View style={styles.headerTop}>
            <Image
              source={require("../../../assets/images/ai-avatar.jpg")}
              style={styles.headerAvatar}
            />
            <View>
              <Text style={styles.headerName}>Reaven AI</Text>
              <Text style={styles.headerStatus}>
                {isTyping ? "Typing..." : "Online"}
              </Text>
            </View>
          </View>
        </View>
        <TouchableOpacity style={styles.moreButton}>
          <Ionicons name="ellipsis-vertical" size={24} color="#2C3E50" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}>
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[
            styles.messagesList,
            { paddingBottom: keyboardHeight > 0 ? 20 : 0 },
          ]}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

        <View style={styles.inputContainer}>
          <TouchableOpacity
            style={styles.attachButton}
            onPress={() => setShowAttachmentMenu(!showAttachmentMenu)}>
            <Ionicons name="add-circle" size={24} color="#2C3E50" />
          </TouchableOpacity>

          {showAttachmentMenu && renderAttachmentMenu()}

          <Animated.View
            style={[
              styles.inputWrapper,
              {
                height: inputHeight,
                maxHeight: 120,
                minHeight: 40,
              },
            ]}>
            <TextInput
              style={styles.input}
              value={newMessage}
              onChangeText={handleInputChange}
              placeholder="Type a message..."
              placeholderTextColor="#95A5A6"
              multiline
              textAlignVertical="center"
            />
          </Animated.View>

          <TouchableOpacity
            style={[
              styles.sendButton,
              !newMessage.trim() && styles.sendButtonDisabled,
            ]}
            onPress={handleSend}
            disabled={!newMessage.trim()}>
            <Ionicons
              name="send"
              size={24}
              color={newMessage.trim() ? "#2C3E50" : "#95A5A6"}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F6FA",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E8E8E8",
  },
  backButton: {
    padding: 8,
  },
  headerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  headerName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2C3E50",
  },
  headerStatus: {
    fontSize: 14,
    color: "#95A5A6",
  },
  moreButton: {
    padding: 8,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  messagesList: {
    padding: 16,
    flexGrow: 1,
  },
  messageContainer: {
    marginBottom: 16,
    maxWidth: "80%",
    flexDirection: "row",
  },
  userMessage: {
    alignSelf: "flex-end",
  },
  otherMessage: {
    alignSelf: "flex-start",
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  messageContent: {
    flex: 1,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 20,
    marginBottom: 4,
  },
  userBubble: {
    backgroundColor: "#2C3E50",
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    backgroundColor: "#FFFFFF",
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
  },
  userMessageText: {
    color: "#FFFFFF",
  },
  otherMessageText: {
    color: "#2C3E50",
  },
  messageFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 4,
  },
  timestamp: {
    fontSize: 12,
    color: "#95A5A6",
  },
  statusContainer: {
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    padding: 12,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E8E8E8",
    paddingBottom: Platform.OS === "ios" ? 12 : 8,
  },
  attachButton: {
    padding: 8,
    marginBottom: 8,
  },
  attachmentMenu: {
    position: "absolute",
    bottom: "100%",
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#E8E8E8",
  },
  attachmentOption: {
    alignItems: "center",
  },
  attachmentText: {
    fontSize: 12,
    color: "#2C3E50",
    marginTop: 4,
  },
  inputWrapper: {
    flex: 1,
    marginHorizontal: 8,
    backgroundColor: "#F5F6FA",
    borderRadius: 20,
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    lineHeight: 20,
    paddingTop: Platform.OS === "ios" ? 8 : 12,
    paddingBottom: Platform.OS === "ios" ? 8 : 12,
  },
  sendButton: {
    padding: 8,
    marginBottom: 8,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});
