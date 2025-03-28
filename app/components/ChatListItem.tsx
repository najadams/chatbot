import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ChatOptionsModal from "./ChatOptionsModal";

interface ChatListItemProps {
  name: string;
  lastMessage: string;
  time: string;
  unreadCount: number;
  onPress: () => void;
  onOptionPress: (option: string) => void;
}

export default function ChatListItem({
  name,
  lastMessage,
  time,
  unreadCount,
  onPress,
  onOptionPress,
}: ChatListItemProps) {
  const [showOptions, setShowOptions] = useState(false);

  return (
    <>
      <TouchableOpacity style={styles.container} onPress={onPress}>
        <Image
          source={require("../../assets/images/ai-avatar.jpg")}
          style={styles.avatar}
        />
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.time}>{time}</Text>
          </View>
          <View style={styles.footer}>
            <Text
              style={[styles.message, unreadCount > 0 && styles.unreadMessage]}
              numberOfLines={1}>
              {lastMessage}
            </Text>
            {unreadCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{unreadCount}</Text>
              </View>
            )}
          </View>
        </View>
        <TouchableOpacity
          style={styles.moreButton}
          onPress={() => setShowOptions(true)}>
          <Ionicons name="ellipsis-vertical" size={20} color="#95A5A6" />
        </TouchableOpacity>
      </TouchableOpacity>
      <ChatOptionsModal
        visible={showOptions}
        onClose={() => setShowOptions(false)}
        onOptionPress={onOptionPress}
        chatName={name}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E8E8E8",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2C3E50",
  },
  time: {
    fontSize: 14,
    color: "#95A5A6",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  message: {
    fontSize: 14,
    color: "#95A5A6",
    flex: 1,
  },
  unreadMessage: {
    color: "#2C3E50",
    fontWeight: "500",
  },
  badge: {
    backgroundColor: "#2C3E50",
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  moreButton: {
    padding: 8,
    marginLeft: 8,
  },
});
